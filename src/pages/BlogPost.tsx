import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { blogApi } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getImageUrl } from '@/lib/imageUtils';
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

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        setError('No post specified');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await blogApi.getPostBySlug(slug);
        setPost(response.data?.post || null);
        
        // Update SEO based on post content
        if (response.data?.post) {
          updateMetaTags(SEO_CONFIGS.blogPost(
            response.data.post.title,
            response.data.post.excerpt
          ));
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch blog post';
        setError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug, toast]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-background pt-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-background pt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
            <p className="text-muted-foreground mb-6">
              {error || 'The blog post you are looking for does not exist.'}
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button onClick={() => navigate(-1)} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button asChild>
                <Link to="/blog">View All Posts</Link>
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-24">
        <div className="flex flex-wrap gap-2 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button asChild variant="outline">
            <Link to="/blog">View All Posts</Link>
          </Button>
        </div>

        <Card className="bg-card border-border">
          {post.featured_image && (
            <div className="w-full h-64 md:h-96 overflow-hidden rounded-t-lg">
              <img 
                src={getImageUrl(post.featured_image) || ''} 
                alt={post.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <CardHeader>
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            
            <CardTitle className="text-3xl md:text-4xl font-bold">
              {post.title}
            </CardTitle>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mt-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {post.author}
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <span>{post.read_time}</span>
            </div>
          </CardHeader>
          
          <CardContent>
            <div 
              className="prose max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default BlogPost;