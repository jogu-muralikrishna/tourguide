import React, { createContext, useContext, useEffect, useState } from 'react';

export type ThemeMode = 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  resolvedTheme: 'dark';
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('dark');
    root.classList.remove('light');
    root.setAttribute('data-theme', 'dark');
  }, []);

  const setTheme = () => {
    // Permanent dark mode enforcement
  };

  const toggleTheme = () => {
    // Permanent dark mode enforcement
  };

  return (
    <ThemeContext.Provider value={{ theme: 'dark', resolvedTheme: 'dark', setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

