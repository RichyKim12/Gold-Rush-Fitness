// constants/theme.ts

// Re-export from ThemeContext so any file importing Colors still works
export { DarkColors as Colors } from '../context/ThemeContext';

export const Fonts = {
  display: 'PressStart2P_400Regular',
  body: 'PressStart2P_400Regular',
  mono: 'PressStart2P_400Regular',
};

export const TRAIL_TOTAL_MILES = 2170;

export const DAILY_STEP_GOAL = 10000;

export const MILESTONES = [
  { name: 'Independence, MO', mile: 0, emoji: '🏘️' },
  { name: 'Fort Kearny', mile: 320, emoji: '🏰' },
  { name: 'Chimney Rock', mile: 550, emoji: '🗿' },
  { name: 'Fort Laramie', mile: 645, emoji: '⚔️' },
  { name: 'South Pass', mile: 925, emoji: '⛰️' },
  { name: 'Fort Hall', mile: 1288, emoji: '🏰' },
  { name: 'Blue Mountains', mile: 1700, emoji: '🏔️' },
  { name: 'Fort Walla Walla', mile: 1850, emoji: '🛡️' },
  { name: 'Oregon City', mile: 2170, emoji: '🎉' },
];

export const REWARDS = [
  {
    id: 'first_steps',
    title: 'Trail Blazer',
    description: 'Completed your first day on the trail',
    icon: '👟',
    condition: 'Complete 1 day',
    miles: 0,
  },
  {
    id: 'week_streak',
    title: 'Iron Settler',
    description: '7-day step goal streak',
    icon: '🪓',
    condition: '7-day streak',
    miles: 0,
  },
  {
    id: 'fort_kearny',
    title: 'Fort Kearny Reached',
    description: 'Crossed the first 320 trail miles',
    icon: '🏰',
    condition: 'Reach mile 320',
    miles: 320,
  },
  {
    id: 'chimney_rock',
    title: 'Chimney Rock Spotter',
    description: 'Spotted the legendary landmark',
    icon: '🗿',
    condition: 'Reach mile 550',
    miles: 550,
  },
  {
    id: 'halfway',
    title: 'Halfway Hero',
    description: 'Made it to South Pass — halfway there!',
    icon: '⛰️',
    condition: 'Reach mile 1085',
    miles: 1085,
  },
  {
    id: 'oregon_bound',
    title: 'Oregon Bound',
    description: 'You can smell the Willamette Valley',
    icon: '🌲',
    condition: 'Reach mile 2000',
    miles: 2000,
  },
  {
    id: 'oregon_city',
    title: 'Oregon City!',
    description: "You've made it! Welcome to Oregon.",
    icon: '🎉',
    condition: 'Reach mile 2170',
    miles: 2170,
  },
];