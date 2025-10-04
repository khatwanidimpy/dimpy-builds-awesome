import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import BlogManagement from '@/components/admin/BlogManagement';
import ProjectManagement from '@/components/admin/ProjectManagement';
import { adminApi } from '@/lib/api';

interface ManagementComponentProps {
  onStatsUpdate?: () => void;
}

const AdminDashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({
    blogPosts: 0,
    projects: 0,
    analytics: 0
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // Fetch real data from API
  const fetchDashboardData = async () => {
    if (!isLoading && user) {
      try {
        const token = localStorage.getItem('authToken') || '';
        
        // Fetch blog posts count
        const blogResponse = await adminApi.getAdminBlogPosts(token);
        const blogCount = blogResponse.data?.pagination?.total || 0;
        
        // For now, we'll use static data for projects and analytics
        // In a real implementation, you would fetch these from their respective APIs
        setStats({
          blogPosts: blogCount,
          projects: 8, // Static data for now
          analytics: 1248 // Static data for now
        });
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to fetch dashboard data',
          variant: 'destructive',
        });
        console.error('Error fetching dashboard data:', error);
        
        // Fallback to static data
        setStats({
          blogPosts: 12,
          projects: 8,
          analytics: 1248
        });
      }
    }
  };

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

  useEffect(() => {
    fetchDashboardData();
  }, [isLoading, user, toast]);

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
        <div className="flex space-x-4 mb-6 border-b">
          <Button
            variant={activeTab === 'dashboard' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </Button>
          <Button
            variant={activeTab === 'blog' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('blog')}
          >
            Blog Management
          </Button>
          <Button
            variant={activeTab === 'projects' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('projects')}
          >
            Project Management
          </Button>
        </div>
        
        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Posts</CardTitle>
                <CardDescription>Manage your blog content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">{stats.blogPosts}</p>
                <Button className="w-full" onClick={() => setActiveTab('blog')}>
                  Manage Posts
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Manage your portfolio projects</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">{stats.projects}</p>
                <Button className="w-full" onClick={() => setActiveTab('projects')}>
                  Manage Projects
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>View site statistics</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold mb-4">{stats.analytics}</p>
                <Button className="w-full">View Reports</Button>
              </CardContent>
            </Card>
          </div>
        )}
        
        {activeTab === 'blog' && <BlogManagement onStatsUpdate={fetchDashboardData} />}
        
        {activeTab === 'projects' && <ProjectManagement onStatsUpdate={fetchDashboardData} />}
      </div>
    </div>
  );
};

export default AdminDashboard;