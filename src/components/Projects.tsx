import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ExternalLink, Github } from 'lucide-react';
import { projectsApi } from '@/lib/api';
import { getImageUrl } from '@/lib/imageUtils';
import { updateMetaTags, SEO_CONFIGS } from '@/lib/seo';

interface Project {
  id: number;
  title: string;
  description: string;
  technologies: string[];
  featured_image: string | null;
  project_url: string | null;
  github_url: string | null;
  published: boolean;
  created_at: string;
}

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    updateMetaTags(SEO_CONFIGS.projects);
  }, []);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await projectsApi.getAllProjects({ published: true });
        
        if (response.success) {
          setProjects(response.data.projects);
        } else {
          setError(response.message || 'Failed to fetch projects');
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch projects');
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <section id="projects" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Professional <span className="text-primary">Portfolio</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Selected projects showcasing my technical expertise
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="projects" className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Professional <span className="text-primary">Portfolio</span>
            </h2>
            <p className="text-lg text-destructive max-w-2xl mx-auto">
              Error: {error}
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="projects" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Latest <span className="text-primary">Projects</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Selected projects showcasing my technical expertise
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-xl font-semibold mb-4">Portfolio Updates Coming Soon</h3>
              <p className="text-muted-foreground mb-6">
                I'm currently working on new projects to showcase. Please check back later!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="group hover:shadow-md transition-all duration-300 bg-card border-muted rounded-lg overflow-hidden h-full flex flex-col">
                {project.featured_image && (
                  <div className="aspect-video bg-muted overflow-hidden">
                    <img 
                      src={getImageUrl(project.featured_image) || ''} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl group-hover:text-primary transition-colors">
                    {project.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col">
                  <p className="text-muted-foreground mb-4 flex-grow">
                    {project.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {project.technologies.map((tech: string) => (
                      <Badge key={tech} variant="secondary" className="text-xs bg-primary/10 text-primary hover:bg-primary/20">
                        {tech}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex space-x-3 mt-auto">
                    {project.project_url && (
                      <Button variant="outline" size="sm" className="text-primary border-primary/30 hover:bg-primary/10 hover:border-primary/50 flex-1" asChild>
                        <a href={project.project_url} target="_blank" rel="noopener noreferrer">
                          View Project
                          <ExternalLink className="h-4 w-4 ml-2" />
                        </a>
                      </Button>
                    )}
                    {project.github_url && (
                      <Button variant="outline" size="sm" className="text-primary border-primary/30 hover:bg-primary/10 hover:border-primary/50 flex-1" asChild>
                        <a href={project.github_url} target="_blank" rel="noopener noreferrer">
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;