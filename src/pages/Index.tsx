import { useEffect } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Blog from "@/components/Blog";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { updateMetaTags, SEO_CONFIGS } from "@/lib/seo";

// Enhanced structured data for SEO
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Dimpy Khatwani",
  jobTitle: "Senior DevOps Engineer",
  description:
    "DevOps Engineer specializing in AWS, Docker, Kubernetes, and CI/CD automation",
  url: "https://dimpykhatwani.com",
  sameAs: [
    "https://www.linkedin.com/in/dimpy-khatwani/",
    "https://github.com/dimpykhatwani",
  ],
  knowsAbout: [
    "DevOps",
    "AWS",
    "Docker",
    "Kubernetes",
    "CI/CD",
    "Terraform",
    "Jenkins",
    "Cloud Infrastructure",
    "Infrastructure as Code",
    "Containerization",
  ],
  alumniOf: [
    {
      "@type": "EducationalOrganization",
      name: "University of Mumbai",
    },
  ],
  worksFor: {
    "@type": "Organization",
    name: "Freelance",
  },
};

const Index = () => {
  useEffect(() => {
    updateMetaTags(SEO_CONFIGS.home);

    // Add structured data to head
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Clean up script when component unmounts
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Blog />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
