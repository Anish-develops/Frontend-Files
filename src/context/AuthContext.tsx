import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';
import { INITIAL_CURRENT_USER, INITIAL_MEMBERS } from '../services/mockData';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password?: string) => Promise<void>;
  signup: (data: Partial<User> & { name: string; email: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  switchDemoUser: (persona: 'alex' | 'elena' | 'marcus') => Promise<void>;
  updateUserDirectly: (updated: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const current = await api.auth.getCurrentUser();
      setUser(current);
    } catch (e) {
      console.error('Error refreshing user:', e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const u = await api.auth.login(email, password);
      setUser(u);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (data: Partial<User> & { name: string; email: string }) => {
    setIsLoading(true);
    try {
      const u = await api.auth.signup(data);
      setUser(u);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await api.auth.logout();
    setUser(null);
  };

  const updateUserDirectly = (updated: User) => {
    setUser(updated);
  };

  const switchDemoUser = async (persona: 'alex' | 'elena' | 'marcus') => {
    setIsLoading(true);
    try {
      if (persona === 'alex') {
        localStorage.setItem('skillswap_current_user', JSON.stringify(INITIAL_CURRENT_USER));
        localStorage.setItem('skillswap_token', 'dummy-token-alex');
        setUser(INITIAL_CURRENT_USER);
      } else if (persona === 'elena') {
        const elena = INITIAL_MEMBERS.find((m) => m.id === 'member-elena')!;
        localStorage.setItem('skillswap_current_user', JSON.stringify(elena));
        localStorage.setItem('skillswap_token', 'dummy-token-elena');
        setUser(elena);
      } else if (persona === 'marcus') {
        const marcus = INITIAL_MEMBERS.find((m) => m.id === 'member-marcus')!;
        localStorage.setItem('skillswap_current_user', JSON.stringify(marcus));
        localStorage.setItem('skillswap_token', 'dummy-token-marcus');
        setUser(marcus);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        refreshUser,
        switchDemoUser,
        updateUserDirectly,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
