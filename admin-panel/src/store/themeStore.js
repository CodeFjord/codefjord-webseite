import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createTheme } from '@mui/material/styles';

// Light Theme
const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
      light: '#3b82f6',
      dark: '#1d4ed8',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#7c3aed',
      light: '#8b5cf6',
      dark: '#6d28d9',
      contrastText: '#ffffff',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    surface: {
      main: '#ffffff',
      light: '#f8fafc',
      dark: '#e2e8f0',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
    divider: '#e2e8f0',
    success: {
      main: '#10b981',
      light: '#34d399',
      dark: '#059669',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
    },
    error: {
      main: '#ef4444',
      light: '#f87171',
      dark: '#dc2626',
    },
    info: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.05)',
    '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
    '0px 4px 6px rgba(0, 0, 0, 0.07), 0px 2px 4px rgba(0, 0, 0, 0.06)',
    '0px 10px 15px rgba(0, 0, 0, 0.1), 0px 4px 6px rgba(0, 0, 0, 0.05)',
    '0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
    '0px 25px 50px rgba(0, 0, 0, 0.15)',
  ],
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: '#1e293b',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          borderBottom: '1px solid #e2e8f0',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#ffffff',
          borderRight: '1px solid #e2e8f0',
          boxShadow: '4px 0 8px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          margin: '4px 8px',
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: '#eff6ff',
            color: '#2563eb',
            '&:hover': {
              backgroundColor: '#dbeafe',
            },
          },
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          color: 'inherit',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          '&:hover': {
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.07), 0px 2px 4px rgba(0, 0, 0, 0.06)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
          borderRadius: 12,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#f8fafc',
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: '#374151',
            borderBottom: '2px solid #e5e7eb',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #f3f4f6',
          padding: '12px 16px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0px 20px 25px rgba(0, 0, 0, 0.1), 0px 10px 10px rgba(0, 0, 0, 0.04)',
        },
      },
    },
  },
});

// Dark Theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3b82f6',
      light: '#60a5fa',
      dark: '#2563eb',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed',
      contrastText: '#ffffff',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    surface: {
      main: '#1e293b',
      light: '#334155',
      dark: '#0f172a',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
    },
    divider: '#334155',
    success: {
      main: '#22c55e',
      light: '#4ade80',
      dark: '#16a34a',
    },
    warning: {
      main: '#fbbf24',
      light: '#fcd34d',
      dark: '#f59e0b',
    },
    error: {
      main: '#f87171',
      light: '#fca5a5',
      dark: '#ef4444',
    },
    info: {
      main: '#60a5fa',
      light: '#93c5fd',
      dark: '#3b82f6',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.125rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '0.875rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.8125rem',
      lineHeight: 1.6,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: [
    'none',
    '0px 1px 2px rgba(0, 0, 0, 0.3)',
    '0px 1px 3px rgba(0, 0, 0, 0.4), 0px 1px 2px rgba(0, 0, 0, 0.3)',
    '0px 4px 6px rgba(0, 0, 0, 0.4), 0px 2px 4px rgba(0, 0, 0, 0.3)',
    '0px 10px 15px rgba(0, 0, 0, 0.4), 0px 4px 6px rgba(0, 0, 0, 0.3)',
    '0px 20px 25px rgba(0, 0, 0, 0.4), 0px 10px 10px rgba(0, 0, 0, 0.3)',
    '0px 25px 50px rgba(0, 0, 0, 0.5)',
    '0px 25px 50px rgba(0, 0, 0, 0.5)',
    '0px 25px 50px rgba(0, 0, 0, 0.5)',
    '0px 25px 50px rgba(0, 0, 0, 0.5)',
    '0px 25px 50px rgba(0, 0, 0, 0.5)',
    '0px 25px 50px rgba(0, 0, 0, 0.5)',
    '0px 25px 50px rgba(0, 0, 0, 0.5)',
    '0px 25px 50px rgba(0, 0, 0, 0.5)',
    '0px 25px 50px rgba(0, 0, 0, 0.5)',
    '0px 25px 50px rgba(0, 0, 0, 0.5)',
    '0px 25px 50px rgba(0, 0, 0, 0.5)',
    '0px 25px 50px rgba(0, 0, 0, 0.5)',
    '0px 25px 50px rgba(0, 0, 0, 0.5)',
    '0px 25px 50px rgba(0, 0, 0, 0.5)',
    '0px 25px 50px rgba(0, 0, 0, 0.5)',
    '0px 25px 50px rgba(0, 0, 0, 0.5)',
    '0px 25px 50px rgba(0, 0, 0, 0.5)',
  ],
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#1e293b',
          color: '#f8fafc',
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.4), 0px 1px 2px rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid #334155',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: '#1e293b',
          borderRight: '1px solid #334155',
          boxShadow: '4px 0 8px rgba(0, 0, 0, 0.3)',
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          margin: '4px 8px',
          borderRadius: 8,
          '&.Mui-selected': {
            backgroundColor: '#1e40af',
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#1d4ed8',
            },
          },
          '&:hover': {
            backgroundColor: '#334155',
          },
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 40,
          color: 'inherit',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.4), 0px 1px 2px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.4), 0px 2px 4px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.4), 0px 1px 2px rgba(0, 0, 0, 0.3)',
          border: '1px solid #334155',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.4), 0px 1px 2px rgba(0, 0, 0, 0.3)',
          border: '1px solid #334155',
          borderRadius: 12,
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          backgroundColor: '#334155',
          '& .MuiTableCell-head': {
            fontWeight: 600,
            color: '#f8fafc',
            borderBottom: '2px solid #475569',
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: '1px solid #475569',
          padding: '12px 16px',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          fontWeight: 500,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
          boxShadow: '0px 20px 25px rgba(0, 0, 0, 0.4), 0px 10px 10px rgba(0, 0, 0, 0.3)',
        },
      },
    },
  },
});

const useThemeStore = create(
  persist(
    (set, get) => ({
      // Theme-Modi: 'light', 'dark', 'system'
      theme: 'system',
      
      // Aktueller effektiver Theme (light oder dark basierend auf system preference)
      effectiveTheme: 'light',
      
      // Aktuelles Material-UI Theme
      currentTheme: lightTheme,
      
      // Theme setzen
      setTheme: (newTheme) => {
        set({ theme: newTheme });
        
        // Effektiven Theme basierend auf System-Präferenz berechnen
        const effectiveTheme = newTheme === 'system' 
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : newTheme;
        
        // Material-UI Theme basierend auf effektivem Theme setzen
        const currentTheme = effectiveTheme === 'dark' ? darkTheme : lightTheme;
        
        set({ effectiveTheme, currentTheme });
        
        // Meta-Tags aktualisieren
        updateMetaThemeColor(effectiveTheme);
      },
      
      // System-Präferenz-Änderungen überwachen
      initTheme: () => {
        const { theme } = get();
        const effectiveTheme = theme === 'system' 
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : theme;
        
        const currentTheme = effectiveTheme === 'dark' ? darkTheme : lightTheme;
        
        set({ effectiveTheme, currentTheme });
        updateMetaThemeColor(effectiveTheme);
        
        // System-Präferenz-Änderungen überwachen
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
          if (get().theme === 'system') {
            const newEffectiveTheme = e.matches ? 'dark' : 'light';
            const newCurrentTheme = newEffectiveTheme === 'dark' ? darkTheme : lightTheme;
            set({ effectiveTheme: newEffectiveTheme, currentTheme: newCurrentTheme });
            updateMetaThemeColor(newEffectiveTheme);
          }
        };
        
        mediaQuery.addEventListener('change', handleChange);
        
        // Cleanup-Funktion zurückgeben
        return () => mediaQuery.removeEventListener('change', handleChange);
      },
      
      // Theme zyklisch wechseln
      cycleTheme: () => {
        const { theme } = get();
        const themes = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        get().setTheme(themes[nextIndex]);
      },
      
      // Theme-Toggle (nur zwischen light und dark)
      toggleTheme: () => {
        const { theme } = get();
        if (theme === 'system') {
          // Wenn system, dann basierend auf aktueller System-Präferenz
          const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          get().setTheme(isDark ? 'light' : 'dark');
        } else {
          // Direkt zwischen light und dark wechseln
          get().setTheme(theme === 'light' ? 'dark' : 'light');
        }
      }
    }),
    {
      name: 'admin-theme-storage',
      partialize: (state) => ({ theme: state.theme })
    }
  )
);

// Meta Theme Color aktualisieren
const updateMetaThemeColor = (theme) => {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#1e293b' : '#ffffff');
  }
};

export default useThemeStore; 