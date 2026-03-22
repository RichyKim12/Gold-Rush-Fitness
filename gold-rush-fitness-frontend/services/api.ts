// services/api.ts — API client connecting the Expo frontend to the FastAPI backend
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

// ─── Configuration ───────────────────────────────────────────────────────────
function getBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  const hostUri = Constants.expoConfig?.hostUri;
  const host = hostUri?.split(':')[0];
  if (host) return `http://${host}:8000`;
  if (Platform.OS === 'android') return 'http://10.0.2.2:8000';
  return 'http://127.0.0.1:8000';
}

const BASE_URL = getBaseUrl();

const AUTH_TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'user_id';

// ─── Types (matching FastAPI Pydantic schemas) ───────────────────────────────

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: number;
  display_name: string;
}

export interface TierDetail {
  tierId: number;
  threshold: number;
  label: string;
  isCompleted: boolean;
}

export interface TodayGoalProgress {
  completedTiers: number;
  totalTiers: number;
  tierDetails: TierDetail[];
}

export interface DayRecord {
  date: string;
  steps: number;
  goalMet: boolean;
}

export interface DashboardResponse {
  playerName: string;
  partySize: number;
  trailMiles: number;
  currentStreak: number;
  longestStreak: number;
  totalSteps: number;
  todaySteps: number;
  weekHistory: DayRecord[];
  unlockedRewards: string[];
  healthScore: number;
  rations: 'Filling' | 'Meager' | 'Bare Bones';
  pace: 'Grueling' | 'Strenuous' | 'Steady' | 'Leisurely';
  vitality: number;
  vitalityMax: number;
  dayOnTrail: number;
  todayGoalProgress: TodayGoalProgress;
}

// ─── Token Management ────────────────────────────────────────────────────────

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(AUTH_TOKEN_KEY);
}

export async function saveToken(token: string, userId: string): Promise<void> {
  await AsyncStorage.setItem(AUTH_TOKEN_KEY, token);
  await AsyncStorage.setItem(USER_ID_KEY, userId);
}

export async function clearToken(): Promise<void> {
  await AsyncStorage.removeItem(AUTH_TOKEN_KEY);
  await AsyncStorage.removeItem(USER_ID_KEY);
}

// ─── HTTP Helpers ────────────────────────────────────────────────────────────

class ApiError extends Error {
  status: number;
  detail: string;

  constructor(status: number, detail: string) {
    super(detail);
    this.name = 'ApiError';
    this.status = status;
    this.detail = detail;
  }
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  authenticated = false,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (authenticated) {
    const token = await getToken();
    if (!token) {
      throw new ApiError(401, 'Not authenticated — please log in');
    }
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError(
      0,
      `Network request failed. Check API server and EXPO_PUBLIC_API_URL (current: ${BASE_URL}).`,
    );
  }

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      if (Array.isArray(body.detail)) {
        detail = body.detail.map((e: any) => e.msg).join(', ');
      } else {
        detail = body.detail || detail;
      }
    } catch {}
    throw new ApiError(res.status, detail);
  }

  return res.json() as Promise<T>;
}

// ─── Auth Endpoints ──────────────────────────────────────────────────────────

export async function register(
  email: string,
  password: string,
  displayName?: string,
): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      display_name: displayName || null,
    }),
  });

  await saveToken(data.access_token, String(data.user_id));
  return data;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  await saveToken(data.access_token, String(data.user_id));
  return data;
}

export async function logout(): Promise<void> {
  await clearToken();
}

// ─── Authenticated Endpoints ─────────────────────────────────────────────────

export async function getDashboard(): Promise<DashboardResponse> {
  return request<DashboardResponse>('/users/me/dashboard', {}, true);
}

// ─── Health Check (no auth) ──────────────────────────────────────────────────

export async function healthCheck(): Promise<{ status: string }> {
  return request<{ status: string }>('/health');
}
