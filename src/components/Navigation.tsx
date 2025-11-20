'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Menu, Shield } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import logo from '@/assets/logo.png';

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    
    if (session) {
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      setIsAdmin(!!roleData);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
    window.location.reload();
  };

  const menuItems = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard', requiresAuth: true },
    { label: 'Profile', href: '/profile', requiresAuth: true },
    { label: 'Admin', href: '/admin', requiresAuth: true, adminOnly: true },
  ];

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 glass-nav"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
          >
            <img src={logo} alt="GS AI Tools" className="w-8 h-8" />
            <span className="font-bold text-xl gradient-text">GS AI Tools</span>
          </motion.div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {menuItems
              .filter(item => {
                if (item.adminOnly) return isAdmin;
                if (item.requiresAuth) return isAuthenticated;
                return true;
              })
              .map((item) => (
                <motion.button
                  key={item.label}
                  onClick={() => navigate(item.href)}
                  className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.adminOnly && <Shield className="w-4 h-4" />}
                  {item.label}
                </motion.button>
              ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button 
                size="sm" 
                variant="ghost" 
                className="hidden sm:flex hover:bg-white/10"
                onClick={handleSignOut}
              >
                Sign Out
              </Button>
            ) : (
              <>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="hidden sm:flex hover:bg-white/10"
                  onClick={() => navigate('/auth')}
                >
                  Login
                </Button>
                
                <Button 
                  size="sm" 
                  className="gradient-bg-primary hover:hover-glow border-0 text-white px-6"
                  onClick={() => navigate('/auth')}
                >
                  Try For Free
                </Button>
              </>
            )}

            {/* Mobile Menu Button */}
            <Button
              size="sm"
              variant="outline"
              className="md:hidden glass-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/20 pt-4 pb-4"
          >
            {menuItems
              .filter(item => {
                if (item.adminOnly) return isAdmin;
                if (item.requiresAuth) return isAuthenticated;
                return true;
              })
              .map((item) => (
                <button
                  key={item.label}
                  onClick={() => {
                    navigate(item.href);
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-3 py-2 px-4 hover:bg-white/10 rounded-lg transition-colors w-full text-left"
                >
                  {item.adminOnly && <Shield className="w-4 h-4" />}
                  {item.label}
                </button>
              ))}
            {isAuthenticated && (
              <button
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
                className="flex items-center gap-3 py-2 px-4 hover:bg-white/10 rounded-lg transition-colors w-full text-left text-destructive"
              >
                Sign Out
              </button>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};