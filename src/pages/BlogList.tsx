import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ExternalLink } from 'lucide-react';
import { blogApi } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { updateMetaTags, SEO_CONFIGS } from '@/lib/seo';

interface BlogPost {
  id: number;
  title: string;
  content: string;
  excerpt: string;
  slug: string;
  published: boolean;
  tags: string[];
  featured_image: string | null;
  read_time: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  author: string;
}

interface BlogResponse {
  success: boolean;
  data: {
    posts: BlogPost[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      pages: number;
    };
  };
}

const BlogList = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 9; // Load 9 posts at a time

  useEffect(() => {
    updateMetaTags(SEO_CONFIGS.blog);
  }, []);

  const fetchBlogPosts = async (loadMore = false) => {
    try {
      if (loadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }
      
      const response: BlogResponse = await blogApi.getAllPosts({ 
        limit, 
        offset: loadMore ? offset : 0 
      });
      
      if (loadMore) {
        setBlogPosts(prev => [...prev, ...response.data?.posts || []]);
        setOffset(prev => prev + limit);
      } else {
        setBlogPosts(response.data?.posts || []);
        setOffset(limit);
      }
      
      // Check if there are more posts to load
      setHasMore(response.data?.posts?.length === limit);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch blog posts';
      setError(errorMessage);
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              All <span className="text-primary">Blog Posts</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Technical articles and industry perspectives
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              All <span className="text-primary">Blog Posts</span>
            </h1>
            <p className="text-lg text-destructive max-w-2xl mx-auto">
              Error: {error}
            </p>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mt-4">
              Technical articles and industry perspectives
            </p>
            <div className="mt-6">
              <Button 
                variant="default" 
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
          <header className="text-center mb-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              All <span className="text-primary">Blog Posts</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sharing insights, tutorials, and best practices from my DevOps journey
            </p>
          </header>

          {blogPosts.length === 0 ? (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h2 className="text-xl font-semibold mb-4">No Blog Posts Yet</h2>
                <p className="text-muted-foreground mb-6">
                  I'm currently working on some exciting blog posts about DevOps, cloud infrastructure, and automation. Stay tuned!
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map((post) => (
                  <article key={post.id} className="h-full">
                    <Card className="group hover:shadow-md transition-all duration-300 border-muted rounded-lg h-full flex flex-col">
                      <CardHeader>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {post.tags.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">
                          {post.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="flex-grow flex flex-col">
                        <p className="text-muted-foreground mb-4">
                          {post.excerpt}
                        </p>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </div>
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1" />
                              {post.author}
                            </div>
                          </div>
                          <span>{post.read_time}</span>
                        </div>

                        <Button variant="outline" className="w-full text-primary border-primary/30 hover:bg-primary/10 hover:border-primary/50 transition-colors" asChild>
                          <Link to={`/blog/${post.slug}`} aria-label={`Read more about ${post.title}`}>
                            Read More
                            <ExternalLink className="h-4 w-4 ml-2" />
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </article>
                ))}
              </div>

              {hasMore && (
                <div className="text-center mt-12">
                  <Button 
                    variant="default" 
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20"
                    onClick={() => fetchBlogPosts(true)}
                    disabled={loadingMore}
                  >
                    {loadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Loading More Posts...
                      </>
                    ) : (
                      'Load More Posts'
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogList;