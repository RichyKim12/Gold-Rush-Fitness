// constants/theme.ts

export const Colors = {
  // Sky & landscape
  skyDark: '#0d1b2a',
  skyMid: '#1b3a5c',
  skyHorizon: '#c17f3a',
  sunOrange: '#e8873a',
  sunGold: '#f5c842',

  // Earth tones
  dirt: '#8b5e3c',
  dirtDark: '#5c3d1e',
  dirtLight: '#c4956a',
  prairie: '#6b8f3e',
  prairieDark: '#4a6329',

  // UI colors
  parchment: '#f2e8d0',
  parchmentDark: '#c9b99a',
  inkDark: '#1a0f00',
  inkBrown: '#3d2b1f',

  // Health bar colors
  healthFull: '#5cb85c',
  healthGood: '#f0ad4e',
  healthLow: '#d9534f',
  healthEmpty: '#4a2020',

  // Accent
  trailGold: '#d4a017',
  oxenBrown: '#7a4f2c',
  wagonGray: '#8a8070',

  // Background
  bgDeep: '#0a0600',
  bgCard: 'rgba(30, 18, 6, 0.85)',
  bgCardLight: 'rgba(242, 232, 208, 0.08)',
  border: 'rgba(212, 160, 23, 0.3)',
};

export const Fonts = {
  // Use system serif for now — swap with custom in real build
  display: 'serif',
  body: 'monospace',
};

export const TRAIL_TOTAL_MILES = 2170; // Oregon Trail length in miles

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
