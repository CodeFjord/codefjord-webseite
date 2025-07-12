import { useState, useEffect } from 'react';
import { websiteSettingsApi } from '../api/cms.js';
import logo from '../assets/images/codefjord-white.png';
import './ComingSoon.css';

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [settings, setSettings] = useState({
    coming_soon_title: 'Wir kommen jetzt!!',
    coming_soon_message: 'Wir arbeiten hart daran, unsere neue Website zu erstellen. Bald sind wir online!',
    coming_soon_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  });

  useEffect(() => {
    // Lade Website-Einstellungen
    const loadSettings = async () => {
      try {
        const response = await websiteSettingsApi.getPublic();
        console.log('API Response:', response);
        
        // Verwende die API-Daten mit Fallback-Werten
        setSettings({
          coming_soon_title: response.coming_soon_title || 'Wir kommen bald!',
          coming_soon_message: response.coming_soon_message || 'Wir arbeiten hart daran, unsere neue Website zu erstellen. Bald sind wir online!',
          coming_soon_date: response.coming_soon_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        });
      } catch (error) {
        console.error('Fehler beim Laden der Website-Einstellungen:', error);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const targetDate = new Date(settings.coming_soon_date);
      const now = new Date();
      const difference = targetDate - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [settings.coming_soon_date]);

  return (
    <div className="coming-soon">
      <div className="coming-soon-container">
        <div className="logo-section">
          <img src={logo} alt="CodeFjord Logo" className="logo" />
        </div>
        
        <div className="content-section">
          <h1 className="title">{settings.coming_soon_title || 'Wir kommen bald!'}</h1>
          <p className="message">{settings.coming_soon_message || 'Wir arbeiten hart daran, unsere neue Website zu erstellen. Bald sind wir online!'}</p>
          
          <div className="countdown">
            <div className="countdown-item">
              <span className="countdown-number">{timeLeft.days}</span>
              <span className="countdown-label">Tage</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-number">{timeLeft.hours.toString().padStart(2, '0')}</span>
              <span className="countdown-label">Stunden</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-number">{timeLeft.minutes.toString().padStart(2, '0')}</span>
              <span className="countdown-label">Minuten</span>
            </div>
            <div className="countdown-item">
              <span className="countdown-number">{timeLeft.seconds.toString().padStart(2, '0')}</span>
              <span className="countdown-label">Sekunden</span>
            </div>
          </div>
          
          <div className="contact-info">
            <p>Fragen? Kontaktieren Sie uns:</p>
            <a href="mailto:info@codefjord.de" className="contact-link">
              info@code-fjord.de
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <p>&copy; 2025 CodeFjord UG (haftungsbeschränkt) i.G. Alle Rechte vorbehalten.</p>
        </div>
      </div>
      
      {/* Animated background */}
      <div className="background-animation">
        <div className="floating-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
          <div className="shape shape-4"></div>
          <div className="shape shape-5"></div>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon; 