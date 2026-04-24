import React, { createContext, useContext, useState, useEffect } from 'react';

interface DarkModeContextValue {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const DarkModeContext = createContext<DarkModeContextValue | null>(null);

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('cvbuilder_darkmode');
    if (saved !== null) {
      setIsDarkMode(saved === 'true');
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDark);
    }
    setIsLoaded(true);
  }, []);

  // Update document class and localStorage
  useEffect(() => {
    if (!isLoaded) return;
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('cvbuilder_darkmode', isDarkMode ? 'true' : 'false');
  }, [isDarkMode, isLoaded]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  const ctx = useContext(DarkModeContext);
  if (!ctx) throw new Error('useDarkMode must be used inside DarkModeProvider');
  return ctx;
}
