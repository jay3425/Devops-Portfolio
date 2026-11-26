import { experience } from '../data/experience'
import { navItems, site } from '../data/site'
import { projects } from '../data/projects'
import { stack } from '../data/stack'

export interface TermContext {
  go: (id: string) => void
  openProject: (id: string) => void
  toggleTheme: () => void
  toggleLite: () => void
  easter: () => void
}
export interface TermResult { lines: string[]; tone?: 'ok' | 'err' | 'accent'; clear?: boolean }

export const COMMANDS = ['help', 'whoami', 'about', 'projects', 'open', 'skills', 'experience', 'education', 'contact', 'email', 'github', 'linkedin', 'resume', 'theme', 'lite', 'ls', 'clear', 'sudo hire jay']

const sections = navItems.map((n) => n.id)

export function runCommand(raw: string, ctx: TermContext): TermResult {
  const input = raw.trim().replace(/\s+/g, ' ')
  const [cmd, ...rest] = input.split(' ')
  const arg = rest.join(' ').toLowerCase()

  switch (cmd.toLowerCase()) {
    case '':
      return { lines: [] }
    case 'help':
      return {
        lines: [
          'Available commands:',
          '  whoami · about · education · experience',
          '  projects · open <project|section> · skills',
          '  contact · email · github · linkedin · resume',
          '  theme · lite · ls · clear',
          'Tip: press Tab to autocomplete, ↑/↓ for history.',
        ],
      }
    case 'whoami':
      return { lines: ['jay dengle — devops engineer · B.E. Computer Science & Engineering, batch 2026'] }
    case 'about':
      return { lines: ['CS&E graduate focused on DevOps, cloud infrastructure, CI/CD automation and reliable deployment workflows.', 'Approach: automate repetitive work, improve reliability, keep learning.'] }
    case 'education':
      return { lines: ['B.E. in Computer Science and Engineering — PRMCEAM (SGBAU), batch 2026'] }
    case 'experience':
      return { lines: experience.map((e) => `• [${e.kind}] ${e.role} — ${e.org}${e.dates ? ` (${e.dates})` : ''}`) }
    case 'projects':
      return { lines: [...projects.map((p) => `• ${p.title} — ${p.highlight}`), 'Try: open nexops'] }
    case 'skills':
    case 'stack': {
      const cats = arg ? stack.filter((c) => c.label.toLowerCase().includes(arg) || c.id === arg) : stack
      if (!cats.length) return { lines: [`no category matches "${arg}". Try: ${stack.map((c) => c.id).join(', ')}`], tone: 'err' }
      return { lines: cats.map((c) => `${c.label}: ${c.skills.map((s) => (s.status === 'learning' ? `${s.name} (learning)` : s.name)).join(', ')}`) }
    }
    case 'open': {
      if (!arg) return { lines: ['usage: open <project|section>   e.g. open nexops, open contact'], tone: 'err' }
      const p = projects.find((x) => x.id === arg || x.title.toLowerCase().includes(arg))
      if (p) { ctx.openProject(p.id); return { lines: [`opening case study: ${p.title}…`], tone: 'ok' } }
      const sec = sections.find((id) => id === arg || navItems.find((n) => n.id === id)?.label.toLowerCase() === arg)
      if (sec) { ctx.go(sec); return { lines: [`scrolling to ${sec}…`], tone: 'ok' } }
      return { lines: [`nothing to open for "${arg}". Try: ${[...projects.map((x) => x.id), ...sections].join(', ')}`], tone: 'err' }
    }
    case 'ls':
      return { lines: sections.map((s) => `${s}/`) }
    case 'contact':
    case 'email':
      return { lines: [`email: ${site.email}`, 'or run: open contact'] }
    case 'github':
      return { lines: [site.github ?? 'GitHub link is not configured yet.'], tone: site.github ? undefined : 'err' }
    case 'linkedin':
      return { lines: [site.linkedin ?? 'LinkedIn link is not configured yet.'], tone: site.linkedin ? undefined : 'err' }
    case 'resume':
      window.open(site.resume ?? '/resume.html', '_blank', 'noopener')
      return { lines: ['opening resume…'], tone: 'ok' }
    case 'theme':
      ctx.toggleTheme()
      return { lines: ['theme toggled'], tone: 'ok' }
    case 'lite':
      ctx.toggleLite()
      return { lines: ['3D lite mode toggled'], tone: 'ok' }
    case 'clear':
      return { lines: [], clear: true }
    case 'sudo':
      if (arg === 'hire jay') {
        ctx.easter()
        return { lines: ['[sudo] permission granted.', 'hire.sh: running… (just kidding — but I would love to talk.)', 'Run: open contact'], tone: 'accent' }
      }
      return { lines: ['usage: sudo <command>. (Hint: it works on exactly one phrase.)'], tone: 'err' }
    default:
      return { lines: [`command not found: ${cmd}. Type help.`], tone: 'err' }
  }
}
