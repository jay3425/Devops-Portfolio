const env = import.meta.env
const clean = (v?: string) => (v && v.trim() ? v.trim() : undefined)

export type ProjectArtKind = 'nexops' | 'pipeline' | 'infrawatch'

export interface Project {
  id: string
  title: string
  category: string
  /**
   * Your own screenshots / short demo clips. Put files in public/projects/ and reference them as
   * '/projects/name.png'. Leave empty and the illustrated thumbnail is used instead.
   */
  media?: { type: 'image' | 'video'; src: string; alt: string; poster?: string }[]
  /** One-line standout for skimmers. */
  highlight: string
  /** Filter chips this project appears under. */
  filters: string[]
  description: string
  tech: string[]
  art: ProjectArtKind
  /** Real repository URL (from .env). When undefined the repo button is hidden in production. */
  repo?: string
  /** Live demo URL. Only set when a real demo exists. */
  demo?: string
  /** Show dev-only reminder that copy must be checked against the real repo. */
  needsVerification?: boolean
  caseStudy: {
    overview: string
    architecture: {
      steps: string[]
      note: string
      /** Supporting lanes drawn under the main flow, e.g. "Provisioned by" Terraform. */
      lanes?: { label: string; items: string[]; from: number; to: number }[]
    }
    implementation: string[]
    challenges: string[]
    lessons: string[]
  }
}

export const projectFilters = ['All', 'Automation', 'CI/CD', 'Cloud', 'DevSecOps', 'Linux', 'Monitoring', 'Live Demo']

export const projects: Project[] = [
  {
    id: 'nexops',
    title: 'NexOps',
    category: 'DevOps Automation / AI-Assisted Operations',
    highlight: 'AI-assisted automation for everyday ops tasks',
    filters: ['Automation'],
    description:
      'An AI-assisted DevOps project focused on streamlining infrastructure operations and making common operational tasks easier to execute and understand.',
    tech: ['Python', 'Jenkins', 'Docker', 'AWS', 'Shell Scripting'],
    art: 'nexops',
    repo: clean(env.VITE_REPO_NEXOPS),
    demo: clean(env.VITE_DEMO_NEXOPS),
    needsVerification: true,
    caseStudy: {
      overview:
        'NexOps explores how an AI-assisted layer can sit on top of everyday DevOps tooling so that routine operational tasks are quicker to run and easier to understand for the person operating them.',
      architecture: {
        steps: ['Operator request', 'AI-assisted layer', 'Automation scripts & Jenkins', 'Docker / AWS environment'],
        note: 'High-level flow of the project. Components are described at the level confirmed in the project brief.',
        lanes: [{ label: 'Packaged with', items: ['Docker'], from: 2, to: 3 }],
      },
      implementation: [
        'Python is the core language of the project.',
        'Jenkins and shell scripting are used to run repeatable automation steps.',
        'Docker packages the tooling so it behaves the same across environments.',
        'AWS is the target cloud platform for the operations it supports.',
      ],
      challenges: [
        'Keeping AI-assisted actions understandable and predictable for the person running them.',
        'Making operational tasks repeatable rather than one-off commands.',
      ],
      lessons: [
        'Automation is only useful when it is easy to understand and trust.',
        'Packaging tools in containers removes a large class of “works on my machine” problems.',
      ],
    },
  },
  {
    id: 'cicd-eks',
    title: 'CI/CD & Cloud-Native Deployment Pipeline',
    category: 'CI/CD / Cloud / DevSecOps',
    highlight: 'Jenkins → EKS, provisioned with Terraform, scanned and monitored',
    filters: ['CI/CD', 'Cloud', 'DevSecOps', 'Monitoring'],
    description:
      'An automated CI/CD workflow integrating Jenkins, SonarQube, and Trivy, deploying containerized applications to Amazon EKS, provisioning infrastructure with Terraform, and monitoring workloads using Prometheus and Grafana.',
    tech: ['Jenkins', 'SonarQube', 'Trivy', 'Docker', 'Amazon EKS', 'Terraform', 'Prometheus', 'Grafana'],
    art: 'pipeline',
    repo: clean(env.VITE_REPO_PIPELINE),
    demo: clean(env.VITE_DEMO_PIPELINE),
    caseStudy: {
      overview:
        'A project implementation of an end-to-end delivery workflow: code is built and analysed in Jenkins, scanned for quality and vulnerabilities, packaged as a container, deployed to Amazon EKS, and observed with Prometheus and Grafana. Infrastructure is provisioned with Terraform.',
      architecture: {
        steps: ['Commit', 'Jenkins build', 'SonarQube analysis', 'Docker image', 'Trivy scan', 'Amazon EKS', 'Prometheus + Grafana'],
        note: 'Terraform provisions the underlying infrastructure the pipeline deploys onto.',
        lanes: [
          { label: 'Provisioned by', items: ['Terraform'], from: 5, to: 5 },
          { label: 'Observed with', items: ['Prometheus', 'Grafana'], from: 5, to: 6 },
        ],
      },
      implementation: [
        'Jenkins orchestrates build, test, scan and deploy stages.',
        'SonarQube provides static code quality analysis; Trivy scans container images for vulnerabilities.',
        'Terraform describes the cloud infrastructure as code so it can be recreated consistently.',
        'Prometheus collects workload metrics and Grafana visualises them.',
      ],
      challenges: [
        'Coordinating several tools so each stage hands clean output to the next.',
        'Treating security scanning as a pipeline gate rather than an afterthought.',
      ],
      lessons: [
        'Infrastructure as Code makes environments reproducible and reviewable.',
        'Monitoring should be planned together with deployment, not added later.',
      ],
    },
  },
  {
    id: 'infrawatch',
    title: 'InfraWatch',
    category: 'Linux Automation / Monitoring',
    highlight: 'Cron-driven Linux monitoring in pure Bash',
    filters: ['Linux', 'Monitoring', 'Automation'],
    description:
      'A Linux infrastructure monitoring and reporting tool built with shell scripting and scheduled tasks, with logging and log rotation to support ongoing system monitoring.',
    tech: ['Linux', 'Bash', 'Cron', 'logrotate'],
    art: 'infrawatch',
    repo: clean(env.VITE_REPO_INFRAWATCH),
    demo: clean(env.VITE_DEMO_INFRAWATCH),
    caseStudy: {
      overview:
        'InfraWatch is a lightweight monitoring and reporting tool for Linux systems, built from Bash scripts that run on a schedule and write reports to log files.',
      architecture: {
        steps: ['Cron schedule', 'Bash checks', 'Report & log files', 'logrotate'],
        note: 'Scheduled tasks run the checks; logrotate keeps the log files manageable over time.',
        lanes: [{ label: 'Runs on', items: ['Linux'], from: 0, to: 3 }],
      },
      implementation: [
        'Bash scripts collect system information and produce reports.',
        'Cron runs the scripts on a regular schedule.',
        'Logging captures each run, and logrotate prevents log files growing without limit.',
      ],
      challenges: [
        'Making scheduled scripts safe to run repeatedly and unattended.',
        'Keeping output readable enough to be useful when something goes wrong.',
      ],
      lessons: [
        'Simple, well-understood tools like cron and Bash go a long way for small monitoring needs.',
        'Log management is part of the design, not an afterthought.',
      ],
    },
  },
]
