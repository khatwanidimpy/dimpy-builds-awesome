import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { projectsApi } from '@/lib/api';
import { getImageUrl } from '@/lib/imageUtils';

interface Project {
  id: number;
  title: string;
  description: string;
  content: string;
  technologies: string[];
  featured_image: string | null;
  project_url: string | null;
  github_url: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

interface ProjectManagementProps {
  onStatsUpdate?: () => void;
}

const ProjectManagement = ({ onStatsUpdate }: ProjectManagementProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get auth token from localStorage
  const getToken = () => localStorage.getItem('authToken') || '';

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = getToken();
      const response = await projectsApi.getAdminProjects(token, { limit: 100 });
      setProjects(response.data?.projects || []);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch projects',
        variant: 'destructive',
      });
      console.error('Error fetching projects:', error);
      // Fallback to empty array
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle create new project
  const handleCreateProject = async () => {
    try {
      const token = getToken();
      const newProject = {
        title: 'New Project',
        description: 'Brief description of your project',
        content: 'Detailed project content...',
        technologies: [],
        featured_image: null,
        project_url: null,
        github_url: null,
        published: false
      };
      
      const response = await projectsApi.createProject(token, newProject);
      toast({
        title: 'Success',
        description: 'New project created successfully',
      });
      
      // Add the new project to the list
      if (response.data?.project) {
        setProjects(prev => [response.data.project, ...prev]);
        setSelectedProject(response.data.project);
      }
      
      fetchProjects(); // Refresh the list
      onStatsUpdate?.(); // Refresh dashboard stats
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create project',
        variant: 'destructive',
      });
      console.error('Error creating project:', error);
    }
  };

  // Handle update project
  const handleUpdateProject = async () => {
    if (!selectedProject) return;
    
    try {
      const token = getToken();
      const response = await projectsApi.updateProject(token, selectedProject.id, selectedProject);
      toast({
        title: 'Success',
        description: 'Project updated successfully',
      });
      
      // Update the project in the list
      setProjects(prev => 
        prev.map(project => project.id === selectedProject.id ? response.data.project : project)
      );
      
      setIsEditing(false);
      fetchProjects(); // Refresh the list
      onStatsUpdate?.(); // Refresh dashboard stats
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update project',
        variant: 'destructive',
      });
      console.error('Error updating project:', error);
    }
  };

  // Handle delete project
  const handleDeleteProject = async (id: number) => {
    try {
      const token = getToken();
      await projectsApi.deleteProject(token, id);
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
      
      // Remove the project from the list
      setProjects(prev => prev.filter(project => project.id !== id));
      
      if (selectedProject?.id === id) {
        setSelectedProject(null);
        setIsEditing(false);
      }
      
      fetchProjects(); // Refresh the list
      onStatsUpdate?.(); // Refresh dashboard stats
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete project',
        variant: 'destructive',
      });
      console.error('Error deleting project:', error);
    }
  };

  // Handle input changes for selected project
  const handleInputChange = (field: keyof Project, value: any) => {
    if (selectedProject) {
      setSelectedProject({
        ...selectedProject,
        [field]: value
      });
    }
  };

  // Handle image upload
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setUploading(true);
      
      // Get auth token
      const token = getToken();
      
      // Upload image to backend
      const response = await projectsApi.uploadImage(token, file);
      
      if (!response.success) {
        throw new Error(response.message || 'Failed to upload image');
      }
      
      // Update the project with the new image URL
      handleInputChange('featured_image', response.data.url);
      
      toast({
        title: 'Success',
        description: 'Image uploaded successfully',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive',
      });
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
        <h2 className="text-2xl font-bold">Project Management</h2>
        <Button onClick={handleCreateProject}>Create New Project</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Projects</CardTitle>
              <CardDescription>Manage your portfolio projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {projects.map((project) => (
                  <div 
                    key={project.id} 
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedProject?.id === project.id 
                        ? 'bg-primary/10 border border-primary' 
                        : 'bg-muted hover:bg-muted/80'
                    }`}
                    onClick={() => {
                      setSelectedProject(project);
                      setIsEditing(false);
                    }}
                  >
                    <h3 className="font-medium">{project.title}</h3>
                    <p className="text-sm text-muted-foreground truncate">{project.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-xs text-muted-foreground">
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded ${
                        project.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                ))}
                
                {projects.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    No projects found. Create your first project!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Project Editor */}
        <div className="lg:col-span-2">
          {selectedProject ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>
                      {isEditing ? 'Edit Project' : selectedProject.title}
                    </CardTitle>
                    <CardDescription>
                      {isEditing ? 'Modify your project' : 'View project details'}
                    </CardDescription>
                  </div>
                  <div className="space-x-2">
                    {isEditing ? (
                      <>
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleUpdateProject}>
                          Save Changes
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleDeleteProject(selectedProject.id)}
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
                        value={selectedProject.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={selectedProject.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        rows={3}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={selectedProject.content}
                        onChange={(e) => handleInputChange('content', e.target.value)}
                        rows={10}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="project_url">Project URL</Label>
                        <Input
                          id="project_url"
                          value={selectedProject.project_url || ''}
                          onChange={(e) => handleInputChange('project_url', e.target.value)}
                          placeholder="https://example.com"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="github_url">GitHub URL</Label>
                        <Input
                          id="github_url"
                          value={selectedProject.github_url || ''}
                          onChange={(e) => handleInputChange('github_url', e.target.value)}
                          placeholder="https://github.com/user/repo"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="technologies">Technologies (comma separated)</Label>
                      <Input
                        id="technologies"
                        value={selectedProject.technologies.join(', ')}
                        onChange={(e) => handleInputChange('technologies', e.target.value.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0))}
                        placeholder="React, TypeScript, Node.js"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="published"
                        checked={selectedProject.published}
                        onChange={(e) => handleInputChange('published', e.target.checked)}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="published">Published</Label>
                    </div>
                    
                    <div>
                      <Label htmlFor="image">Featured Image</Label>
                      <div className="flex items-end space-x-4">
                        <Input
                          ref={fileInputRef}
                          id="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          disabled={uploading}
                        />
                        {uploading && (
                          <div className="flex items-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mr-2"></div>
                            <span className="text-sm text-muted-foreground">Uploading...</span>
                          </div>
                        )}
                        {selectedProject.featured_image && (
                          <img 
                            src={getImageUrl(selectedProject.featured_image) || ''} 
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
                      <h3 className="text-lg font-medium mb-2">Description</h3>
                      <p className="text-muted-foreground">{selectedProject.description}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium mb-2">Content</h3>
                      <div className="prose max-w-none bg-muted p-4 rounded-lg">
                        {selectedProject.content}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">Project URL</h4>
                        {selectedProject.project_url ? (
                          <a 
                            href={selectedProject.project_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {selectedProject.project_url}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">Not provided</span>
                        )}
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-1">GitHub URL</h4>
                        {selectedProject.github_url ? (
                          <a 
                            href={selectedProject.github_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            {selectedProject.github_url}
                          </a>
                        ) : (
                          <span className="text-muted-foreground">Not provided</span>
                        )}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-1">Technologies</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.technologies.map((tech, index) => (
                          <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                            {tech}
                          </span>
                        ))}
                        {selectedProject.technologies.length === 0 && (
                          <span className="text-muted-foreground text-sm">No technologies specified</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="font-medium">Status:</span>
                      <span className={`px-2 py-1 rounded text-sm ${
                        selectedProject.published 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {selectedProject.published ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    
                    {selectedProject.featured_image && (
                      <div>
                        <h4 className="font-medium mb-1">Featured Image</h4>
                        <img 
                          src={getImageUrl(selectedProject.featured_image) || ''} 
                          alt={selectedProject.title} 
                          className="w-full max-w-md h-auto rounded-lg border"
                        />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-medium mb-1">Created At</h4>
                        <p className="text-muted-foreground">
                          {new Date(selectedProject.created_at).toLocaleString()}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-1">Updated At</h4>
                        <p className="text-muted-foreground">
                          {new Date(selectedProject.updated_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-64">
                <div className="text-center">
                  <p className="text-muted-foreground">
                    Select a project to view or edit, or create a new project
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

export default ProjectManagement;