import { useState, useEffect } from 'react';

const useCookies = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    // Lade gespeicherte Cookie-Einwilligung beim Start
    const savedConsent = localStorage.getItem('cookieConsent');
    if (savedConsent) {
      try {
        const preferences = JSON.parse(savedConsent);
        setCookiePreferences(preferences);
        setHasConsent(true);
      } catch (error) {
        console.error('Fehler beim Laden der Cookie-Präferenzen:', error);
        localStorage.removeItem('cookieConsent');
      }
    }
  }, []);

  const saveCookiePreferences = (preferences) => {
    setCookiePreferences(preferences);
    setHasConsent(true);
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    
    // Hier können spezifische Cookies basierend auf Präferenzen gesetzt werden
    if (preferences.analytics) {
      enableAnalytics();
    }
    if (preferences.marketing) {
      enableMarketing();
    }
    if (preferences.preferences) {
      enablePreferences();
    }
  };

  const acceptAll = () => {
    const allAccepted = {
      necessary: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    saveCookiePreferences(allAccepted);
  };

  const rejectAll = () => {
    const onlyNecessary = {
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    saveCookiePreferences(onlyNecessary);
  };

  const withdrawConsent = () => {
    localStorage.removeItem('cookieConsent');
    setHasConsent(false);
    setCookiePreferences({
      necessary: true,
      analytics: false,
      marketing: false,
      preferences: false
    });
    
    // Cookies entfernen
    disableAnalytics();
    disableMarketing();
    disablePreferences();
  };

  // Funktionen zum Aktivieren/Deaktivieren spezifischer Cookie-Typen
  const enableAnalytics = () => {
    // Google Analytics aktivieren
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
    console.log('Analytics-Cookies aktiviert');
  };

  const disableAnalytics = () => {
    // Google Analytics deaktivieren
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'denied'
      });
    }
    console.log('Analytics-Cookies deaktiviert');
  };

  const enableMarketing = () => {
    // Marketing-Cookies aktivieren (z.B. Facebook Pixel, Google Ads)
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('consent', 'grant');
    }
    console.log('Marketing-Cookies aktiviert');
  };

  const disableMarketing = () => {
    // Marketing-Cookies deaktivieren
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('consent', 'revoke');
    }
    console.log('Marketing-Cookies deaktiviert');
  };

  const enablePreferences = () => {
    // Präferenz-Cookies aktivieren
    console.log('Präferenz-Cookies aktiviert');
  };

  const disablePreferences = () => {
    // Präferenz-Cookies deaktivieren
    console.log('Präferenz-Cookies deaktiviert');
  };

  const updatePreference = (category, value) => {
    if (category === 'necessary') return; // Notwendige Cookies können nicht geändert werden
    
    const newPreferences = {
      ...cookiePreferences,
      [category]: value
    };
    
    setCookiePreferences(newPreferences);
    
    // Sofort anwenden
    if (value) {
      switch (category) {
        case 'analytics':
          enableAnalytics();
          break;
        case 'marketing':
          enableMarketing();
          break;
        case 'preferences':
          enablePreferences();
          break;
        default:
          break;
      }
    } else {
      switch (category) {
        case 'analytics':
          disableAnalytics();
          break;
        case 'marketing':
          disableMarketing();
          break;
        case 'preferences':
          disablePreferences();
          break;
        default:
          break;
      }
    }
  };

  return {
    cookiePreferences,
    hasConsent,
    saveCookiePreferences,
    acceptAll,
    rejectAll,
    withdrawConsent,
    updatePreference,
    enableAnalytics,
    disableAnalytics,
    enableMarketing,
    disableMarketing,
    enablePreferences,
    disablePreferences
  };
};

export default useCookies; 