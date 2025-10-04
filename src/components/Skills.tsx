import { Card, CardContent } from '@/components/ui/card';
import { 
  Cloud, 
  Container, 
  GitBranch, 
  Server, 
  Terminal, 
  Database,
  Shield,
  Cpu,
  Network,
  HardDrive,
  Settings,
  Zap,
  CalendarCheck,
  CalendarCheck2
} from 'lucide-react';

const Skills = () => {
  const skills = [
    { name: 'AWS, AZURE', icon: Cloud, description: 'EC2, S3, RDS, Lambda, CloudFormation' },
    { name: 'Docker', icon: Container, description: 'Containerization & Orchestration' },
    { name: 'promomx', icon: Server , description: 'Containerization & Orchestration' },
    { name: 'Terraform', icon: HardDrive, description: 'Infrastructure as Code' },
    { name: 'Jenkins', icon: Settings, description: 'CI/CD Pipeline Automation' },
    { name: 'Ansible', icon: CalendarCheck2, description: 'Configuration Management' },
    { name: 'Kubernetes', icon: Network, description: 'Container Orchestration' },
    { name: 'Git/GitHub', icon: GitBranch, description: 'Version Control & Collaboration' },
    { name: 'Linux', icon: Terminal, description: 'System Administration' },
    { name: 'Monitoring', icon: Zap, description: 'Prometheus, Grafana, ELK Stack' },
    { name: 'Security', icon: Shield, description: 'DevSecOps & Vulnerability Management' },
    { name: 'Databases', icon: Database, description: 'MySQL, PostgreSQL, MongoDB' },
    { name: 'Performance', icon: Cpu, description: 'Optimization & Scaling' },
    { name: 'Performance', icon: Cpu, description: 'Optimization & Scaling' },

  ];

  return (
    <section id="skills" className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Technical Skills
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Technologies and tools I use to build and deploy scalable infrastructure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <Card 
              key={skill.name} 
              className="group hover:shadow-glow-primary transition-all duration-300 hover:-translate-y-1 bg-gradient-card border-border/50"
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <skill.icon className="h-12 w-12 mx-auto text-primary group-hover:text-accent transition-colors duration-300" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
                <p className="text-sm text-muted-foreground">{skill.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;