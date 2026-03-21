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
  // UI surfaces — slightly warmer/richer base
  bgDeep: '#f0e6cc',
  bgCard: 'rgba(255, 252, 242, 0.97)',
  bgCardLight: 'rgba(139, 94, 60, 0.09)',
  border: 'rgba(140, 90, 10, 0.35)',

  // Text — much darker for contrast
  parchment: '#0f0700',          // near-black, was #2c1a08
  parchmentDark: '#3a2008',      // deeper brown, was #5c3d1e
  inkDark: '#000000',
  inkBrown: '#f0e6cc',
  dirtLight: '#5a3010',          // darker for secondary text, was #7a4f2c

  // Gradient stops — slightly richer
  gradientTop: '#f0e6cc',
  gradientBottom: '#dcc88a',     // more saturated gold, was #e8d5a8

  // Accents — richer, more saturated
  trailGold: '#8a6000',          // deeper gold, was #b8860b
  sunOrange: '#a04010',          // deeper orange-brown, was #c0621a
  sunGold: '#b87800',            // was #d4a017
  dirt: '#8b5e3c',
  dirtDark: '#c4956a',

  // Health — deeper/richer for better legibility on light bg
  healthFull: '#1e6e1e',         // darker green, was #3a8a3a
  healthGood: '#a05c00',         // darker amber, was #c87d20
  healthLow: '#8a1a1a',          // darker red, was #b03030
  healthEmpty: '#d4b896',

  // Scene
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