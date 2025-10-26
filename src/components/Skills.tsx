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
    { name: 'Cloud Platforms', icon: Cloud, description: 'AWS, Azure, Google Cloud' },
    { name: 'Containerization', icon: Container, description: 'Docker, Kubernetes, ECS' },
    { name: 'Infrastructure', icon: Server , description: 'Terraform, CloudFormation' },
    { name: 'CI/CD', icon: Settings, description: 'Jenkins, GitLab CI, GitHub Actions' },
    { name: 'Configuration', icon: CalendarCheck2, description: 'Ansible, Puppet, Chef' },
    { name: 'Monitoring', icon: Zap, description: 'Prometheus, Grafana, ELK Stack' },
    { name: 'Version Control', icon: GitBranch, description: 'Git, GitHub, GitLab' },
    { name: 'System Admin', icon: Terminal, description: 'Linux, Windows Server' },
    { name: 'Security', icon: Shield, description: 'DevSecOps, Vulnerability Management' },
    { name: 'Databases', icon: Database, description: 'MySQL, PostgreSQL, MongoDB' },
    { name: 'Networking', icon: Network, description: 'Load Balancing, DNS, CDN' },
    { name: 'Performance', icon: Cpu, description: 'Optimization, Scaling' }
  ];

  return (
    <section id="skills" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Technical <span className="text-primary">Skills</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Core competencies and technologies I specialize in
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {skills.map((skill, index) => (
            <Card 
              key={skill.name} 
              className="group hover:shadow-md transition-all duration-300 border-muted rounded-lg"
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4">
                  <skill.icon className="h-10 w-10 mx-auto text-primary group-hover:scale-110 transition-transform duration-300" />
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