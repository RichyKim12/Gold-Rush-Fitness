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

// ─── DARK palette ────────────────────────────────────────────────────────────
export const DarkColors = {
  bgDeep: '#0a0600',
  bgCard: 'rgba(30, 18, 6, 0.85)',
  bgCardLight: 'rgba(242, 232, 208, 0.08)',
  border: 'rgba(212, 160, 23, 0.3)',

  parchment: '#f2e8d0',
  parchmentDark: '#c9b99a',
  inkDark: '#1a0f00',
  inkBrown: '#3d2b1f',
  dirtLight: '#c4956a',

  gradientTop: '#0a0600',
  gradientBottom: '#3d2b1f',

  trailGold: '#d4a017',
  sunOrange: '#e8873a',
  sunGold: '#f5c842',
  dirt: '#8b5e3c',
  dirtDark: '#5c3d1e',

  healthFull: '#5cb85c',
  healthGood: '#f0ad4e',
  healthLow: '#d9534f',
  healthEmpty: '#4a2020',

  skyDark: '#0d1b2a',
  skyMid: '#1b3a5c',
  skyHorizon: '#c17f3a',
};

// ─── LIGHT palette — high contrast ──────────────────────────────────────────
export const LightColors: typeof DarkColors = {
  // Surfaces — warm cream
  bgDeep: '#f0e6cc',
  bgCard: 'rgba(255, 252, 242, 0.97)',
  bgCardLight: 'rgba(100, 60, 10, 0.09)',
  border: 'rgba(100, 60, 10, 0.3)',

  // Text — near-black for maximum contrast on cream
  parchment: '#0f0700',           // almost black — main text
  parchmentDark: '#2a1400',       // very dark brown — secondary text
  inkDark: '#000000',
  inkBrown: '#e8d5a8',            // light cream — used as bg in WagonScene infoRow
  dirtLight: '#4a2200',           // dark brown — hint/muted text

  // Gradient
  gradientTop: '#f0e6cc',
  gradientBottom: '#d8c088',

  // Accents — deep and saturated for contrast on light bg
  trailGold: '#7a4e00',           // deep dark gold
  sunOrange: '#8a3a00',           // deep burnt orange
  sunGold: '#9a6200',
  dirt: '#6b3c18',
  dirtDark: '#c4956a',

  // Health — deep saturated for visibility on light cards
  healthFull: '#1a6e1a',          // deep green
  healthGood: '#8a5200',          // deep amber
  healthLow: '#8a1a1a',           // deep red
  healthEmpty: '#c8a880',

  // Scene (always same)
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

// ─── Font helper ─────────────────────────────────────────────────────────────
// Use this instead of fontFamily: 'monospace' everywhere
export const PIXEL_FONT = 'PressStart2P_400Regular';