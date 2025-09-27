'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Sparkles, Zap, Brain, Rocket, Crown } from 'lucide-react';
import { useState } from 'react';
import logo from '@/assets/logo.png';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

export const HeroSection = ({ onSearch }: HeroSectionProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const floatingIcons = [
    { Icon: Brain, delay: 0, position: 'top-10 left-10' },
    { Icon: Zap, delay: 1, position: 'top-20 right-20' },
    { Icon: Sparkles, delay: 2, position: 'bottom-20 left-20' },
    { Icon: Rocket, delay: 3, position: 'bottom-10 right-10' },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden gradient-mesh hero-bg bg-gradient-to-br from-background via-slate-50 to-orange-50 dark:from-background dark:via-slate-900 dark:to-slate-800">
      {/* Floating Icons */}
      {floatingIcons.map(({ Icon, delay, position }, index) => (
        <motion.div
          key={index}
          className={`absolute ${position} opacity-20 hidden lg:block`}
          animate={{
            y: [-10, 10, -10],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 4,
            delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Icon className="w-8 h-8 text-primary" />
        </motion.div>
      ))}

      <div className="container mx-auto px-4 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Logo and Brand */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 flex items-center justify-center gap-4"
          >
            <div className="relative">
              <img 
                src={logo} 
                alt="GS AI Tools" 
                className="w-16 h-16 float-animation drop-shadow-2xl"
              />
              <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full blur-xl opacity-30 animate-pulse"></div>
            </div>
            <h1 className="text-5xl lg:text-7xl font-bold gradient-text glow-primary">
              GS AI Tools
            </h1>
          </motion.div>

          {/* Hero Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-6"
          >
            <Badge className="gradient-bg-primary text-white px-6 py-2 text-lg border-0 glow-primary">
              <Crown className="w-4 h-4 mr-2" />
              1,000+ Premium AI Tools
            </Badge>
          </motion.div>

          {/* Main Headline */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-4xl lg:text-6xl font-bold mb-6 leading-tight"
          >
            Discover the{' '}
            <span className="gradient-text-secondary glow-secondary">
              Ultimate AI Tools
            </span>{' '}
            Learning Platform
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed"
          >
            Master Pinterest-style discovery of cutting-edge AI tools with cashback rewards, 
            comprehensive learning paths, and premium insights.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="glass-card p-2 rounded-2xl">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search for AI tools, categories, or features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="border-0 bg-transparent text-lg focus:ring-2 focus:ring-primary/50"
                />
                <Button 
                  onClick={handleSearch}
                  className="gradient-bg-primary hover:hover-glow px-8 border-0 text-white"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              size="lg" 
              className="gradient-bg-primary hover:hover-glow border-0 text-white text-lg px-8 py-4"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Start Learning Magic →
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="glass-button hover:hover-glow text-lg px-8 py-4"
            >
              <Crown className="w-5 h-5 mr-2" />
              Go Premium
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
            className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto"
          >
            {[
              { label: 'AI Tools', value: '1,000+' },
              { label: 'Active Learners', value: '50K+' },
              { label: 'Cashback Earned', value: '₹2L+' },
            ].map((stat, index) => (
              <div key={index} className="glass-card p-4 rounded-xl">
                <div className="text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};