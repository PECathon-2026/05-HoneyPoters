/**
 * PrivacyLens — Theme Context Engine
 * Manages dynamic switching between Deep Dark Mode (#020617) and Warm Beige-White Light Mode (#fdfbf7)
 * Team 05-HoneyPoters — PECathon 2026 (PS-004)
 */

import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext({
  theme: 'dark',
  isDark: true,
  toggleTheme: () => {},
  setTheme: () => {}
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('privacylens_theme');
        if (stored === 'light' || stored === 'dark') return stored;
      }
    } catch (e) {}
    return 'dark';
  });

  const isDark = theme === 'dark';

  const applyThemeToDOM = (activeTheme) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    const body = document.body;

    if (activeTheme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      body.classList.add('dark');
      body.classList.remove('light');
      root.style.colorScheme = 'dark';
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
      body.classList.remove('dark');
      body.classList.add('light');
      root.style.colorScheme = 'light';
      root.setAttribute('data-theme', 'light');
    }
  };

  useEffect(() => {
    applyThemeToDOM(theme);
    try {
      localStorage.setItem('privacylens_theme', theme);
    } catch (e) {}

    // Sync to Chrome Extension Storage if available
    try {
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        chrome.storage.local.set({ theme });
      }
    } catch (e) {}

    // Broadcast theme to extension popup or peer tabs
    try {
      if (typeof BroadcastChannel !== 'undefined') {
        const bc = new BroadcastChannel('privacylens_channel');
        bc.postMessage({
          source: 'PRIVACYLENS_WEBAPP',
          type: 'THEME_CHANGED',
          payload: { theme }
        });
        bc.close();
      }
    } catch (e) {}
  }, [theme]);

  // Listen for theme changes broadcast by the extension popup
  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    try {
      const bc = new BroadcastChannel('privacylens_channel');
      bc.onmessage = (event) => {
        const data = event.data;
        if (data && data.type === 'THEME_CHANGED' && (data.payload?.theme === 'dark' || data.payload?.theme === 'light')) {
          setThemeState(data.payload.theme);
        }
      };
      return () => {
        bc.close();
      };
    } catch (e) {}
  }, []);

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (newTheme) => {
    if (newTheme === 'dark' || newTheme === 'light') {
      setThemeState(newTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
