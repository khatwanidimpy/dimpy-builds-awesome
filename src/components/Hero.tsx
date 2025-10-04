import { Button } from '@/components/ui/button';
import { Github, Linkedin, Container, ExternalLink } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Hi, I'm{' '}
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Dimpy Khatwani
              </span>{' '}
              👋
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground">
              DevOps Engineer
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              I automate, containerize, and scale modern applications. 
              Passionate about building robust CI/CD pipelines and cloud infrastructure.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="default" 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow-primary transition-all duration-300"
              asChild
            >
              <a href="https://linkedin.com/in/dimpy-khatwani" target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn
              </a>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
              asChild
            >
              <a href="https://github.com/dimpy-khatwani" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </a>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="border-primary text-primary hover:bg-accent hover:text-primary-foreground transition-all duration-300"
              asChild
            >
              <a href="https://hub.docker.com/u/dimpykhatwani" target="_blank" rel="noopener noreferrer">
                <Container className="mr-2 h-5 w-5" />
                DockerHub
              </a>
            </Button>
            
            <Button 
              variant="secondary" 
              size="lg"
              className="hover:shadow-glow-accent transition-all duration-300"
              asChild
            >
              <a href="https://blog.dimpykhatwani.dev" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-5 w-5" />
                Blog
              </a>
            </Button>
          </div>

          <div className="pt-8">
            <div className="animate-bounce">
              <a href="#skills" className="text-muted-foreground hover:text-primary transition-colors">
                <svg className="w-6 h-6 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;