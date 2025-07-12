import { create } from 'zustand';
import { adminApi } from '../api/cms.js';

const useAuth = create((set, get) => ({
  isAdmin: false,
  loading: false,
  error: null,

  // Prüfe ob Admin angemeldet ist (über API)
  checkAdminStatus: async () => {
    set({ loading: true });
    try {
      const result = await adminApi.checkStatus();
      console.log('API admin status check result:', result);
      set({ isAdmin: result.isAdmin, loading: false });
      return result.isAdmin;
    } catch (error) {
      console.error('Error checking admin status:', error);
      set({ isAdmin: false, loading: false });
      return false;
    }
  },

  // Setze Admin-Status
  setAdminStatus: (status) => {
    set({ isAdmin: status });
  },

  // Logout (Token entfernen)
  logout: () => {
    localStorage.removeItem('token');
    set({ isAdmin: false });
    console.log('Logged out, admin status set to false');
  },

  // Initialisiere Auth-Status
  init: async () => {
    set({ loading: true });
    const isAdmin = await get().checkAdminStatus();
    set({ loading: false });
    console.log('Auth initialized, admin status:', isAdmin);
    return isAdmin;
  },

  // Event Listener für localStorage Änderungen
  setupStorageListener: () => {
    const handleStorageChange = (e) => {
      if (e.key === 'token') {
        console.log('Token changed in localStorage:', e.newValue ? 'added' : 'removed');
        get().checkAdminStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Auch auf same-origin Änderungen hören
    const originalSetItem = localStorage.setItem;
    const originalRemoveItem = localStorage.removeItem;
    
    localStorage.setItem = function(key, value) {
      originalSetItem.apply(this, arguments);
      if (key === 'token') {
        console.log('Token set via setItem');
        setTimeout(() => get().checkAdminStatus(), 100); // Kleine Verzögerung für API
      }
    };
    
    localStorage.removeItem = function(key) {
      originalRemoveItem.apply(this, arguments);
      if (key === 'token') {
        console.log('Token removed via removeItem');
        get().checkAdminStatus();
      }
    };

    // URL-Parameter werden jetzt direkt in App.jsx geprüft
    console.log('Storage listener setup complete');
  }
}));

export default useAuth; 