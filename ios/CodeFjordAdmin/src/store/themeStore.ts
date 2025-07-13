import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  getCurrentTheme: () => 'light' | 'dark';
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  updateSystemTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'dark',
  isHydrated: false,
  setMode: (mode) => {
    set({ mode });
    AsyncStorage.setItem('themeMode', mode);
  },
  toggleMode: () => {
    const currentMode = get().mode;
    let newMode: ThemeMode;
    
    if (currentMode === 'dark') {
      newMode = 'light';
    } else if (currentMode === 'light') {
      newMode = 'system';
    } else {
      newMode = 'dark';
    }
    
    set({ mode: newMode });
    AsyncStorage.setItem('themeMode', newMode);
  },
  getCurrentTheme: () => {
    const mode = get().mode;
    if (mode === 'system') {
      return Appearance.getColorScheme() || 'light';
    }
    return mode;
  },
  updateSystemTheme: () => {
    // Force re-render when system theme changes
    set({});
  },
  // Hydration aus AsyncStorage
  async hydrate() {
    const stored = await AsyncStorage.getItem('themeMode');
    if (stored === 'dark' || stored === 'light' || stored === 'system') {
      set({ mode: stored as ThemeMode, isHydrated: true });
    } else {
      set({ isHydrated: true });
    }
  },
}));

// Direkt beim Import hydratisieren
useThemeStore.getState().hydrate?.();

// System Theme Change Listener
let appearanceListener: any = null;

export const initializeThemeListener = () => {
  // Cleanup existing listener
  if (appearanceListener) {
    appearanceListener.remove();
  }
  
  // Add new listener
  appearanceListener = Appearance.addChangeListener(({ colorScheme: _colorScheme }) => {
    const store = useThemeStore.getState();
    if (store.mode === 'system') {
      store.updateSystemTheme();
    }
  });
};

export const cleanupThemeListener = () => {
  if (appearanceListener) {
    appearanceListener.remove();
    appearanceListener = null;
  }
}; 