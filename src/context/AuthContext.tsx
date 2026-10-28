import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (profile: { name?: string; phone?: string }) => Promise<void>;
  changePassword: (passwords: { currentPassword: string; newPassword: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('bookease_token'));
  const [loading, setLoading] = useState<boolean>(true);

  // Restore authenticated session
  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('bookease_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const response = await api.auth.getMe();
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Session verification failed, logging out:', err);
        logout();
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const res = await api.auth.login(credentials);
    if (res.success && res.token) {
      localStorage.setItem('bookease_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const register = async (userData: any) => {
    const res = await api.auth.register(userData);
    if (res.success && res.token) {
      localStorage.setItem('bookease_token', res.token);
      setToken(res.token);
      setUser(res.user);
    }
  };

  const logout = () => {
    localStorage.removeItem('bookease_token');
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (profile: { name?: string; phone?: string }) => {
    const res = await api.auth.updateProfile(profile);
    if (res.success && res.user) {
      setUser(prev => (prev ? { ...prev, ...res.user } : res.user));
    }
  };

  const changePassword = async (passwords: { currentPassword: string; newPassword: string }) => {
    await api.auth.changePassword(passwords);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
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
