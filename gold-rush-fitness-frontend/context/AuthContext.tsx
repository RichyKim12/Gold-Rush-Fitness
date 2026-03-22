// context/AuthContext.tsx — Authentication state management
// Wraps the app and provides login/register/logout + token persistence
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as api from '../services/api';

interface AuthState {
  token: string | null;
  userId: string | null;
  displayName: string | null;
  isLoggedIn: boolean;
  isLoading: boolean;  // true while checking stored token on launch
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  token: null,
  userId: null,
  displayName: null,
  isLoggedIn: false,
  isLoading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    token: null,
    userId: null,
    displayName: null,
    isLoggedIn: false,
    isLoading: true,
  });

  // On mount, check if we have a saved token
  useEffect(() => {
    (async () => {
      try {
        const token = await api.getToken();
        if (token) {
          setState({
            token,
            userId: null,
            displayName: null,
            isLoggedIn: true,
            isLoading: false,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login(email, password);
    setState({
      token: res.access_token,
      userId: res.user_id,
      displayName: res.display_name,
      isLoggedIn: true,
      isLoading: false,
    });
  }, []);

  const register = useCallback(async (email: string, password: string, displayName?: string) => {
    const res = await api.register(email, password, displayName);
    setState({
      token: res.access_token,
      userId: res.user_id,
      displayName: res.display_name,
      isLoggedIn: true,
      isLoading: false,
    });
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setState({
      token: null,
      userId: null,
      displayName: null,
      isLoggedIn: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
