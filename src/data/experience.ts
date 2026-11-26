export type ExperienceKind = 'Internship' | 'Academic' | 'Independent project'

export interface ExperienceItem {
  id: string
  kind: ExperienceKind
  role: string
  org: string
  /** Leave undefined until confirmed — the UI simply omits it. */
  dates?: string
  summary?: string
  points?: string[]
  tech?: string[]
}

/** Only confirmed information. Add dates / responsibilities here once verified. */
export const experience: ExperienceItem[] = [
  {
    // Source: Jay's own résumé PDF.
    id: 'hisan',
    kind: 'Internship',
    role: 'DevOps Intern',
    org: 'Hisan Labs Pvt Ltd',
    dates: 'Mar 2026 – Nov 2026',
    points: [
      'Practiced DevOps workflows using Linux, AWS, Git, Docker, and CI/CD tools.',
      'Worked on infrastructure automation, deployment pipelines, and project documentation.',
    ],
    tech: ['Linux', 'AWS', 'Git', 'Docker', 'CI/CD'],
  },
  {
    id: 'synent',
    kind: 'Internship',
    role: 'Internship',
    org: 'Synent Technologies',
    // dates: 'MMM YYYY – MMM YYYY',
    // points: ['Add confirmed responsibilities from your resume'],
  },
  {
    id: 'ibase',
    kind: 'Internship',
    role: 'Python Development Intern',
    org: 'iBase Technologies',
    // dates: 'MMM YYYY – MMM YYYY',
    summary: 'Worked on a text-to-speech automation tool built with Python.',
    tech: ['Python'],
  },
  {
    id: 'devops-projects',
    kind: 'Independent project',
    role: 'DevOps Engineering Projects',
    org: 'Personal projects',
    summary:
      'Hands-on practice building deployment workflows, infrastructure automation and monitoring tools.',
    points: [
      'NexOps — AI-assisted DevOps automation.',
      'CI/CD and cloud-native deployment pipeline on Amazon EKS with Terraform, Jenkins, SonarQube, Trivy, Prometheus and Grafana.',
      'InfraWatch — Linux monitoring and reporting with Bash, Cron and logrotate.',
    ],
    tech: ['Jenkins', 'Docker', 'Terraform', 'AWS', 'Linux'],
  },
  {
    id: 'education',
    kind: 'Academic',
    role: 'B.E. in Computer Science and Engineering',
    org: 'PRMCEAM · affiliated with SGBAU',
    dates: 'Batch 2026',
  },
]
