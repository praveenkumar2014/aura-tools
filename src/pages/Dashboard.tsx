'use client';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Navigation } from '@/components/Navigation';
import { ParticleBackground } from '@/components/ParticleBackground';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  User, 
  Sparkles, 
  TrendingUp, 
  Star, 
  Wallet, 
  BookOpen,
  LogOut,
  Settings,
  Award,
  Bell,
  Heart,
  Clock,
  ExternalLink
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [activity, setActivity] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      setUser(session.user);
      
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      
      setProfile(profileData);

      // Fetch favorites count
      const { data: favoritesData } = await supabase
        .from('user_favorites')
        .select('*, ai_tools(*)')
        .eq('user_id', session.user.id)
        .limit(5);
      
      if (favoritesData) {
        setFavorites(favoritesData);
      }

      // Fetch recent activity
      const { data: activityData } = await supabase
        .from('user_activity')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (activityData) {
        setActivity(activityData);
      }

      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        navigate('/auth');
      } else if (session) {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: 'Signed out',
      description: 'You have been signed out successfully.',
    });
    navigate('/');
  };

  const stats = [
    { 
      icon: BookOpen, 
      label: 'Tools Explored', 
      value: activity.length.toString(),
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      icon: Star, 
      label: 'Favorites', 
      value: favorites.length.toString(),
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      icon: Wallet, 
      label: 'Cashback Earned', 
      value: '₹0',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    { 
      icon: Award, 
      label: 'Learning Streak', 
      value: '0 days',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      <ParticleBackground />
      <Navigation />
      
      <div className="container mx-auto px-4 pt-24 pb-12 relative z-10">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                Welcome back, {profile?.full_name || 'User'}!
              </h1>
              <p className="text-muted-foreground">
                Continue your AI learning journey
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="glass-button"
                onClick={() => navigate('/profile')}
              >
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button
                variant="outline"
                className="glass-button"
                onClick={handleSignOut}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="glass-card border-border hover:hover-glow transition-all">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center mb-4`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold gradient-text mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="glass-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {activity.length === 0 ? (
                    <div className="text-center py-6 text-muted-foreground">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>No recent activity</p>
                      <p className="text-sm">Start exploring AI tools!</p>
                    </div>
                  ) : (
                    activity.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <div>
                          <div className="font-medium text-foreground">
                            {item.activity_type}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {item.activity_data ? JSON.stringify(item.activity_data).substring(0, 30) : 'Activity'}
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(item.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="glass-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full gradient-bg-primary text-white justify-start"
                  onClick={() => navigate('/')}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Explore AI Tools
                </Button>
                <Button
                  variant="outline"
                  className="w-full glass-button justify-start"
                  onClick={() => navigate('/favorites')}
                >
                  <Heart className="w-4 h-4 mr-2" />
                  View Favorites
                </Button>
                <Button
                  variant="outline"
                  className="w-full glass-button justify-start"
                  onClick={() => navigate('/')}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Learning Paths
                </Button>
                <Button
                  variant="outline"
                  className="w-full glass-button justify-start"
                  onClick={() => navigate('/')}
                >
                  <Wallet className="w-4 h-4 mr-2" />
                  Cashback History
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
