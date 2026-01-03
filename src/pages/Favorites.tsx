'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { ParticleBackground } from '@/components/ParticleBackground';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Star, 
  ExternalLink,
  Heart,
  Sparkles
} from 'lucide-react';

interface FavoriteTool {
  id: string;
  tool_id: string;
  ai_tools: {
    id: string;
    name: string;
    description: string;
    category: string;
    rating: number;
    price: string;
    image_url: string;
    website_url: string;
    is_premium: boolean;
  };
}

const Favorites = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [favorites, setFavorites] = useState<FavoriteTool[]>([]);

  useEffect(() => {
    checkAuthAndFetchFavorites();
  }, []);

  const checkAuthAndFetchFavorites = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/auth');
      return;
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .select(`
        id,
        tool_id,
        ai_tools (
          id,
          name,
          description,
          category,
          rating,
          price,
          image_url,
          website_url,
          is_premium
        )
      `)
      .eq('user_id', session.user.id);

    if (data && !error) {
      setFavorites(data as any);
    }

    setIsLoading(false);
  };

  const removeFavorite = async (favoriteId: string) => {
    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('id', favoriteId);

    if (!error) {
      setFavorites(favorites.filter(f => f.id !== favoriteId));
      toast({
        title: 'Removed from favorites',
        description: 'Tool has been removed from your favorites.',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>

          <div className="flex items-center gap-3 mb-8">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <h1 className="text-4xl font-bold gradient-text">My Favorites</h1>
            <Badge className="gradient-bg-primary text-white">
              {favorites.length} tools
            </Badge>
          </div>

          {favorites.length === 0 ? (
            <Card className="glass-card">
              <CardContent className="p-12 text-center">
                <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No favorites yet</h3>
                <p className="text-muted-foreground mb-6">
                  Start exploring AI tools and add your favorites here!
                </p>
                <Button
                  onClick={() => navigate('/')}
                  className="gradient-bg-primary text-white"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Explore Tools
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite, index) => (
                <motion.div
                  key={favorite.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="glass-card hover:hover-glow transition-all h-full">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {favorite.ai_tools.image_url ? (
                            <img 
                              src={favorite.ai_tools.image_url} 
                              alt={favorite.ai_tools.name}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                              <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {favorite.ai_tools.name}
                            </h3>
                            <Badge variant="secondary" className="text-xs">
                              {favorite.ai_tools.category}
                            </Badge>
                          </div>
                        </div>
                        {favorite.ai_tools.is_premium && (
                          <Badge className="gradient-bg-primary text-white text-xs">
                            Premium
                          </Badge>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                        {favorite.ai_tools.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">
                            {favorite.ai_tools.rating}
                          </span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {favorite.ai_tools.price}
                        </span>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 gradient-bg-primary text-white"
                          onClick={() => window.open(favorite.ai_tools.website_url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          Visit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="glass-button"
                          onClick={() => removeFavorite(favorite.id)}
                        >
                          <Heart className="w-4 h-4 fill-current" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Favorites;
