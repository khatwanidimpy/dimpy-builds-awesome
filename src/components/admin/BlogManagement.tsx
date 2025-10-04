import { useState, useEffect, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { adminApi } from '@/lib/api';

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

interface BlogManagementProps {
  onStatsUpdate?: () => void;
}

const BlogManagement = ({ onStatsUpdate }: BlogManagementProps) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  // Get auth token from localStorage
  const getToken = () => localStorage.getItem('authToken') || '';

  // Fetch blog posts
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await adminApi.getAdminBlogPosts(token, { limit: 100 }); // Fetch more posts
      setPosts(response.data?.posts || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch blog posts',
        variant: 'destructive',
      });
      console.error('Error fetching posts:', error);
      // Fallback to empty array
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Handle create new post
  const handleCreatePost = async () => {
    try {
      const token = getToken();
      const newPost = {
        title: 'New Blog Post',
        content: 'Start writing your content here...',
        excerpt: 'Brief description of your post',
        published: false,
        tags: [],
        featured_image: null,
        read_time: '5 min read'
      };
      
      const response = await adminApi.createBlogPost(token, newPost);
      toast({
        title: 'Success',
        description: 'New post created successfully',
      });
      
      // Add the new post to the list
      if (response.data?.post) {
        setPosts(prev => [response.data.post, ...prev]);
        setSelectedPost(response.data.post);
      }
      
      fetchPosts(); // Refresh the list
      onStatsUpdate?.(); // Refresh dashboard stats
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create post',
        variant: 'destructive',
      });
      console.error('Error creating post:', error);
    }
  };

  // Handle update post
  const handleUpdatePost = async () => {
    if (!selectedPost) return;
    
    try {
      const token = getToken();
      const response = await adminApi.updateBlogPost(token, selectedPost.id, selectedPost);
      toast({
        title: 'Success',
        description: 'Post updated successfully',
      });
      
      // Update the post in the list
      setPosts(prev => 
        prev.map(post => post.id === selectedPost.id ? response.data.post : post)
      );
      
      setIsEditing(false);
      fetchPosts(); // Refresh the list
      onStatsUpdate?.(); // Refresh dashboard stats
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update post',
        variant: 'destructive',
      });
      console.error('Error updating post:', error);
    }
  };

  // Handle delete post
  const handleDeletePost = async (id: number) => {
    try {
      const token = getToken();
      await adminApi.deleteBlogPost(token, id);
      toast({
        title: 'Success',
        description: 'Post deleted successfully',
      });
      
      // Remove the post from the list
      setPosts(prev => prev.filter(post => post.id !== id));
      
      if (selectedPost?.id === id) {
        setSelectedPost(null);
        setIsEditing(false);
      }
      
      fetchPosts(); // Refresh the list
      onStatsUpdate?.(); // Refresh dashboard stats
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete post',
        variant: 'destructive',
      });
      console.error('Error deleting post:', error);
    }
  };

  // Handle input changes for selected post
  const handleInputChange = (field: keyof BlogPost, value: any) => {
    if (selectedPost) {
      setSelectedPost({
        ...selectedPost,
        [field]: value
      });
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      // In a real implementation, you would upload the file to your server
      // and get back a URL to store in the blog post data
      toast({
        title: 'Image Upload',
        description: 'Image uploaded successfully (mock implementation)',
      });
      
      // For demo purposes, we'll use a placeholder URL
      const imageUrl = 'https://placehold.co/600x400';
      handleInputChange('featured_image', imageUrl);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
      console.error('Error uploading image:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Blog Management</h2>
        <Button onClick={handleCreatePost}>Create New Post</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Posts List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Blog Posts</CardTitle>
              <CardDescription>Manage your blog content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {posts.map((post) => (
                  <div 
                    key={post.id} 
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedPost?.id === post.id 
                        ? 'bg-primary/10 border border-primary' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    onClick={() => {
                      setSelectedPost(post);
                      setIsEditing(false);
                    }}
                  >
                    <h3 className="font-medium">{post.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{post.excerpt}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.created_at).toLocaleDateString()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        post.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                ))}
                
                {posts.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No blog posts found. Create your first post!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Post Editor */}
        <div className="lg:col-span-2">
          {selectedPost ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>
                      {isEditing ? 'Edit Post' : selectedPost.title}
                    </CardTitle>
                    <CardDescription>
                      {isEditing ? 'Modify your blog post' : 'View post details'}
                    </CardDescription>
                  </div>
                  <div className="space-x-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleUpdatePost}>
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleDeletePost(selectedPost.id)}
                        >
                          Delete
                        </Button>
                        <Button onClick={() => setIsEditing(true)}>
                          Edit
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={selectedPost.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        value={selectedPost.excerpt}
                        onChange={(e) => handleInputChange('excerpt', e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={selectedPost.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        rows={10}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="read_time">Read Time</Label>
                        <Input
                          id="read_time"
                          value={selectedPost.read_time}
                          onChange={(e) => handleInputChange('read_time', e.target.value)}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="tags">Tags (comma separated)</Label>
                        <Input
                          id="tags"
                          value={selectedPost.tags.join(', ')}
                          onChange={(e) => handleInputChange('tags', e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0))}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="published"
                        checked={selectedPost.published}
                        onChange={(e) => handleInputChange('published', e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="published">Published</Label>
                    </div>
                    
                    <div>
                      <Label htmlFor="image">Featured Image</Label>
                      <div className="flex items-end space-x-4">
                        <Input
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        {selectedPost.featured_image && (
                          <img 
                            src={selectedPost.featured_image} 
                            alt="Preview" 
                            className="w-16 h-16 object-cover rounded border"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium mb-2">Excerpt</h3>
                      <p className="text-muted-foreground">{selectedPost.excerpt}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Content</h3>
                      <div className="prose max-w-none bg-muted p-4 rounded-lg">
                        {selectedPost.content}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">Read Time</h4>
                        <p className="text-muted-foreground">{selectedPost.read_time}</p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-1">Tags</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedPost.tags.map((tag, index) => (
                            <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                              {tag}
                            </span>
                          ))}
                          {selectedPost.tags.length === 0 && (
                            <span className="text-muted-foreground text-sm">No tags</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Status:</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        selectedPost.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedPost.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Created At</h4>
                      <p className="text-muted-foreground">
                        {new Date(selectedPost.created_at).toLocaleString()}
                      </p>
                    </div>
                    
                    {selectedPost.published_at && (
                      <div>
                        <h4 className="font-medium mb-1">Published At</h4>
                        <p className="text-muted-foreground">
                          {new Date(selectedPost.published_at).toLocaleString()}
                        </p>
                      </div>
                    )}
                    
                    {selectedPost.featured_image && (
                      <div>
                        <h4 className="font-medium mb-1">Featured Image</h4>
                        <img 
                          src={selectedPost.featured_image} 
                          alt={selectedPost.title} 
                          className="w-full max-w-md h-auto rounded-lg border"
                        />
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Select a blog post to view or edit, or create a new post
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogManagement;