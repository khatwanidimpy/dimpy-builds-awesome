import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Experience from '@/components/Experience';
import useSEO from '@/hooks/useSEO';
import { SEO_CONFIGS } from '@/lib/seo';

const ExperiencePage = () => {
  useSEO(SEO_CONFIGS.experience);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <Experience />
      </div>
      <Footer />
    </div>
  );
};

export default ExperiencePage;