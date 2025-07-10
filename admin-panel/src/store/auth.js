import { create } from 'zustand';
import { authAPI } from '../api/client';

const useAuth = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const res = await authAPI.login({ email, password });
      localStorage.setItem('token', res.data.token);
      set({ 
        token: res.data.token, 
        user: res.data.user, 
        loading: false 
      });
      return true;
    } catch (err) {
      set({ error: err.response?.data?.error || 'Login fehlgeschlagen', loading: false });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, user: null });
  },

  // Benutzerdaten aktualisieren (z.B. nach Profiländerung)
  updateUser: (userData) => {
    set({ user: userData });
  },

  // User-Daten nach Reload aktualisieren
  refreshUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    set({ loading: true, error: null });
    try {
      const res = await authAPI.getProfile();
      set({ user: res.data, loading: false });
    } catch (err) {
      set({ error: 'Session abgelaufen. Bitte erneut anmelden.', user: null, token: null, loading: false });
      localStorage.removeItem('token');
    }
  },
}));

export default useAuth;
export const useAuthStore = useAuth; 