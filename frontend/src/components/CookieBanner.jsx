import React, { useState, useEffect } from 'react';
import useCookies from '../hooks/useCookies.js';
import './CookieBanner.css';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  
  const {
    cookiePreferences,
    hasConsent,
    saveCookiePreferences,
    acceptAll,
    rejectAll,
    withdrawConsent,
    updatePreference
  } = useCookies();

  useEffect(() => {
    // Zeige Banner nur wenn keine Einwilligung vorliegt
    if (!hasConsent) {
      setShowBanner(true);
    }
  }, [hasConsent]);

  const handleAcceptAll = () => {
    acceptAll();
    setShowBanner(false);
  };

  const handleAcceptSelected = () => {
    saveCookiePreferences(cookiePreferences);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    rejectAll();
    setShowBanner(false);
  };

  const handlePreferenceChange = (category) => {
    if (category === 'necessary') return; // Notwendige Cookies können nicht deaktiviert werden
    
    updatePreference(category, !cookiePreferences[category]);
  };

  const handleWithdrawConsent = () => {
    withdrawConsent();
    setShowBanner(true);
    setShowDetails(false);
  };

  if (!showBanner) {
    return (
      <div className="cookie-withdraw">
        <button 
          onClick={handleWithdrawConsent}
          className="cookie-withdraw-btn"
          aria-label="Cookie-Einstellungen ändern"
        >
          🍪 Cookie-Einstellungen
        </button>
      </div>
    );
  }

  return (
    <div className="cookie-banner-overlay">
      <div className="cookie-banner">
        <div className="cookie-header">
          <h3>🍪 Cookie-Einstellungen</h3>
          <p>
            Wir verwenden Cookies, um Ihre Erfahrung auf unserer Website zu verbessern. 
            Einige Cookies sind für die Funktionalität der Website erforderlich, andere helfen uns, 
            die Website zu optimieren und Ihnen personalisierte Inhalte anzubieten.
          </p>
        </div>

        {showDetails && (
          <div className="cookie-details">
            <div className="cookie-category">
              <div className="cookie-category-header">
                <label className="cookie-checkbox">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.necessary}
                    disabled
                    readOnly
                  />
                  <span className="checkmark"></span>
                  <strong>Notwendige Cookies</strong>
                  <span className="cookie-required">(Erforderlich)</span>
                </label>
              </div>
              <p>
                Diese Cookies sind für die Grundfunktionen der Website erforderlich und können nicht deaktiviert werden. 
                Sie enthalten keine persönlichen Daten.
              </p>
            </div>

            <div className="cookie-category">
              <div className="cookie-category-header">
                <label className="cookie-checkbox">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.analytics}
                    onChange={() => handlePreferenceChange('analytics')}
                  />
                  <span className="checkmark"></span>
                  <strong>Analyse-Cookies</strong>
                </label>
              </div>
              <p>
                Diese Cookies helfen uns zu verstehen, wie Besucher mit der Website interagieren, 
                indem Informationen anonym gesammelt und gemeldet werden.
              </p>
            </div>

            <div className="cookie-category">
              <div className="cookie-category-header">
                <label className="cookie-checkbox">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.marketing}
                    onChange={() => handlePreferenceChange('marketing')}
                  />
                  <span className="checkmark"></span>
                  <strong>Marketing-Cookies</strong>
                </label>
              </div>
              <p>
                Diese Cookies werden verwendet, um Besuchern relevante Anzeigen und Marketingkampagnen bereitzustellen. 
                Diese Cookies verfolgen Besucher über Websites hinweg und sammeln Informationen, 
                um maßgeschneiderte Anzeigen bereitzustellen.
              </p>
            </div>

            <div className="cookie-category">
              <div className="cookie-category-header">
                <label className="cookie-checkbox">
                  <input
                    type="checkbox"
                    checked={cookiePreferences.preferences}
                    onChange={() => handlePreferenceChange('preferences')}
                  />
                  <span className="checkmark"></span>
                  <strong>Präferenz-Cookies</strong>
                </label>
              </div>
              <p>
                Diese Cookies ermöglichen es der Website, sich an Entscheidungen zu erinnern, 
                die Sie treffen, um Ihnen eine verbesserte und personalisierte Erfahrung zu bieten.
              </p>
            </div>
          </div>
        )}

        <div className="cookie-actions">
          <div className="cookie-primary-actions">
            <button 
              onClick={handleAcceptAll}
              className="cookie-btn cookie-btn-primary"
            >
              Alle akzeptieren
            </button>
            <button 
              onClick={handleAcceptSelected}
              className="cookie-btn cookie-btn-secondary"
            >
              Auswahl speichern
            </button>
            <button 
              onClick={handleRejectAll}
              className="cookie-btn cookie-btn-secondary"
            >
              Alle ablehnen
            </button>
          </div>
          
          <div className="cookie-secondary-actions">
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="cookie-details-btn"
            >
              {showDetails ? 'Details ausblenden' : 'Details anzeigen'}
            </button>
            <a 
              href="/datenschutz" 
              className="cookie-privacy-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              Datenschutzerklärung
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner; 