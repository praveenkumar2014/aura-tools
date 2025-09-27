'use client';

import { useCallback, useMemo } from 'react';
import { loadSlim } from 'tsparticles-slim';
import Particles from 'react-tsparticles';
import type { Container, Engine } from 'tsparticles-engine';
import { useVibe } from './VibeProvider';

export const ParticleBackground = () => {
  const { vibeMode, particlesEnabled } = useVibe();

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // Optional callback for when particles are loaded
  }, []);

  const options = useMemo(() => ({
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 60,
    interactivity: {
      events: {
        onClick: {
          enable: true,
          mode: "push",
        },
        onHover: {
          enable: true,
          mode: "repulse",
        },
        resize: true,
      },
      modes: {
        push: {
          quantity: 4,
        },
        repulse: {
          distance: 200,
          duration: 0.4,
        },
      },
    },
    particles: {
      color: {
        value: ["#a855f7", "#06b6d4", "#10b981", "#f59e0b"],
      },
      links: {
        color: "#a855f7",
        distance: 150,
        enable: false,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: "none" as const,
        enable: true,
        outModes: {
          default: "bounce" as const,
        },
        random: false,
        speed: 1,
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: vibeMode ? 80 : 40,
      },
      opacity: {
        value: vibeMode ? 0.8 : 0.4,
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.1,
        },
      },
      shape: {
        type: ["circle", "triangle"],
      },
      size: {
        value: { min: 1, max: 5 },
        animation: {
          enable: true,
          speed: 2,
          minimumValue: 0.1,
        },
      },
    },
    detectRetina: true,
  }), [vibeMode]);

  // Don't render particles on mobile for performance
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  
  if (!particlesEnabled || isMobile) {
    return null;
  }

  return (
    <div className="particles-bg">
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={options}
      />
    </div>
  );
};