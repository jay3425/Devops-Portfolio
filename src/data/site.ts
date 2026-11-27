import { notes } from './notes'

const env = import.meta.env
const clean = (v?: string) => (v && v.trim() ? v.trim() : undefined)
export const publicUrl = (value: string) => value.startsWith('/') ? `${env.BASE_URL}${value.slice(1)}` : value
const resumeUrl = clean(env.VITE_RESUME_URL) ?? '/resume.html'
const photoUrl = clean(env.VITE_PHOTO_URL) ?? '/photo.jpg'
const musicUrl = clean(env.VITE_MUSIC_URL)

/** Central, editable site configuration. Values come from .env.local (see .env.example). */
export const site = {
  name: 'Jay Dengle',
  initials: 'JD',
  role: 'DevOps Engineer',
  /** Small status label in the hero. Edit via VITE_STATUS. */
  status: clean(env.VITE_STATUS) ?? 'OPEN TO DEVOPS OPPORTUNITIES',
  email: clean(env.VITE_CONTACT_EMAIL) ?? 'jaydengle2005@gmail.com',
  github: clean(env.VITE_GITHUB_URL),
  /** GitHub username parsed from VITE_GITHUB_URL (used for the live activity block). */
  githubUser: clean(env.VITE_GITHUB_URL)?.match(/github\.com\/([A-Za-z0-9-]+)/)?.[1],
  linkedin: clean(env.VITE_LINKEDIN_URL),
  /** Defaults to the built-in printable resume page (/resume.html). Set VITE_RESUME_URL to use your own PDF. */
  resume: publicUrl(resumeUrl),
  photo: publicUrl(photoUrl),
  /** Optional custom track (e.g. /music.mp3 in public/). Without it a generated ambient loop is used. */
  music: musicUrl ? publicUrl(musicUrl) : undefined,
  web3formsKey: clean(env.VITE_WEB3FORMS_KEY),
  formEndpoint: clean(env.VITE_FORM_ENDPOINT),
}

export const navItems: { id: string; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'stack', label: 'Tech Stack' },
  { id: 'certificates', label: 'Certificates' },
  ...(notes.length ? [{ id: 'notes', label: 'Notes' }] : []),
  { id: 'contact', label: 'Contact' },
]

export const heroKeywords = [
  'Jenkins', 'Docker', 'Terraform', 'Amazon EKS', 'Prometheus', 'Grafana', 'Trivy', 'SonarQube', 'Linux', 'Bash',
]
