import React, { createContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthState } from '../types/auth';
import { authService } from '../services/auth.service';

interface AuthContextType extends AuthState {
  login: (userData: any) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const user = authService.getCurrentUser();
    const token = localStorage.getItem('token');
    
    if (user && token) {
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (userData: any) => {
    const response = await authService.login(userData);
    if (response.success) {
      setState({
        user: response.data,
        token: response.data.token,
        isAuthenticated: true,
        isLoading: false,
      });
    }
  };

  const register = async (userData: any) => {
    const response = await authService.register(userData);
    if (response.success) {
      setState({
        user: response.data,
        token: response.data.token,
        isAuthenticated: true,
        isLoading: false,
      });
    }
  };

  const logout = () => {
    authService.logout();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
