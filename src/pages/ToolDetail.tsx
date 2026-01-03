'use client';

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  Share2,
  Sparkles,
  Tag,
  DollarSign,
  Globe
} from 'lucide-react';

interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  price: string;
  image_url: string;
  website_url: string;
  is_premium: boolean;
  tags: string[];
}

const ToolDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [tool, setTool] = useState<AITool | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchToolAndFavoriteStatus();
  }, [id]);

  const fetchToolAndFavoriteStatus = async () => {
    // Fetch tool details
    const { data: toolData, error } = await supabase
      .from('ai_tools')
      .select('*')
      .eq('id', id)
      .single();

    if (toolData && !error) {
      setTool(toolData);
    }

    // Check if user is logged in and if tool is favorited
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
      
      const { data: favoriteData } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('tool_id', id)
        .maybeSingle();

      setIsFavorite(!!favoriteData);
    }

    setIsLoading(false);
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to add favorites.',
        variant: 'destructive',
      });
      navigate('/auth');
      return;
    }

    if (isFavorite) {
      await supabase
        .from('user_favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('tool_id', id);
      setIsFavorite(false);
      toast({ title: 'Removed from favorites' });
    } else {
      await supabase
        .from('user_favorites')
        .insert({ user_id: user.id, tool_id: id });
      setIsFavorite(true);
      toast({ title: 'Added to favorites!' });
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: tool?.name,
        text: tool?.description,
        url: window.location.href,
      });
    } catch {
      await navigator.clipboard.writeText(window.location.href);
      toast({ title: 'Link copied to clipboard!' });
    }
  };

  const logActivity = async (action: string) => {
    if (!user || !tool) return;
    
    try {
      await supabase.from('user_activity').insert([{
        user_id: user.id,
        activity_type: action,
        activity_data: { tool_id: tool.id, tool_name: tool.name },
      }]);
    } catch (e) {
      // Activity logging is optional
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!tool) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Tool not found</h2>
          <Button onClick={() => navigate('/')}>Go Home</Button>
        </div>
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
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="glass-card">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6 mb-6">
                    {tool.image_url ? (
                      <img 
                        src={tool.image_url} 
                        alt={tool.name}
                        className="w-24 h-24 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-primary/20 rounded-xl flex items-center justify-center">
                        <Sparkles className="w-12 h-12 text-primary" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold gradient-text">
                          {tool.name}
                        </h1>
                        {tool.is_premium && (
                          <Badge className="gradient-bg-primary text-white">
                            Premium
                          </Badge>
                        )}
                      </div>
                      <Badge variant="secondary" className="mb-4">
                        {tool.category}
                      </Badge>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold">{tool.rating}</span>
                        </div>
                        <div className="text-muted-foreground">
                          {tool.price}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-lg text-muted-foreground mb-6">
                    {tool.description}
                  </p>

                  {tool.tags && tool.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {tool.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="glass-button">
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full gradient-bg-primary text-white"
                    onClick={() => {
                      logActivity('visit');
                      window.open(tool.website_url, '_blank');
                    }}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Website
                  </Button>
                  
                  <Button
                    variant="outline"
                    className={`w-full glass-button ${isFavorite ? 'border-primary' : ''}`}
                    onClick={toggleFavorite}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
                    {isFavorite ? 'Favorited' : 'Add to Favorites'}
                  </Button>
                  
                  <Button
                    variant="outline"
                    className="w-full glass-button"
                    onClick={handleShare}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pricing</p>
                      <p className="font-semibold">{tool.price}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Star className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <p className="font-semibold">{tool.rating} / 5</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                      <Globe className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-semibold">{tool.category}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ToolDetail;
