import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Github, Linkedin, Twitter } from 'lucide-react';
import { menuApi } from '../api/cms';

const Footer = () => {
  const [footerItems, setFooterItems] = useState([]);
  const currentYear = new Date().getFullYear();

  // Lade Footer-Menü aus dem CMS
  useEffect(() => {
    const loadFooterMenu = async () => {
      try {
        const menu = await menuApi.getFooter();
        if (menu && menu.items) {
          const items = menu.items
            .filter(item => item.active)
            .map(item => ({
              path: item.url,
              label: item.label,
              target: item.target
            }));
          setFooterItems(items);
        } else {
          // Fallback zu Standard-Menü
          setFooterItems([
            { path: '/impressum', label: 'Impressum', target: '_self' },
            { path: '/datenschutz', label: 'Datenschutz', target: '_self' },
            { path: '/agb', label: 'AGB', target: '_self' }
          ]);
        }
      } catch (error) {
        console.error('Error loading footer menu:', error);
        // Fallback zu Standard-Menü
        setFooterItems([
          { path: '/impressum', label: 'Impressum', target: '_self' },
          { path: '/datenschutz', label: 'Datenschutz', target: '_self' },
          { path: '/agb', label: 'AGB', target: '_self' }
        ]);
      }
    };

    loadFooterMenu();
  }, []);

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>CodeFjord</h3>
          <p>
            Ihr Partner für innovative App- und Webentwicklung. 
            Wir verwandeln Ihre Visionen in digitale Realität.
          </p>
          <div className="social-links">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github size={20} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Twitter size={20} />
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Services</h3>
          <ul>
            <li><Link to="/services">Webentwicklung</Link></li>
            <li><Link to="/services">App-Entwicklung</Link></li>
            <li><Link to="/services">UI/UX Design</Link></li>
            <li><Link to="/services">Consulting</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Rechtliches</h3>
          <ul>
            {footerItems.map((item) => (
              <li key={item.path}>
                {item.target === '_blank' ? (
                  <a
                    href={item.path}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link to={item.path}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div className="footer-section">
          <h3>Kontakt</h3>
          <div className="contact-info">
            <p>
              <Mail size={16} />
              <a href="mailto:info@codefjord.de">info@code-fjord.de</a>
            </p>
            <p>
              <Phone size={16} />
              <a href="tel:+49123456789">+49 174 786 1457</a>
            </p>
            <p>
              <MapPin size={16} />
              Flensburg, Deutschland
            </p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {currentYear} CodeFjord UG (haftungsbeschränkt) i.G. Alle Rechte vorbehalten.</p>
      </div>
    </footer>
  );
};

export default Footer; 