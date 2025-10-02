'use client';

import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { ExternalLink, Star, Zap, Crown } from 'lucide-react';

export interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  price: string;
  isPremium?: boolean;
  image?: string;
  tags: string[];
  url?: string;
}

interface ToolCardProps {
  tool: AITool;
  onLearnMore?: (tool: AITool) => void;
}

export const ToolCard = ({ tool, onLearnMore }: ToolCardProps) => {
  const handleCardClick = () => {
    if (onLearnMore) {
      onLearnMore(tool);
    }
  };

  return (
    <motion.div
      whileHover={{ 
        y: -8, 
        boxShadow: "0 25px 50px -12px rgba(26, 54, 93, 0.25)"  // Dark blue shadow 
      }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer tool-card"
      onClick={handleCardClick}
    >
      <Card className="glass-card border-0 overflow-hidden transition-all duration-500 hover:hover-glow group">
        <CardHeader className="relative">
          {tool.isPremium && (
            <div className="absolute top-2 right-2 z-10">
              <Badge className="gradient-bg-primary text-white border-0 glow-primary">
                <Crown className="w-3 h-3 mr-1" />
                Premium
              </Badge>
            </div>
          )}
          
          {/* Tool Icon/Image */}
          <div className="w-12 h-12 rounded-xl overflow-hidden mb-3 float-animation shadow-lg">
            {tool.image ? (
              <img 
                src={tool.image} 
                alt={`${tool.name} icon`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full gradient-bg-secondary flex items-center justify-center">
                <Zap className="w-6 h-6 text-white" />
              </div>
            )}
          </div>
          
          <div>
            <h3 className="font-bold text-lg gradient-text group-hover:glow-primary transition-all duration-300">
              {tool.name}
            </h3>
            <Badge variant="secondary" className="mt-2 glass-button">
              {tool.category}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pb-4">
          <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
            {tool.description}
          </p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < tool.rating
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-2">
                {tool.rating}.0
              </span>
            </div>
            
            <Badge 
              variant={tool.price.toLowerCase().includes('free') ? 'default' : 'secondary'}
              className={tool.price.toLowerCase().includes('free') ? 'gradient-bg-accent text-white border-0' : 'glass-button'}
            >
              {tool.price}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {tool.tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="outline" 
                className="text-xs glass-button border-primary/20"
              >
                {tag}
              </Badge>
            ))}
            {tool.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{tool.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0">
          <Button 
            className="w-full gradient-bg-primary hover:hover-glow border-0 text-white group-hover:animate-pulse"
            onClick={(e) => {
              e.stopPropagation();
              handleCardClick();
            }}
          >
            Learn More
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};