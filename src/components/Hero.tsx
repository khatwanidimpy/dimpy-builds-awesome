import { Button } from "@/components/ui/button";
import { Github, Linkedin, Container, ExternalLink } from "lucide-react";

const Hero = () => {
  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-background"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <header className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              <span className="text-foreground">Dimpy Khatwani</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-muted-foreground">
              Senior DevOps Engineer
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              I design and implement scalable cloud infrastructure solutions,
              automate deployment pipelines, and optimize system performance for
              modern applications.
            </p>
          </header>

          <div className="flex flex-wrap justify-center gap-4 pt-6">
            <Button
              variant="default"
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 px-6"
              asChild
            >
              <a
                href="https://www.linkedin.com/in/dimpy-khatwani"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
              >
                <Linkedin className="mr-2 h-5 w-5" />
                LinkedIn
              </a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary/10 transition-all duration-300 px-6"
              asChild
            >
              <a
                href="https://github.com/dimpy-khatwani"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
              >
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary/10 transition-all duration-300 px-6"
              asChild
            >
              <a href="#contact" aria-label="Contact Section">
                <ExternalLink className="mr-2 h-5 w-5" />
                Contact
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
