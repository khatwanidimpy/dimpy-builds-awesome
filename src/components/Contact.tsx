import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, Calendar, MessageSquare, Linkedin, Github, Twitter } from 'lucide-react';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Contact <span className="text-primary">Me</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Interested in collaborating or discussing opportunities?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Direct Contact */}
          <Card className="border-muted hover:shadow-md transition-all duration-300 rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <Mail className="mr-3 h-6 w-6" />
                Direct Communication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-muted-foreground">
                Reach out directly for professional inquiries and opportunities.
              </p>
              
              <div className="space-y-4">
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 py-6 text-base" 
                  asChild
                >
                  <a href="mailto:dimpy@dimpykhatwani.dev">
                    <Mail className="mr-2 h-5 w-5" />
                    dimpy@dimpykhatwani.dev
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full border-primary text-primary hover:bg-primary/10 transition-all duration-300 py-6 text-base"
                  asChild
                >
                  <a href="https://calendly.com/dimpy-khatwani" target="_blank" rel="noopener noreferrer">
                    <Calendar className="mr-2 h-5 w-5" />
                    Schedule a Meeting
                  </a>
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="w-full hover:bg-secondary/80 transition-all duration-300 py-6 text-base"
                  asChild
                >
                  <a href="/resume.pdf" target="_blank" rel="noopener noreferrer" download>
                    <Mail className="mr-2 h-5 w-5" />
                    Download Resume
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="border-muted hover:shadow-md transition-all duration-300 rounded-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-primary">
                <MessageSquare className="mr-3 h-6 w-6" />
                Professional Networks
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <p className="text-muted-foreground">
                Connect with me on professional platforms.
              </p>
              
              <div className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-primary text-primary hover:bg-primary/10 transition-all duration-300 py-6 text-base"
                  asChild
                >
                  <a href="https://linkedin.com/in/dimpy-khatwani" target="_blank" rel="noopener noreferrer">
                    <Linkedin className="mr-2 h-5 w-5" />
                    LinkedIn Profile
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-primary text-primary hover:bg-primary/10 transition-all duration-300 py-6 text-base"
                  asChild
                >
                  <a href="https://github.com/dimpy-khatwani" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-5 w-5" />
                    GitHub Repositories
                  </a>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start border-primary text-primary hover:bg-primary/10 transition-all duration-300 py-6 text-base"
                  asChild
                >
                  <a href="https://twitter.com/dimpy_khatwani" target="_blank" rel="noopener noreferrer">
                    <Twitter className="mr-2 h-5 w-5" />
                    Twitter/X
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Info */}
        <Card className="mt-8 border-muted rounded-lg">
          <CardContent className="p-8 text-center">
            <h3 className="font-semibold text-xl mb-3 text-primary">Open to Opportunities</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Currently seeking challenging DevOps and cloud engineering roles. 
              Available for consulting on infrastructure automation and CI/CD implementation.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Contact;