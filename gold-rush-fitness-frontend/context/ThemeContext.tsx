// context/ThemeContext.tsx
import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

export type ThemePreference = 'dark' | 'light' | 'system';
export type ActiveTheme = 'dark' | 'light';

interface ThemeContextType {
  preference: ThemePreference;
  activeTheme: ActiveTheme;
  setPreference: (pref: ThemePreference) => void;
  colors: typeof DarkColors;
}

// ─── Dark palette (original) ───────────────────────────────────────────────
export const DarkColors = {
  // UI surfaces
  bgDeep: '#0a0600',
  bgCard: 'rgba(30, 18, 6, 0.85)',
  bgCardLight: 'rgba(242, 232, 208, 0.08)',
  border: 'rgba(212, 160, 23, 0.3)',

  // Text
  parchment: '#f2e8d0',
  parchmentDark: '#c9b99a',
  inkDark: '#1a0f00',
  inkBrown: '#3d2b1f',
  dirtLight: '#c4956a',

  // Gradient stops for LinearGradient (must be plain strings, no rgba)
  gradientTop: '#0a0600',
  gradientBottom: '#3d2b1f',

  // Accents
  trailGold: '#d4a017',
  sunOrange: '#e8873a',
  sunGold: '#f5c842',
  dirt: '#8b5e3c',
  dirtDark: '#5c3d1e',

  // Health
  healthFull: '#5cb85c',
  healthGood: '#f0ad4e',
  healthLow: '#d9534f',
  healthEmpty: '#4a2020',

  // Scene colors (unchanged in both modes — it's always a sunset)
  skyDark: '#0d1b2a',
  skyMid: '#1b3a5c',
  skyHorizon: '#c17f3a',
};

// ─── Light palette ──────────────────────────────────────────────────────────
export const LightColors: typeof DarkColors = {
  // UI surfaces
  bgDeep: '#f5efe0',
  bgCard: 'rgba(255, 248, 235, 0.95)',
  bgCardLight: 'rgba(139, 94, 60, 0.07)',
  border: 'rgba(180, 120, 20, 0.3)',

  // Text
  parchment: '#2c1a08',
  parchmentDark: '#5c3d1e',
  inkDark: '#1a0f00',
  inkBrown: '#f0e6cc',
  dirtLight: '#7a4f2c',

  // Gradient stops
  gradientTop: '#f5efe0',
  gradientBottom: '#e8d5a8',

  // Accents
  trailGold: '#b8860b',
  sunOrange: '#c0621a',
  sunGold: '#d4a017',
  dirt: '#8b5e3c',
  dirtDark: '#c4956a',

  // Health
  healthFull: '#3a8a3a',
  healthGood: '#c87d20',
  healthLow: '#b03030',
  healthEmpty: '#d4b896',

  // Scene (same sunset always)
  skyDark: '#0d1b2a',
  skyMid: '#1b3a5c',
  skyHorizon: '#c17f3a',
};

const ThemeContext = createContext<ThemeContextType>({
  preference: 'dark',
  activeTheme: 'dark',
  setPreference: () => {},
  colors: DarkColors,
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemScheme = useColorScheme();
  const [preference, setPreference] = useState<ThemePreference>('dark');

  const activeTheme: ActiveTheme =
    preference === 'system'
      ? (systemScheme === 'light' ? 'light' : 'dark')
      : preference;

  const colors = activeTheme === 'light' ? LightColors : DarkColors;

  return (
    <ThemeContext.Provider value={{ preference, activeTheme, setPreference, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}