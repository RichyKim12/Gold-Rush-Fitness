// constants/mockData.ts
// In a real app, this would be replaced with AsyncStorage + real pedometer data

export interface DayRecord {
  date: string;
  steps: number;
  goalMet: boolean;
}

export interface AppState {
  playerName: string;
  partySize: number;
  trailMiles: number;
  currentStreak: number;
  longestStreak: number;
  totalSteps: number;
  todaySteps: number;
  weekHistory: DayRecord[];
  unlockedRewards: string[];
  healthScore: number; // 0–100 based on consistency
  rations: 'Filling' | 'Meager' | 'Bare Bones';
  pace: 'Grueling' | 'Strenuous' | 'Steady' | 'Leisurely';
  dayOnTrail: number;
}

export const MOCK_STATE: AppState = {
  playerName: 'Pioneer',
  partySize: 4,
  trailMiles: 387,
  currentStreak: 5,
  longestStreak: 12,
  totalSteps: 387000,
  todaySteps: 6843,
  weekHistory: [
    { date: '2026-03-15', steps: 10234, goalMet: true },
    { date: '2026-03-16', steps: 9876, goalMet: false },
    { date: '2026-03-17', steps: 11200, goalMet: true },
    { date: '2026-03-18', steps: 10001, goalMet: true },
    { date: '2026-03-19', steps: 8500, goalMet: false },
    { date: '2026-03-20', steps: 12300, goalMet: true },
    { date: '2026-03-21', steps: 6843, goalMet: false },
  ],
  unlockedRewards: ['first_steps', 'fort_kearny'],
  healthScore: 72,
  rations: 'Filling',
  pace: 'Steady',
  dayOnTrail: 0,
};
