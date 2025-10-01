'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useState } from 'react';
import logo from '@/assets/logo.png';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

export const HeroSection = ({ onSearch }: HeroSectionProps) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-mesh hero-bg bg-gradient-to-br from-background via-slate-50 to-orange-50 dark:from-background dark:via-slate-900 dark:to-slate-800">

      <div className="container mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto"
        >
          {/* User Count Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10 flex items-center justify-center gap-3"
          >
            <div className="flex -space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 border-2 border-background"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 border-2 border-background"></div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500 to-yellow-500 border-2 border-background"></div>
            </div>
            <span className="text-sm md:text-base text-muted-foreground font-medium">
              100,000+ users enjoy GS AI Tools
            </span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-6xl lg:text-8xl font-bold mb-8 leading-tight"
          >
            <span className="text-foreground">Your One-Stop Generation</span>
            <br />
            <span className="gradient-text glow-primary">AI Agent / Tools Hub</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl lg:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Create, edit, and transform — all in one place, powered by the future of generative AI.
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mb-16"
          >
            <Button 
              size="lg"
              className="gradient-bg-primary hover:hover-glow border-0 text-white text-lg px-10 py-7 rounded-full glow-primary text-xl font-semibold"
            >
              <Sparkles className="w-6 h-6 mr-3" />
              Start Creating
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};