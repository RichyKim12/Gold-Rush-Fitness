// context/AppDataContext.tsx — Shared app data across all tabs
// Replaces direct MOCK_STATE imports with live API data.
// Wraps the (tabs) layout so data is fetched once and shared.
import React, { createContext, useContext } from 'react';
import { useAppData } from '../hooks/useAppData';
import type { AppState } from '../constants/mockData';
import { MOCK_STATE } from '../constants/mockData';

interface AppDataContextType {
  state: AppState;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  syncHealthData: (steps: number, hydrationMl: number) => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType>({
  state: MOCK_STATE,
  isLoading: true,
  error: null,
  refresh: async () => {},
  syncHealthData: async () => {},
});

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const data = useAppData();
  return (
    <AppDataContext.Provider value={data}>
      {children}
    </AppDataContext.Provider>
  );
}

export function useAppState() {
  return useContext(AppDataContext);
}
