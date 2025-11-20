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
        value: ["#FF7F66", "#FF9966", "#33CCFF", "#66D9B8", "#A855F7", "#C084FC"],  // Logo colors: Coral, Orange, Cyan, Green, Purple, Violet
      },
      links: {
        color: "#FF7F66",  // Coral links
        distance: 150,
        enable: false,
        opacity: 0.2,
        width: 1,
      },
      move: {
        direction: "bottom" as const,  // Particles fall down
        enable: true,
        outModes: {
          default: "out" as const,
          bottom: "out" as const,
          top: "none" as const,
        },
        random: true,
        speed: { min: 0.5, max: 2 },
        straight: false,
      },
      number: {
        density: {
          enable: true,
          area: 800,
        },
        value: vibeMode ? 100 : 50,
      },
      opacity: {
        value: vibeMode ? 0.6 : 0.3,
        animation: {
          enable: true,
          speed: 1,
          minimumValue: 0.05,
        },
      },
      shape: {
        type: ["circle", "triangle"],
      },
      size: {
        value: { min: 2, max: 8 },
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