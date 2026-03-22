// services/api.ts — API client connecting the Expo frontend to the FastAPI backend
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Configuration ───────────────────────────────────────────────────────────
// In development, point to your local FastAPI server.
// For physical devices, replace localhost with your machine's IP.
const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://172.25.147.19:8000';

const AUTH_TOKEN_KEY = 'auth_token';
const USER_ID_KEY = 'user_id';

// ─── Types (matching FastAPI Pydantic schemas) ───────────────────────────────

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  display_name: string | null;
}

export interface SyncRequest {
  log_date: string;     // "2026-03-21"
  steps: number;
  hydration_ml: number;
  source: 'healthkit' | 'health_connect' | 'manual';
}

export interface SyncResponse {
  status: string;
  log_date: string;
  steps: number;
  hydration_ml: number;
  new_badges: string[];
}

export interface StreakInfo {
  metric: string;       // "steps" | "hydration" | "combined"
  current_streak: number;
  longest_streak: number;
  last_active_date: string | null;
}

export interface DashboardResponse {
  log_date: string;
  steps: number;
  hydration_ml: number;
  step_goal: number;
  hydration_goal_ml: number;
  steps_met: boolean;
  hydration_met: boolean;
  streaks: StreakInfo[];
  display_name: string | null;
  total_steps: number;
}

export interface DayRecord {
  date: string;
  steps: number;
  goal_met: boolean;
}

export interface HistoryResponse {
  days: DayRecord[];
  total_steps: number;
  trail_miles: number;
}

export interface AchievementOut {
  badge_id: string;
  name: string;
  description: string;
  emoji: string;
  earned_at: string;
}

export interface AchievementsResponse {
  achievements: AchievementOut[];
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

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body.detail || detail;
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
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
  });

  await saveToken(data.access_token, data.user_id);
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

  await saveToken(data.access_token, data.user_id);
  return data;
}

export async function logout(): Promise<void> {
  await clearToken();
}

// ─── Authenticated Endpoints ─────────────────────────────────────────────────

export async function syncHealthData(body: SyncRequest): Promise<SyncResponse> {
  return request<SyncResponse>(
    '/sync',
    { method: 'POST', body: JSON.stringify(body) },
    true,
  );
}

export async function getDashboard(): Promise<DashboardResponse> {
  return request<DashboardResponse>('/dashboard', {}, true);
}

export async function getHistory(days = 7): Promise<HistoryResponse> {
  return request<HistoryResponse>(`/history?days=${days}`, {}, true);
}

export async function getAchievements(): Promise<AchievementsResponse> {
  return request<AchievementsResponse>('/achievements', {}, true);
}

// ─── Health Check (no auth) ──────────────────────────────────────────────────

export async function healthCheck(): Promise<{ status: string }> {
  return request<{ status: string }>('/health');
}
