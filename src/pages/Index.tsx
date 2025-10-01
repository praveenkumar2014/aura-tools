'use client';

import { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { PartnersSection } from '@/components/PartnersSection';
import { ToolsGrid } from '@/components/ToolsGrid';
import { ParticleBackground } from '@/components/ParticleBackground';
import { VibeToggle } from '@/components/VibeToggle';
import { AITool } from '@/components/ToolCard';
import { sampleTools } from '@/data/sampleTools';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { 
  TrendingUp, 
  Users, 
  Wallet, 
  Star, 
  Sparkles,
  Crown,
  Zap,
  Brain,
  Rocket
} from 'lucide-react';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Tools', count: sampleTools.length },
    { id: 'Language Models', name: 'Language Models', count: 2 },
    { id: 'Image Generation', name: 'Image Generation', count: 2 },
    { id: 'Video & Media', name: 'Video & Media', count: 3 },
    { id: 'Development', name: 'Development', count: 1 },
    { id: 'Marketing', name: 'Marketing', count: 2 },
    { id: 'Productivity', name: 'Productivity', count: 1 },
    { id: 'Writing', name: 'Writing', count: 1 },
  ];

  const filteredTools = sampleTools.filter(tool => {
    const matchesSearch = searchQuery === '' || 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleLearnMore = (tool: AITool) => {
    // Simulate navigation or modal opening
    console.log('Learning more about:', tool.name);
    if (tool.url) {
      window.open(tool.url, '_blank');
    }
  };

  const stats = [
    { 
      icon: Brain, 
      value: '1,000+', 
      label: 'AI Tools', 
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10' 
    },
    { 
      icon: Users, 
      value: '50K+', 
      label: 'Active Learners', 
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10' 
    },
    { 
      icon: Wallet, 
      value: '₹2L+', 
      label: 'Cashback Earned', 
      color: 'text-green-500',
      bgColor: 'bg-green-500/10' 
    },
    { 
      icon: TrendingUp, 
      value: '95%', 
      label: 'Success Rate', 
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10' 
    },
  ];

  return (
    <div className="min-h-screen bg-background relative">
      {/* Particle Background */}
      <ParticleBackground />
      
      {/* Vibe Toggle */}
      <VibeToggle />
      
      {/* Navigation */}
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />
      
      {/* Partners Section */}
      <PartnersSection />
      
      {/* Stats Section */}
      <motion.section 
        className="py-20 px-4 relative z-10"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="cursor-pointer"
              >
                <Card className="glass-card border-0 text-center hover:hover-glow transition-all duration-300">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mx-auto mb-4 float-animation`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div className="text-3xl font-bold gradient-text mb-2">
                      {stat.value}
                    </div>
                    <div className="text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <motion.section 
        className="py-12 px-4 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold gradient-text-secondary mb-4">
              Browse by Category
            </h3>
            <p className="text-muted-foreground">
              Discover AI tools organized by their specialization
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Badge
                  className={`px-6 py-2 text-sm cursor-pointer transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'gradient-bg-primary text-white border-0 glow-primary'
                      : 'glass-button hover:hover-glow'
                  }`}
                >
                  {category.name}
                  <span className="ml-2 text-xs opacity-75">
                    ({category.count})
                  </span>
                </Badge>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Tools Grid */}
      <ToolsGrid 
        tools={filteredTools} 
        title="Featured AI Tools"
        onLearnMore={handleLearnMore}
      />

      {/* CTA Section */}
      <motion.section 
        className="py-20 px-4 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="container mx-auto">
          <Card className="glass-card border-0 text-center p-12 hover:hover-glow transition-all duration-500">
            <CardHeader>
              <motion.div
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="mx-auto mb-6"
              >
                <div className="w-20 h-20 gradient-bg-primary rounded-2xl flex items-center justify-center glow-primary">
                  <Rocket className="w-10 h-10 text-white" />
                </div>
              </motion.div>
              
              <h3 className="text-4xl lg:text-5xl font-bold gradient-text mb-4">
                Ready to Level Up?
              </h3>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who are already using AI to transform their work. 
                Get premium access, exclusive tutorials, and cashback rewards.
              </p>
            </CardHeader>
            
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="gradient-bg-primary hover:hover-glow border-0 text-white text-lg px-8 py-4"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Unlock Premium Magic →
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="glass-button hover:hover-glow text-lg px-8 py-4"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Free Journey
                </Button>
              </div>
              
              <div className="mt-8 flex items-center justify-center gap-8 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>4.9/5 Rating</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>24/7 Support</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-green-500" />
                  <span>50K+ Users</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-white/10 relative z-10">
        <div className="container mx-auto text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-8 gradient-bg-primary rounded-lg flex items-center justify-center shadow-lg">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-xl gradient-text">GS AI Tools</span>
              </div>
          <p className="text-muted-foreground">
            Discover, Learn & Master the Future of AI Tools
          </p>
          <div className="mt-6 text-xs text-muted-foreground">
            © 2024 GS AI Tools. Crafted with ✨ and AI magic.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;