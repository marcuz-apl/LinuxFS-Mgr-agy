import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';
import { getCalculatedTheme } from '../lib/themeHelper';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('linuxfs-theme');
    const initial = stored ? (stored as 'light' | 'dark') : getCalculatedTheme();
    setTheme(initial);
    document.documentElement.setAttribute('data-theme', initial);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('linuxfs-theme', nextTheme);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-secondary"
      style={{ padding: '7px 12px', gap: 6 }}
      title={`Current: ${theme.toUpperCase()} mode. Click to toggle.`}
      aria-label="Toggle light/dark theme"
    >
      {theme === 'dark' ? <Sun size={15} color="#f59e0b" /> : <Moon size={15} color="#0284c7" />}
      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{theme === 'dark' ? 'Dark' : 'Light'} Mode</span>
    </button>
  );
};
