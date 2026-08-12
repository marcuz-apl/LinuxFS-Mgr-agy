import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  const applyThemeToDOM = (targetTheme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', targetTheme);
    document.body.setAttribute('data-theme', targetTheme);
    document.documentElement.className = `theme-${targetTheme}`;
    document.body.className = `theme-${targetTheme}`;
  };

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('linuxfs-theme');
    const initial = stored === 'light' || stored === 'dark' ? stored : 'dark';
    setTheme(initial);
    applyThemeToDOM(initial);
  }, []);

  const selectTheme = (targetTheme: 'light' | 'dark') => {
    setTheme(targetTheme);
    applyThemeToDOM(targetTheme);
    localStorage.setItem('linuxfs-theme', targetTheme);
  };

  if (!mounted) return null;

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        background: 'var(--bg-inset)',
        padding: '3px',
        borderRadius: '6px',
        border: '1px solid var(--border)',
        gap: '2px',
      }}
    >
      <button
        onClick={() => selectTheme('light')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.78rem',
          fontWeight: 700,
          fontFamily: 'var(--font-sans)',
          background: theme === 'light' ? 'var(--accent)' : 'transparent',
          color: theme === 'light' ? '#ffffff' : 'var(--text-muted)',
          transition: 'all 0.15s ease',
        }}
        title="Switch to Light Theme"
      >
        <Sun size={13} />
        <span>Light</span>
      </button>

      <button
        onClick={() => selectTheme('dark')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 10px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.78rem',
          fontWeight: 700,
          fontFamily: 'var(--font-sans)',
          background: theme === 'dark' ? 'var(--accent)' : 'transparent',
          color: theme === 'dark' ? '#ffffff' : 'var(--text-muted)',
          transition: 'all 0.15s ease',
        }}
        title="Switch to Dark Theme"
      >
        <Moon size={13} />
        <span>Dark</span>
      </button>
    </div>
  );
};
