import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Calendar, MessageSquare, Linkedin, Github, Twitter } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let's Connect
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            I'm always interested in discussing DevOps best practices, cloud architecture, 
            or potential collaboration opportunities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Direct Contact */}
          <Card className="bg-gradient-card border-border/50 hover:shadow-glow-primary transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-primary" />
                Direct Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Ready to discuss your next project or have questions about DevOps?
              </p>
              
              <div className="space-y-3">
                <Button 
                  className="w-full bg-gradient-primary hover:shadow-glow-primary transition-all duration-300" 
                  asChild
                >
                  <a href="mailto:dimpy@dimpykhatwani.dev">
                    <Mail className="mr-2 h-4 w-4" />
                    dimpy@dimpykhatwani.dev
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300"
                  asChild
                >
                  <a href="https://calendly.com/dimpy-khatwani" target="_blank" rel="noopener noreferrer">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule a Call
                  </a>
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="w-full hover:shadow-glow-secondary transition-all duration-300"
                  asChild
                >
                  <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" download>
                    <Mail className="mr-2 h-4 w-4" />
                    Download Resume
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="bg-gradient-card border-border/50 hover:shadow-glow-accent transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-accent" />
                Social & Professional
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Connect with me on various platforms for updates and discussions.
              </p>
              
              <div className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  asChild
                >
                  <a href="https://linkedin.com/in/dimpy-khatwani" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-4 w-4" />
                    LinkedIn Profile
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-foreground hover:text-background transition-all duration-300"
                  asChild
                >
                  <a href="https://github.com/dimpy-khatwani" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub Repositories
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start hover:bg-blue-500 hover:text-white transition-all duration-300"
                  asChild
                >
                  <a href="https://twitter.com/dimpy_khatwani" target="_blank" rel="noopener noreferrer">
                    <Twitter className="mr-2 h-4 w-4" />
                    Twitter/X
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <Card className="mt-8 bg-muted/30 border-border/30">
          <CardContent className="p-6 text-center">
            <h3 className="font-semibold mb-2">Open to Opportunities</h3>
            <p className="text-sm text-muted-foreground">
              Currently seeking challenging DevOps and cloud engineering roles. 
              Available for freelance consulting on infrastructure automation and CI/CD implementation.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Contact;