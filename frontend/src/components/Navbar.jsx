import { useState, useEffect, useRef } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Shield, LogOut } from 'lucide-react';
import logo from '../assets/images/logo.png';
import logoWhite from '../assets/images/logo-white.png';
import { menuApi } from '../api/cms';
import useAuth from '../store/auth.js';
import useThemeStore from '../store/themeStore.js';
import ThemeToggle from './ThemeToggle.jsx';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [navItems, setNavItems] = useState([]);
  const menuRef = useRef(null);
  const { isAdmin, logout } = useAuth();
  const { effectiveTheme } = useThemeStore();
  
  // Wähle das passende Logo basierend auf dem Theme
  const currentLogo = effectiveTheme === 'dark' ? logoWhite : logo;

  // Lade Navbar-Menü aus dem CMS
  useEffect(() => {
    const loadNavbarMenu = async () => {
      try {
        const menu = await menuApi.getNavbar();
        if (menu && menu.items) {
          const items = menu.items
            .filter(item => item.active)
            .map(item => ({
              path: item.url,
              label: item.label,
              target: item.target
            }));
          setNavItems(items);
        } else {
          // Fallback zu Standard-Menü
          setNavItems([
            { path: '/', label: 'Home', target: '_self' },
            { path: '/services', label: 'Services', target: '_self' },
            { path: '/portfolio', label: 'Portfolio', target: '_self' },
            { path: '/blog', label: 'Blog', target: '_self' },
            { path: '/about', label: 'Über uns', target: '_self' },
            { path: '/contact', label: 'Kontakt', target: '_self' }
          ]);
        }
      } catch (error) {
        console.error('Error loading navbar menu:', error);
        // Fallback zu Standard-Menü
        setNavItems([
          { path: '/', label: 'Home', target: '_self' },
          { path: '/services', label: 'Services', target: '_self' },
          { path: '/portfolio', label: 'Portfolio', target: '_self' },
          { path: '/blog', label: 'Blog', target: '_self' },
          { path: '/about', label: 'Über uns', target: '_self' },
          { path: '/contact', label: 'Kontakt', target: '_self' }
        ]);
      }
    };

    loadNavbarMenu();
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // ESC schließt Menü
  useEffect(() => {
    if (!isMenuOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') closeMenu();
      if (e.key === 'Tab' && menuRef.current) {
        const focusable = menuRef.current.querySelectorAll('a,button');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  // Fokus auf Menü beim Öffnen
  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      const firstLink = menuRef.current.querySelector('a');
      if (firstLink) firstLink.focus();
    }
  }, [isMenuOpen]);

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="logo" onClick={closeMenu} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src={currentLogo} alt="CodeFjord Logo" style={{ height: '52px', width: 'auto', display: 'block' }} />
          <span style={{ fontWeight: 700, fontSize: '1.5rem', color: 'var(--color-text-primary)', letterSpacing: '0.5px' }}>CodeFjord</span>
        </Link>
        <ul className={`nav-links ${isMenuOpen ? 'nav-links-open' : ''}`}> {/* Desktop */}
          {navItems.map((item) => (
            <li key={item.path}>
              {item.target === '_blank' ? (
                <a
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={closeMenu}
                >
                  {item.label}
                </a>
              ) : (
                <NavLink
                  to={item.path}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  onClick={closeMenu}
                  end={item.path === '/'}
                >
                  {item.label}
                </NavLink>
              )}
            </li>
          ))}
          <li className="theme-toggle-item">
            <ThemeToggle compact={true} />
          </li>
          {isAdmin && (
            <>
              <li className="admin-indicator">
                <Link 
                  to="https://admin.code-fjord.de" 
                  className="admin-link"
                  style={{ 
                    color: '#dc3545', 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: '500',
                    fontSize: '1.08rem',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#c82333'}
                  onMouseLeave={(e) => e.target.style.color = '#dc3545'}
                >
                  <Shield size={18} />
                  <span>Admin</span>
                </Link>
              </li>
              <li className="admin-indicator">
                <button 
                  onClick={logout} 
                  className="admin-link logout-btn"
                  style={{ 
                    color: '#dc3545', 
                    background: 'none',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    fontWeight: '500',
                    fontSize: '1.08rem',
                    cursor: 'pointer',
                    transition: 'color 0.2s'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#c82333'}
                  onMouseLeave={(e) => e.target.style.color = '#dc3545'}
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </li>
            </>
          )}
        </ul>
        <button className="mobile-menu-btn" onClick={toggleMenu} aria-label="Menü öffnen" style={{ display: 'block' }}>
          <Menu size={24} />
        </button>
      </div>
      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="mobile-menu-overlay show" onClick={closeMenu}>
          <aside className="mobile-menu slide-in" ref={menuRef} tabIndex={-1} onClick={e => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="mobile-menu-branding">
                <img src={currentLogo} alt="CodeFjord Logo" style={{ height: '40px', width: 'auto' }} />
                <span style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-text-primary)', marginLeft: '0.5rem' }}>CodeFjord</span>
              </div>
              <button className="mobile-menu-close" onClick={closeMenu} aria-label="Menü schließen">
                <X size={28} />
              </button>
            </div>
            <ul className="mobile-nav-links">
              {navItems.map((item) => (
                <li key={item.path}>
                  {item.target === '_blank' ? (
                    <a
                      href={item.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={closeMenu}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => isActive ? 'active' : ''}
                      onClick={closeMenu}
                      end={item.path === '/'}
                    >
                      {item.label}
                    </NavLink>
                  )}
                </li>
              ))}
              <li className="theme-toggle-item-mobile">
                <ThemeToggle compact={true} />
              </li>
              {isAdmin && (
                <>
                  <li className="admin-indicator-mobile">
                    <Link 
                      to="https://admin.code-fjord.de" 
                      className="admin-link" 
                      onClick={closeMenu}
                      style={{ 
                        color: '#dc3545', 
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: '500',
                        fontSize: '1rem',
                        transition: 'color 0.2s',
                        width: '100%',
                        padding: '0.75rem 0'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#c82333'}
                      onMouseLeave={(e) => e.target.style.color = '#dc3545'}
                    >
                      <Shield size={18} />
                      <span>Admin Panel</span>
                    </Link>
                  </li>
                  <li className="admin-indicator-mobile">
                    <button 
                      onClick={() => { logout(); closeMenu(); }} 
                      className="admin-link logout-btn"
                      style={{ 
                        color: '#dc3545', 
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: '500',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        transition: 'color 0.2s',
                        width: '100%',
                        padding: '0.75rem 0',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.target.style.color = '#c82333'}
                      onMouseLeave={(e) => e.target.style.color = '#dc3545'}
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>
                  </li>
                </>
              )}
            </ul>
          </aside>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 