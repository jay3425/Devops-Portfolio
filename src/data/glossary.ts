/** Plain-language definitions shown as tooltips. Keys are matched case-sensitively. */
export const glossary: Record<string, string> = {
  'CI/CD': 'Continuous Integration / Continuous Delivery: automatically building, testing and releasing code every time it changes.',
  'Infrastructure as Code': 'Describing servers, networks and cloud resources in version-controlled files so they can be recreated reliably.',
  IaC: 'Infrastructure as Code: managing infrastructure through code instead of manual clicks.',
  DevSecOps: 'DevOps with security built into the pipeline (scans and checks) rather than added at the end.',
  'Amazon EKS': 'Amazon Elastic Kubernetes Service: AWS-managed Kubernetes for running containers at scale.',
  EKS: 'Amazon Elastic Kubernetes Service: AWS-managed Kubernetes.',
  Kubernetes: 'An open-source system that deploys, scales and heals containerised applications across machines.',
  Terraform: 'A tool for provisioning cloud infrastructure from declarative configuration files.',
  Jenkins: 'An automation server commonly used to run CI/CD pipelines.',
  SonarQube: 'A static-analysis tool that reports code-quality and security issues in source code.',
  Trivy: 'A scanner that finds known vulnerabilities in container images and dependencies.',
  Prometheus: 'A monitoring system that collects time-series metrics from running services.',
  Grafana: 'A dashboard tool for visualising metrics, often from Prometheus.',
  Docker: 'A tool for packaging an application and its dependencies into a portable container.',
  Cron: 'A Linux scheduler that runs commands at set times.',
  logrotate: 'A Linux utility that rotates and compresses log files so they do not grow without limit.',
}
