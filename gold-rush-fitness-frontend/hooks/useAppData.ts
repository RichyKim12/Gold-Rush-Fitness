// hooks/useAppData.ts — Replaces MOCK_STATE with live backend data
// Fetches from /dashboard, /history, and /achievements, then maps
// the API responses into the AppState shape the screens expect.
import { useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';
import type { AppState, DayRecord } from '../constants/mockData';
import { MOCK_STATE } from '../constants/mockData';

interface UseAppDataReturn {
  state: AppState;
  achievements: api.AchievementOut[];
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

/**
 * Derive gamified fields from backend data to match the AppState interface.
 * - rations/pace are computed from streak length
 * - healthScore is based on 7-day goal consistency
 */
function deriveGameState(
  dashboard: api.DashboardResponse,
  history: api.HistoryResponse,
  achievements: api.AchievementsResponse,
): AppState {
  // Find the steps streak
  const stepsStreak = dashboard.streaks.find(s => s.metric === 'steps');
  const currentStreak = stepsStreak?.current_streak ?? 0;
  const longestStreak = stepsStreak?.longest_streak ?? 0;

  // Week history — map API DayRecord to frontend DayRecord
  const weekHistory: DayRecord[] = history.days.map(d => ({
    date: d.date,
    steps: d.steps,
    goalMet: d.goal_met,
  }));

  // Health score: based on 7-day consistency (how many goals met out of 7)
  const daysHit = weekHistory.filter(d => d.goalMet).length;
  const baseScore = Math.round((daysHit / 7) * 80); // up to 80 from consistency
  const streakBonus = currentStreak >= 7 ? 15 : currentStreak >= 3 ? 8 : 0;
  const healthScore = Math.min(100, baseScore + streakBonus + 5); // +5 base

  // Rations: mapped from streak
  const rations: AppState['rations'] =
    currentStreak >= 7 ? 'Filling' :
    currentStreak >= 3 ? 'Meager' : 'Bare Bones';

  // Pace: mapped from today's progress toward goal
  const stepPercent = dashboard.step_goal > 0
    ? dashboard.steps / dashboard.step_goal
    : 0;
  const pace: AppState['pace'] =
    stepPercent >= 1.2 ? 'Grueling' :
    stepPercent >= 1.0 ? 'Strenuous' :
    stepPercent >= 0.5 ? 'Steady' : 'Leisurely';

  // Unlocked rewards — map backend badge_ids
  const unlockedRewards = achievements.achievements.map(a => a.badge_id);

  return {
    playerName: dashboard.display_name || 'Pioneer',
    partySize: 4, // Cosmetic — could be user-settable later
    trailMiles: history.trail_miles,
    currentStreak,
    longestStreak,
    totalSteps: history.total_steps,
    todaySteps: dashboard.steps,
    weekHistory,
    unlockedRewards,
    healthScore,
    rations,
    pace,
  };
}

export function useAppData(): UseAppDataReturn {
  const [state, setState] = useState<AppState>(MOCK_STATE);
  const [achievements, setAchievements] = useState<api.AchievementOut[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch all three endpoints in parallel
      const [dashboard, history, achievementsRes] = await Promise.all([
        api.getDashboard(),
        api.getHistory(7),
        api.getAchievements(),
      ]);

      const derived = deriveGameState(dashboard, history, achievementsRes);
      setState(derived);
      setAchievements(achievementsRes.achievements);
    } catch (err: any) {
      setError(err.detail || err.message || 'Failed to load data');
      // Keep showing previous state (or mock) on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { state, achievements, isLoading, error, refresh };
}
