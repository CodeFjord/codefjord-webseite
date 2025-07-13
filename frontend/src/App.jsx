import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import CookieBanner from './components/CookieBanner';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import PortfolioDetail from './pages/PortfolioDetail';
import Impressum from './pages/Impressum';
import Datenschutz from './pages/Datenschutz';
import Page from './pages/Page';
import ComingSoon from './pages/ComingSoon';
import Maintenance from './pages/Maintenance';
import ConstructionFrame from './components/ConstructionFrame';
import './App.css';
import './styles/theme.css';
import logo from './assets/images/codefjord-white.png';
import { websiteSettingsApi } from './api/cms.js';
import useAuth from './store/auth.js';
import useThemeStore from './store/themeStore.js';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [websiteSettings, setWebsiteSettings] = useState({
    coming_soon_enabled: 'false',
    maintenance_enabled: 'false'
  });
  const { isAdmin, init: initAuth, setupStorageListener, setAdminStatus } = useAuth();
  const { initTheme } = useThemeStore();

  useEffect(() => {
    // Initialisiere Auth-Status und Website-Einstellungen
    const initializeApp = async () => {
      // Setup Storage Listener für Token-Änderungen
      setupStorageListener();
      
      // URL-Parameter werden direkt in der Render-Logik geprüft
      
      // Initialisiere Auth-Status
      await initAuth();
      
      // Initialisiere Theme-System
      const cleanupTheme = initTheme();
      
      // Lade Website-Einstellungen
      try {
        const settings = await websiteSettingsApi.getPublic();
        setWebsiteSettings(settings);
      } catch (error) {
        console.error('Fehler beim Laden der Website-Einstellungen:', error);
      }
      
      // Simuliere Ladezeit für bessere UX
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      
      // Cleanup-Funktion zurückgeben
      return cleanupTheme;
    };

    const cleanup = initializeApp();
    
    // Cleanup beim Unmount
    return () => {
      if (cleanup && typeof cleanup.then === 'function') {
        cleanup.then(cleanupFn => cleanupFn && cleanupFn());
      }
    };
  }, [initAuth, setupStorageListener, initTheme]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <img src={logo} alt="CodeFjord Logo" style={{ width: '80px', marginBottom: '1.5rem', filter: 'drop-shadow(0 4px 24px #00304933)' }} />
        <div className="loading-spinner"></div>
        <h2>CodeFjord</h2>
        <p>Ihre digitale Zukunft beginnt hier</p>
      </div>
    );
  }

  // Prüfe URL-Parameter für Admin-Bypass
  const urlParams = new URLSearchParams(window.location.search);
  const adminToken = urlParams.get('admin_token');
  const isAdminFromUrl = !!adminToken;
  
  // Kombiniere Admin-Status aus Store und URL
  const finalIsAdmin = isAdmin || isAdminFromUrl;
  
  // Debug-Ausgaben
  console.log('Current state:', {
    isAdmin,
    isAdminFromUrl,
    finalIsAdmin,
    maintenance_enabled: websiteSettings.maintenance_enabled,
    coming_soon_enabled: websiteSettings.coming_soon_enabled
  });
  console.log('isAdmin type:', typeof finalIsAdmin, 'value:', finalIsAdmin);

  // Prüfe Website-Einstellungen (nur wenn kein Admin angemeldet ist)
  if (!finalIsAdmin && websiteSettings.maintenance_enabled === 'true') {
    console.log('Showing maintenance page');
    return <Maintenance />;
  }

  if (!finalIsAdmin && websiteSettings.coming_soon_enabled === 'true') {
    console.log('Showing coming soon page');
    return <ComingSoon />;
  }

  console.log('Showing normal website');

  return (
    <Router>
      <ConstructionFrame 
        maintenanceEnabled={websiteSettings.maintenance_enabled === 'true'}
        comingSoonEnabled={websiteSettings.coming_soon_enabled === 'true'}
      >
        <div className="App">
          <ScrollToTop />
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/portfolio/:slug" element={<PortfolioDetail />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogDetail />} />
              <Route path="/impressum" element={<Impressum />} />
              <Route path="/datenschutz" element={<Datenschutz />} />
              <Route path="/page/:slug" element={<Page />} />
            </Routes>
          </main>
          <Footer />
          <CookieBanner />
        </div>
      </ConstructionFrame>
    </Router>
  );
}

export default App;
