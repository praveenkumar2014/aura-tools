'use client';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navigation } from '@/components/Navigation';
import { ParticleBackground } from '@/components/ParticleBackground';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Shield, 
  Users, 
  Settings, 
  Database, 
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Search,
  Sparkles,
  Activity,
  BarChart3
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface UserRole {
  id: string;
  user_id: string;
  role: 'admin' | 'user';
  created_at: string;
}

interface Profile {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  created_at: string;
}

interface AITool {
  id: string;
  name: string;
  description: string;
  category: string;
  rating: number;
  price: string;
  is_premium: boolean;
  image_url: string;
  website_url: string;
  tags: string[];
  created_at: string;
}

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<(Profile & { role?: string })[]>([]);
  const [tools, setTools] = useState<AITool[]>([]);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState('overview');
  
  // Tool form state
  const [isToolDialogOpen, setIsToolDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<AITool | null>(null);
  const [toolForm, setToolForm] = useState({
    name: '',
    description: '',
    category: '',
    rating: 4.5,
    price: 'Free',
    is_premium: false,
    image_url: '',
    website_url: '',
    tags: '',
  });

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate('/auth');
        return;
      }

      // Check if user is admin
      const { data: roleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', session.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!roleData) {
        toast({
          title: "Access Denied",
          description: "You don't have admin permissions.",
          variant: "destructive"
        });
        navigate('/dashboard');
        return;
      }

      setIsAdmin(true);
      await Promise.all([fetchUsers(), fetchTools(), fetchUserRoles()]);
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setUsers(data as Profile[]);
    }
  };

  const fetchTools = async () => {
    const { data, error } = await supabase
      .from('ai_tools')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setTools(data as AITool[]);
    }
  };

  const fetchUserRoles = async () => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*');

    if (data && !error) {
      setUserRoles(data as UserRole[]);
    }
  };

  const toggleUserRole = async (userId: string, currentRole: 'admin' | 'user') => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole })
      .eq('user_id', userId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update user role.",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: `User role updated to ${newRole}.`,
    });

    fetchUserRoles();
  };

  const handleToolSubmit = async () => {
    const toolData = {
      name: toolForm.name,
      description: toolForm.description,
      category: toolForm.category,
      rating: toolForm.rating,
      price: toolForm.price,
      is_premium: toolForm.is_premium,
      image_url: toolForm.image_url,
      website_url: toolForm.website_url,
      tags: toolForm.tags.split(',').map(t => t.trim()).filter(Boolean),
    };

    if (editingTool) {
      const { error } = await supabase
        .from('ai_tools')
        .update(toolData)
        .eq('id', editingTool.id);

      if (error) {
        toast({ title: 'Error', description: 'Failed to update tool', variant: 'destructive' });
        return;
      }
      toast({ title: 'Success', description: 'Tool updated successfully' });
    } else {
      const { error } = await supabase
        .from('ai_tools')
        .insert([toolData]);

      if (error) {
        toast({ title: 'Error', description: 'Failed to create tool', variant: 'destructive' });
        return;
      }
      toast({ title: 'Success', description: 'Tool created successfully' });
    }

    setIsToolDialogOpen(false);
    resetToolForm();
    fetchTools();
  };

  const handleEditTool = (tool: AITool) => {
    setEditingTool(tool);
    setToolForm({
      name: tool.name,
      description: tool.description || '',
      category: tool.category,
      rating: tool.rating || 4.5,
      price: tool.price || 'Free',
      is_premium: tool.is_premium || false,
      image_url: tool.image_url || '',
      website_url: tool.website_url || '',
      tags: (tool.tags || []).join(', '),
    });
    setIsToolDialogOpen(true);
  };

  const handleDeleteTool = async (toolId: string) => {
    const { error } = await supabase
      .from('ai_tools')
      .delete()
      .eq('id', toolId);

    if (error) {
      toast({ title: 'Error', description: 'Failed to delete tool', variant: 'destructive' });
      return;
    }
    
    toast({ title: 'Success', description: 'Tool deleted successfully' });
    fetchTools();
  };

  const resetToolForm = () => {
    setEditingTool(null);
    setToolForm({
      name: '',
      description: '',
      category: '',
      rating: 4.5,
      price: 'Free',
      is_premium: false,
      image_url: '',
      website_url: '',
      tags: '',
    });
  };

  const getUserRole = (userId: string) => {
    const role = userRoles.find(r => r.user_id === userId);
    return role?.role || 'user';
  };

  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTools = tools.filter(tool =>
    tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Sparkles className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users, color: 'text-blue-500' },
    { label: 'AI Tools', value: tools.length, icon: Database, color: 'text-green-500' },
    { label: 'Admins', value: userRoles.filter(r => r.role === 'admin').length, icon: Shield, color: 'text-purple-500' },
    { label: 'Premium Tools', value: tools.filter(t => t.is_premium).length, icon: Sparkles, color: 'text-yellow-500' },
  ];

  return (
    <div className="min-h-screen bg-background">
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

          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-bold gradient-text">Admin Panel</h1>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="glass-card hover:hover-glow transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.color}`} />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Tabs for different sections */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="overview">
                <BarChart3 className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="users">
                <Users className="w-4 h-4 mr-2" />
                Users
              </TabsTrigger>
              <TabsTrigger value="tools">
                <Database className="w-4 h-4 mr-2" />
                AI Tools
              </TabsTrigger>
              <TabsTrigger value="activity">
                <Activity className="w-4 h-4 mr-2" />
                Activity
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>Latest registered users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {users.slice(0, 5).map((user) => (
                        <div key={user.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div>
                            <p className="font-medium">{user.full_name || 'Unknown'}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                          <Badge variant={getUserRole(user.id) === 'admin' ? 'default' : 'secondary'}>
                            {getUserRole(user.id)}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle>Popular Tools</CardTitle>
                    <CardDescription>Top rated AI tools</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tools.slice(0, 5).map((tool) => (
                        <div key={tool.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div>
                            <p className="font-medium">{tool.name}</p>
                            <p className="text-sm text-muted-foreground">{tool.category}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm">⭐ {tool.rating}</span>
                            {tool.is_premium && (
                              <Badge className="gradient-bg-primary text-white">Premium</Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Manage user roles and permissions</CardDescription>
                    </div>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            {user.full_name || 'Unknown'}
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Badge variant={getUserRole(user.id) === 'admin' ? 'default' : 'secondary'}>
                              {getUserRole(user.id)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {new Date(user.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleUserRole(user.id, getUserRole(user.id) as 'admin' | 'user')}
                            >
                              Toggle Role
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Tools Tab */}
            <TabsContent value="tools">
              <Card className="glass-card">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>AI Tools Management</CardTitle>
                      <CardDescription>Add, edit, and manage AI tools</CardDescription>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="relative w-64">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search tools..."
                          className="pl-10"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Dialog open={isToolDialogOpen} onOpenChange={setIsToolDialogOpen}>
                        <DialogTrigger asChild>
                          <Button className="gradient-bg-primary text-white" onClick={resetToolForm}>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Tool
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>{editingTool ? 'Edit Tool' : 'Add New Tool'}</DialogTitle>
                            <DialogDescription>
                              {editingTool ? 'Update the tool details' : 'Fill in the details for the new AI tool'}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                  id="name"
                                  value={toolForm.name}
                                  onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Input
                                  id="category"
                                  value={toolForm.category}
                                  onChange={(e) => setToolForm({ ...toolForm, category: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="description">Description</Label>
                              <Input
                                id="description"
                                value={toolForm.description}
                                onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })}
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                  id="price"
                                  value={toolForm.price}
                                  onChange={(e) => setToolForm({ ...toolForm, price: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="rating">Rating</Label>
                                <Input
                                  id="rating"
                                  type="number"
                                  min="0"
                                  max="5"
                                  step="0.1"
                                  value={toolForm.rating}
                                  onChange={(e) => setToolForm({ ...toolForm, rating: parseFloat(e.target.value) })}
                                />
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="image_url">Image URL</Label>
                                <Input
                                  id="image_url"
                                  value={toolForm.image_url}
                                  onChange={(e) => setToolForm({ ...toolForm, image_url: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="website_url">Website URL</Label>
                                <Input
                                  id="website_url"
                                  value={toolForm.website_url}
                                  onChange={(e) => setToolForm({ ...toolForm, website_url: e.target.value })}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="tags">Tags (comma separated)</Label>
                              <Input
                                id="tags"
                                value={toolForm.tags}
                                onChange={(e) => setToolForm({ ...toolForm, tags: e.target.value })}
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                id="is_premium"
                                checked={toolForm.is_premium}
                                onChange={(e) => setToolForm({ ...toolForm, is_premium: e.target.checked })}
                                className="rounded"
                              />
                              <Label htmlFor="is_premium">Premium Tool</Label>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsToolDialogOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleToolSubmit} className="gradient-bg-primary text-white">
                              {editingTool ? 'Update' : 'Create'}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Premium</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTools.map((tool) => (
                        <TableRow key={tool.id}>
                          <TableCell className="font-medium">{tool.name}</TableCell>
                          <TableCell>{tool.category}</TableCell>
                          <TableCell>⭐ {tool.rating}</TableCell>
                          <TableCell>{tool.price}</TableCell>
                          <TableCell>
                            {tool.is_premium ? (
                              <Badge className="gradient-bg-primary text-white">Yes</Badge>
                            ) : (
                              <Badge variant="secondary">No</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditTool(tool)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteTool(tool.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activity Tab */}
            <TabsContent value="activity">
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>User activity and system events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: 'New user registered', time: '2 hours ago', type: 'user' },
                      { action: 'Tool "ChatGPT" added to favorites', time: '3 hours ago', type: 'activity' },
                      { action: 'Admin role assigned to user', time: '5 hours ago', type: 'admin' },
                      { action: 'New AI tool "Runway ML" added', time: '1 day ago', type: 'tool' },
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            item.type === 'user' ? 'bg-blue-500/20' :
                            item.type === 'admin' ? 'bg-purple-500/20' :
                            item.type === 'tool' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                          }`}>
                            {item.type === 'user' && <Users className="w-5 h-5 text-blue-500" />}
                            {item.type === 'admin' && <Shield className="w-5 h-5 text-purple-500" />}
                            {item.type === 'tool' && <Database className="w-5 h-5 text-green-500" />}
                            {item.type === 'activity' && <Activity className="w-5 h-5 text-yellow-500" />}
                          </div>
                          <span>{item.action}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
