import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Skills from '@/components/Skills';
import useSEO from '@/hooks/useSEO';
import { SEO_CONFIGS } from '@/lib/seo';

const SkillsPage = () => {
  useSEO(SEO_CONFIGS.skills);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-16">
        <Skills />
      </div>
      <Footer />
    </div>
  );
};

export default SkillsPage;