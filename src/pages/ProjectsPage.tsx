import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Projects from '@/components/Projects';
import useSEO from '@/hooks/useSEO';
import { SEO_CONFIGS } from '@/lib/seo';

const ProjectsPage = () => {
  useSEO(SEO_CONFIGS.portfolio);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <Projects />
      </div>
      <Footer />
    </div>
  );
};

export default ProjectsPage;