// hooks/useAppData.ts — Pulls user data from database via API
// Fetches from /users/me/dashboard, then maps to AppState format.
import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import type { AppState } from '../constants/mockData';

interface UseAppDataReturn {
  state: AppState;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

function mapDashboardToAppState(dashboard: api.DashboardResponse): AppState {
  return {
    playerName: dashboard.playerName || 'Pioneer',
    partySize: dashboard.partySize,
    trailMiles: dashboard.trailMiles,
    currentStreak: dashboard.currentStreak,
    longestStreak: dashboard.longestStreak,
    totalSteps: dashboard.totalSteps,
    todaySteps: dashboard.todaySteps,
    weekHistory: dashboard.weekHistory,
    unlockedRewards: dashboard.unlockedRewards,
    healthScore: dashboard.totalSteps === 0 ? 100 : (dashboard.healthScore ?? 100),
    rations: dashboard.rations,
    pace: dashboard.pace,
    dayOnTrail: dashboard.dayOnTrail ?? 0,
  };
}

export function useAppData(): UseAppDataReturn {
  const [state, setState] = useState<AppState>({
    playerName: 'Pioneer',
    partySize: 4,
    trailMiles: 0,
    currentStreak: 0,
    longestStreak: 0,
    totalSteps: 0,
    todaySteps: 0,
    weekHistory: [],
    unlockedRewards: [],
    healthScore: 100,
    rations: 'Filling',
    pace: 'Steady',
    dayOnTrail: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const dashboard = await api.getDashboard();
      const mapped = mapDashboardToAppState(dashboard);
      setState(mapped);
    } catch (err: any) {
      if (err.status === 401) {
        setError(null);
      } else {
        setError(err.detail || err.message || 'Failed to load data');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { state, isLoading, error, refresh };
}
