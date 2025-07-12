import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useThemeStore = create(
  persist(
    (set, get) => ({
      // Theme-Modi: 'light', 'dark', 'system'
      theme: 'system',
      
      // Aktueller effektiver Theme (light oder dark basierend auf system preference)
      effectiveTheme: 'light',
      
      // Theme setzen
      setTheme: (newTheme) => {
        set({ theme: newTheme });
        
        // Effektiven Theme basierend auf System-Präferenz berechnen
        const effectiveTheme = newTheme === 'system' 
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : newTheme;
        
        set({ effectiveTheme });
        
        // CSS-Klassen und Meta-Tags aktualisieren
        updateThemeClasses(effectiveTheme);
        updateMetaThemeColor(effectiveTheme);
      },
      
      // System-Präferenz-Änderungen überwachen
      initTheme: () => {
        const { theme } = get();
        const effectiveTheme = theme === 'system' 
          ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
          : theme;
        
        set({ effectiveTheme });
        updateThemeClasses(effectiveTheme);
        updateMetaThemeColor(effectiveTheme);
        
        // System-Präferenz-Änderungen überwachen
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
          if (get().theme === 'system') {
            const newEffectiveTheme = e.matches ? 'dark' : 'light';
            set({ effectiveTheme: newEffectiveTheme });
            updateThemeClasses(newEffectiveTheme);
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
      name: 'theme-storage',
      partialize: (state) => ({ theme: state.theme })
    }
  )
);

// CSS-Klassen für Theme aktualisieren
const updateThemeClasses = (theme) => {
  const root = document.documentElement;
  
  // Alle Theme-Klassen entfernen
  root.classList.remove('theme-light', 'theme-dark');
  
  // Neue Theme-Klasse hinzufügen
  root.classList.add(`theme-${theme}`);
  
  // Body-Klasse für zusätzliche Styling-Möglichkeiten
  document.body.classList.remove('theme-light', 'theme-dark');
  document.body.classList.add(`theme-${theme}`);
};

// Meta Theme Color aktualisieren
const updateMetaThemeColor = (theme) => {
  const metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (metaThemeColor) {
    metaThemeColor.setAttribute('content', theme === 'dark' ? '#1f2937' : '#ffffff');
  }
};

export default useThemeStore; 