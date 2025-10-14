import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { projectsApi, blogApi } from '@/lib/api';
import ProjectManagement from '@/components/admin/ProjectManagement';
import BlogManagement from '@/components/admin/BlogManagement';
import { updateMetaTags, SEO_CONFIGS } from '@/lib/seo';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'projects' | 'blog'>('projects');
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ projects: 0, blogPosts: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    updateMetaTags(SEO_CONFIGS.admin);
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');
      
      if (!token || !userData) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to access the admin dashboard.',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }
      
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('authToken') || '';
      
      // Fetch project count
      const projectResponse = await projectsApi.getAdminProjects(token);
      const projectCount = projectResponse.data?.projects?.length || 0;
      
      // Fetch blog post count
      const blogResponse = await blogApi.getAdminPosts(token);
      const blogCount = blogResponse.data?.posts?.length || 0;
      
      setStats({
        projects: projectCount,
        blogPosts: blogCount
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (!isLoading && user) {
      fetchStats();
    }
  }, [isLoading, user]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    toast({
      title: 'Logged Out',
      description: 'You have been successfully logged out.',
    });
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-sm">Welcome, {user?.username}</span>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Total projects in portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.projects}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts</CardTitle>
              <CardDescription>Total blog posts published</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.blogPosts}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your content</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col space-y-2">
              <Button 
                variant={activeTab === 'projects' ? 'default' : 'outline'}
                onClick={() => setActiveTab('projects')}
              >
                Manage Projects
              </Button>
              <Button 
                variant={activeTab === 'blog' ? 'default' : 'outline'}
                onClick={() => setActiveTab('blog')}
              >
                Manage Blog Posts
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-8">
          {activeTab === 'projects' ? (
            <ProjectManagement onStatsUpdate={fetchStats} />
          ) : (
            <BlogManagement onStatsUpdate={fetchStats} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;