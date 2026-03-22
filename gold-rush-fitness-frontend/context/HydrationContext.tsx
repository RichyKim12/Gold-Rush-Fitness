import React, { createContext, useContext, useState } from 'react';

interface HydrationContextType {
  ozLogged: number;
  addOz: (oz: number) => void;
}

const HydrationContext = createContext<HydrationContextType>({
  ozLogged: 0,
  addOz: () => {},
});

export function HydrationProvider({ children }: { children: React.ReactNode }) {
  const [ozLogged, setOzLogged] = useState(0);

  const addOz = (oz: number) => {
    setOzLogged(prev => prev + oz);
  };

  return (
    <HydrationContext.Provider value={{ ozLogged, addOz }}>
      {children}
    </HydrationContext.Provider>
  );
}

export function useHydration() {
  return useContext(HydrationContext);
}
