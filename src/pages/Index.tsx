import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Skills from '@/components/Skills';
import Projects from '@/components/Projects';
import Blog from '@/components/Blog';
import Experience from '@/components/Experience';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { updateMetaTags, SEO_CONFIGS } from '@/lib/seo';

// Structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Dimpy Khatwani",
  "jobTitle": "DevOps Engineer",
  "description": "DevOps Engineer specializing in AWS, Docker, Kubernetes, and CI/CD automation",
  "url": "https://dimpykhatwani.dev",
  "sameAs": [
    "https://linkedin.com/in/dimpykhatwani",
    "https://github.com/dimpykhatwani"
  ]
};

const Index = () => {
  useEffect(() => {
    updateMetaTags(SEO_CONFIGS.home);
    
    // Add structured data to head
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);
    
    // Clean up script when component unmounts
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Skills />
      <Projects />
      <Blog />
      <Experience />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;