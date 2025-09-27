'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface VibeContextType {
  vibeMode: boolean;
  toggleVibeMode: () => void;
  particlesEnabled: boolean;
  setParticlesEnabled: (enabled: boolean) => void;
}

const VibeContext = createContext<VibeContextType | undefined>(undefined);

export const useVibe = () => {
  const context = useContext(VibeContext);
  if (!context) {
    throw new Error('useVibe must be used within a VibeProvider');
  }
  return context;
};

interface VibeProviderProps {
  children: ReactNode;
}

export const VibeProvider = ({ children }: VibeProviderProps) => {
  const [vibeMode, setVibeMode] = useState(false);
  const [particlesEnabled, setParticlesEnabled] = useState(true);

  useEffect(() => {
    // Load saved preferences
    const savedVibeMode = localStorage.getItem('vibeMode') === 'true';
    const savedParticles = localStorage.getItem('particlesEnabled') !== 'false';
    
    setVibeMode(savedVibeMode);
    setParticlesEnabled(savedParticles);
    
    if (savedVibeMode) {
      document.documentElement.classList.add('vibe-mode');
    }
  }, []);

  const toggleVibeMode = () => {
    const newValue = !vibeMode;
    setVibeMode(newValue);
    localStorage.setItem('vibeMode', String(newValue));
    
    if (newValue) {
      document.documentElement.classList.add('vibe-mode');
    } else {
      document.documentElement.classList.remove('vibe-mode');
    }
  };

  const handleSetParticlesEnabled = (enabled: boolean) => {
    setParticlesEnabled(enabled);
    localStorage.setItem('particlesEnabled', String(enabled));
  };

  return (
    <VibeContext.Provider
      value={{
        vibeMode,
        toggleVibeMode,
        particlesEnabled,
        setParticlesEnabled: handleSetParticlesEnabled,
      }}
    >
      {children}
    </VibeContext.Provider>
  );
};