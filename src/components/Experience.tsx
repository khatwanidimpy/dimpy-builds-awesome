import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin } from 'lucide-react';

const Experience = () => {
  const experiences = [
    {
      company: 'Toshal Infotech',
      position: 'Senior DevOps Engineer',
      duration: '2022 - Present',
      location: 'Surat, India',
      description: 'Leading infrastructure automation and cloud migration initiatives for enterprise clients.',
      achievements: [
        'Architected and deployed multi-region Kubernetes clusters reducing deployment time by 70%',
        'Implemented Infrastructure as Code using Terraform, managing 200+ AWS resources',
        'Designed monitoring and alerting systems with Prometheus and Grafana, improving system reliability',
        'Reduced cloud infrastructure costs by 35% through rightsizing and reserved instances'
      ],
      technologies: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'Prometheus', 'Grafana']
    },
    {
      company: 'Infinity Brains',
      position: 'DevOps Engineer',
      duration: '2021 - 2022',
      location: 'Surat, India',
      description: 'Focused on CI/CD pipeline optimization and container orchestration.',
      achievements: [
        'Built automated CI/CD pipelines reducing deployment cycles from hours to minutes',
        'Containerized legacy applications improving scalability and resource utilization',
        'Implemented disaster recovery solutions with multi-zone redundancy',
        'Established security best practices and vulnerability scanning in deployment pipeline'
      ],
      technologies: ['Docker', 'Jenkins', 'AWS', 'Ansible', 'GitLab CI']
    },
    {
      company: 'Narola Infotech',
      position: 'Junior DevOps Engineer',
      duration: '2020 - 2021',
      location: 'Surat, India',
      description: 'Started career in system administration and automation scripting.',
      achievements: [
        'Automated server provisioning and configuration management',
        'Developed shell scripts for routine system maintenance tasks',
        'Implemented basic monitoring for critical system metrics',
        'Supported migration of applications to containerized environments'
      ],
      technologies: ['Linux', 'Shell Scripting', 'Docker', 'Git', 'Nginx']
    }
  ];

  return (
    <section id="experience" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Professional <span className="text-primary">Experience</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My career journey in DevOps and cloud engineering
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card key={index} className="border-muted hover:shadow-md transition-all duration-300 rounded-lg">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-primary mb-2">{exp.position}</h3>
                    <h4 className="text-xl font-semibold mb-3">{exp.company}</h4>
                    <p className="text-muted-foreground mb-5">{exp.description}</p>
                  </div>
                  
                  <div className="lg:text-right lg:ml-8 mt-4 lg:mt-0">
                    <div className="flex items-center text-muted-foreground mb-2">
                      <CalendarDays className="h-5 w-5 mr-2" />
                      <span>{exp.duration}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{exp.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h5 className="font-semibold mb-3 text-lg">Key Achievements:</h5>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-primary mr-3 mt-1">•</span>
                        <span className="text-muted-foreground">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold mb-3">Technologies:</h5>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Experience;