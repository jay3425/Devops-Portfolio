/** used = applied in my projects; learning = studying / exploring. Adjust honestly as you grow. */
export type SkillStatus = 'used' | 'learning'

export interface Skill { name: string; status: SkillStatus }
export interface StackCategory {
  id: string
  label: string
  blurb: string
  skills: Skill[]
}

const used = (name: string): Skill => ({ name, status: 'used' })
const learning = (name: string): Skill => ({ name, status: 'learning' })

export const stack: StackCategory[] = [
  {
    id: 'cloud', label: 'Cloud', blurb: 'AWS services and the building blocks of cloud infrastructure.',
    skills: [used('AWS'), used('EC2'), used('VPC'), used('S3'), used('IAM'), learning('EBS'), learning('EFS'), learning('ALB'), learning('Auto Scaling'), learning('Route 53'), learning('CloudWatch'), learning('Lambda')],
  },
  {
    id: 'cicd', label: 'CI/CD', blurb: 'Automating build, test and release workflows.',
    skills: [used('Jenkins'), learning('GitHub Actions')],
  },
  {
    id: 'containers', label: 'Containers', blurb: 'Packaging and running applications consistently.',
    skills: [used('Docker'), used('Kubernetes')],
  },
  {
    id: 'iac', label: 'Infrastructure as Code', blurb: 'Describing infrastructure in version-controlled code.',
    skills: [used('Terraform')],
  },
  {
    id: 'monitoring', label: 'Monitoring & Security', blurb: 'Observability and shifting security left.',
    skills: [used('Prometheus'), used('Grafana'), used('SonarQube'), used('Trivy')],
  },
  {
    id: 'scripting', label: 'Programming & Scripting', blurb: 'Languages used to automate and build tools.',
    skills: [used('Python'), used('Bash'), learning('SQL')],
  },
  {
    id: 'platforms', label: 'Version Control & Platforms', blurb: 'Source control and the operating system underneath it all.',
    skills: [used('Git'), used('GitHub'), learning('GitLab'), used('Linux')],
  },
]
