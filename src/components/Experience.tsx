import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, MapPin } from 'lucide-react';

const Experience = () => {
  const experiences = [
    {
      company: 'Toshal Infotech',
      position: 'Jr DevOps Engineer',
      duration: '2022 - Present',
      location: 'Surat ,India ',
      description: 'Led CI/CD pipeline implementation and AWS infrastructure automation, reducing deployment time by 60% and improving system reliability.',
      achievements: [
        'Automated deployment pipelines using Jenkins and GitLab CI',
        'Managed AWS infrastructure with Terraform and CloudFormation',
        'Implemented monitoring solutions with Prometheus and Grafana',
        'Reduced infrastructure costs by 30% through optimization'
      ],
      technologies: ['AWS', 'Jenkins', 'Terraform', 'Docker', 'Kubernetes']
    },
    {
      company: 'Infinity Brains',
      position: 'Jr DevOps Engineer',
      duration: '2021 - 2022',
      location: 'Surat, India',
      description: 'Focused on high availability architecture and cost optimization for cloud infrastructure, managing multi-region deployments.',
      achievements: [
        'Designed HA architecture for critical applications',
        'Implemented disaster recovery strategies',
        'Optimized cloud costs using right-sizing and reserved instances',
        'Managed containerized applications with Docker Swarm'
      ],
      technologies: ['AWS', 'Docker', 'Ansible', 'CloudWatch', 'ELB']
    },
    {
      company: 'Narola Infotech',
      position: 'Trainee DevOps Engineer',
      duration: '2020 - 2021',
      location: 'Surat, India',
      description: 'Started my DevOps journey with shell scripting and containerization, building foundational skills in automation and deployment.',
      achievements: [
        'Automated server provisioning with shell scripts',
        'Containerized legacy applications using Docker',
        'Set up basic CI/CD pipelines',
        'Managed Linux servers and monitoring systems'
      ],
      technologies: ['Linux', 'Docker', 'Shell Scripting', 'Git', 'Nginx']
    }
  ];

  return (
    <section id="experience" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Professional Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            My journey in DevOps and cloud engineering
          </p>
        </div>

        <div className="space-y-8">
          {experiences.map((exp, index) => (
            <Card key={index} className="bg-gradient-card border-border/50 hover:shadow-glow-primary transition-all duration-300">
              <CardContent className="p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-primary mb-2">{exp.position}</h3>
                    <h4 className="text-xl font-semibold mb-3">{exp.company}</h4>
                    <p className="text-muted-foreground mb-4">{exp.description}</p>
                  </div>
                  
                  <div className="lg:text-right lg:ml-8">
                    <div className="flex items-center text-muted-foreground mb-2">
                      <CalendarDays className="h-4 w-4 mr-2" />
                      <span className="text-sm">{exp.duration}</span>
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span className="text-sm">{exp.location}</span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h5 className="font-semibold mb-3">Key Achievements:</h5>
                  <ul className="space-y-2">
                    {exp.achievements.map((achievement, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-primary mr-2">•</span>
                        <span className="text-muted-foreground">{achievement}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h5 className="font-semibold mb-3">Technologies:</h5>
                  <div className="flex flex-wrap gap-2">
                    {exp.technologies.map((tech, idx) => (
                      <Badge key={idx} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground">
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