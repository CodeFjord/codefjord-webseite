import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiClient from '../api/client';

interface User {
  id: number;
  username: string;
  name?: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  forgotPassword: (email: string) => Promise<boolean>;
  verifyResetToken: (token: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, _get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password,
      });

      const { token, user } = response.data;
      
      await AsyncStorage.setItem('authToken', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      
      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
      
      return true;
    } catch (error) {
      set({ isLoading: false });
      console.error('Login error:', error);
      return false;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
    
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const token = await AsyncStorage.getItem('authToken');
      const userStr = await AsyncStorage.getItem('user');
      
      if (token && userStr) {
        const user = JSON.parse(userStr);
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  forgotPassword: async (email: string) => {
    try {
      await apiClient.post('/auth/forgot-password', { email });
      return true;
    } catch (error) {
      console.error('Forgot password error:', error);
      return false;
    }
  },

  verifyResetToken: async (token: string) => {
    try {
      await apiClient.post('/auth/verify-reset-token', { token });
      return true;
    } catch (error) {
      console.error('Verify reset token error:', error);
      return false;
    }
  },

  resetPassword: async (token: string, password: string) => {
    try {
      await apiClient.post('/auth/reset-password', { token, password });
      return true;
    } catch (error) {
      console.error('Reset password error:', error);
      return false;
    }
  },
})); 