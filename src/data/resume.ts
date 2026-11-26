/** Résumé content, transcribed from Jay's own PDF résumé. Edit here to change /resume.html. */
export const resume = {
  name: 'JAY A DENGLE',
  headline: 'B.E. - Computer Science and Engineering',
  location: 'Amravati, MH',
  phone: '+91 9322912389',
  summary:
    'Motivated Computer Science graduate with hands-on experience in DevOps tools, including Jenkins, Docker, AWS, CI/CD pipelines, and automation. Seeking a DevOps Engineer role to apply my technical skills and contribute to efficient, scalable, and reliable infrastructure.',
  skills: [
    ['CI/CD', 'Jenkins, GitHub Actions.'],
    ['Containers', 'Docker, Kubernetes.'],
    ['Cloud Platforms', 'AWS, Azure (Basics).'],
    ['Version Control', 'Git, GitHub.'],
    ['Scripting', 'Bash, Python.'],
    ['Monitoring', 'DataDog, Prometheus, Grafana.'],
    ['OS', 'Linux (Ubuntu), Windows'],
  ] as [string, string][],
  education: [
    { school: 'HVPM COET', degree: 'Bachelor of Engineering (CSE)', place: 'Amravati', years: '2023 - 2026', scoreLabel: 'CGPA', score: '7.8/10.00' },
    { school: 'V.Y.W.S. Polytechnic', degree: 'Diploma In CM (Computer Technology)', place: 'Amravati', years: '2020 – 2023', scoreLabel: 'Aggregate', score: '80.57/100' },
  ],
  internships: [
    {
      org: 'Hisan Labs Pvt Ltd', role: 'Devops Intern', dates: 'Mar, 2026 – Nov, 2026',
      points: [
        'Practiced DevOps workflows using Linux, AWS, Git, Docker, and CI/CD tools.',
        'Worked on infrastructure automation, deployment pipelines, and project documentation.',
      ],
    },
  ],
  projects: [
    {
      title: 'NexOps : AI-Powered DevOps Automation Platform',
      objective: 'Develop an intelligent DevOps platform to streamline infrastructure operations, automate repetitive tasks, and improve operational efficiency.',
      implementation: 'Engineered an AI-assisted automation platform integrating DevOps workflows with infrastructure monitoring and troubleshooting capabilities.',
      capabilities: 'Designed automation workflows for CI/CD operations, system diagnostics, and infrastructure issue analysis to simplify operational tasks.',
      tech: 'Python, Jenkins, Docker, Linux, AWS, CI/CD, AI/LLM Integration.',
    },
    {
      title: 'AWS Cloud-Native CI/CD & Infrastructure Automation',
      objective: 'Deploy and monitor a Starbucks-inspired Next.js application using AWS cloud-native technologies, automated CI/CD, and infrastructure monitoring.',
      implementation: 'Automated CI/CD with Jenkins, SonarQube, and Trivy; deployed to EKS, provisioned AWS infrastructure using Terraform, and configured Prometheus and Grafana.',
      capabilities: 'CI/CD automation, Infrastructure as Code, Kubernetes orchestration, vulnerability scanning, and infrastructure monitoring.',
      tech: 'AWS, Jenkins, Terraform, Docker, Kubernetes, EKS, SonarQube, Trivy, Prometheus, Grafana, Blackbox Exporter, GitHub, Linux, Next.js.',
    },
  ],
  certificates: [{ short: 'CDEC', full: '(Cloud Devops Engineering Course)' }],
}
