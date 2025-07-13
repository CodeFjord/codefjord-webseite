import React, { useState, useRef, useEffect } from 'react';
import useThemeStore from '../store/themeStore.js';
import './ThemeToggle.css';

const ThemeToggle = ({ variant = 'button', className = '', compact = false }) => {
  const { theme, effectiveTheme, setTheme, cycleTheme } = useThemeStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getThemeIcon = (themeType) => {
    switch (themeType) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'system':
        return '💻';
      default:
        return '🎨';
    }
  };

  const getThemeLabel = (themeType) => {
    switch (themeType) {
      case 'light':
        return 'Hell';
      case 'dark':
        return 'Dunkel';
      case 'system':
        return 'System';
      default:
        return 'Theme';
    }
  };

  const handleThemeSelect = (selectedTheme) => {
    setTheme(selectedTheme);
    setIsOpen(false);
  };

  // Compact icon-only variant for navbar
  if (compact) {
    return (
      <button
        onClick={cycleTheme}
        className={`theme-toggle-compact ${className}`}
        aria-label={`Theme wechseln (aktuell: ${getThemeLabel(theme)})`}
        title={`Theme wechseln (aktuell: ${getThemeLabel(theme)})`}
      >
        <span className="theme-icon-compact">{getThemeIcon(theme)}</span>
      </button>
    );
  }

  // Simple button variant
  if (variant === 'button') {
    return (
      <button
        onClick={cycleTheme}
        className={`theme-toggle-btn ${className}`}
        aria-label={`Theme wechseln (aktuell: ${getThemeLabel(theme)})`}
        title={`Theme wechseln (aktuell: ${getThemeLabel(theme)})`}
      >
        <span className="theme-icon">{getThemeIcon(theme)}</span>
        <span className="theme-label">{getThemeLabel(theme)}</span>
      </button>
    );
  }

  // Dropdown variant
  return (
    <div className={`theme-toggle-dropdown ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="theme-toggle-trigger"
        aria-label={`Theme auswählen (aktuell: ${getThemeLabel(theme)})`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="theme-icon">{getThemeIcon(theme)}</span>
        <span className="theme-label">{getThemeLabel(theme)}</span>
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>

      {isOpen && (
        <div className="theme-dropdown-menu">
          <div className="theme-dropdown-header">
            <span>Theme auswählen</span>
          </div>
          
          {[
            { value: 'light', label: 'Hell', icon: '☀️', description: 'Helles Design' },
            { value: 'dark', label: 'Dunkel', icon: '🌙', description: 'Dunkles Design' },
            { value: 'system', label: 'System', icon: '💻', description: 'System-Einstellung' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleThemeSelect(option.value)}
              className={`theme-option ${theme === option.value ? 'active' : ''}`}
              aria-label={`${option.label} Theme auswählen`}
            >
              <span className="theme-option-icon">{option.icon}</span>
              <div className="theme-option-content">
                <span className="theme-option-label">{option.label}</span>
                <span className="theme-option-description">{option.description}</span>
              </div>
              {theme === option.value && (
                <span className="theme-option-check">✓</span>
              )}
            </button>
          ))}
          
          <div className="theme-dropdown-footer">
            <span className="current-theme-info">
              Aktuell: {getThemeLabel(effectiveTheme)} {effectiveTheme !== theme && `(${getThemeLabel(theme)}-Modus)`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeToggle; 