import { motion, useMotionValue, useReducedMotion, useSpring, type HTMLMotionProps } from 'framer-motion'
import { useEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { GithubIcon, GmailIcon, LinkedinIcon } from './icons'
import { site } from '../data/site'

/** Scroll-triggered reveal with optional stagger delay. */
export function Reveal({
  children, delay = 0, y = 28, className, ...rest
}: { children: ReactNode; delay?: number; y?: number; className?: string } & Omit<HTMLMotionProps<'div'>, 'children'>) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/** Numbered pill + hairline, as in the reference "0.1 About" bar. */
export function SectionLabel({ num, label, tone = 'page' }: { num: string; label: string; tone?: 'page' | 'panel' }) {
  const onPanel = tone === 'panel'
  return (
    <div className="flex items-center gap-3">
      <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full font-mono text-xs font-bold ${onPanel ? 'bg-card text-card-ink' : 'bg-panel text-panel-ink'}`}>
        {num}
      </span>
      <span className={`flex-1 truncate rounded-full border px-5 py-2 font-mono text-xs uppercase tracking-[0.22em] ${onPanel ? 'border-panel-ink/30 text-panel-ink' : 'border-line text-page-ink'}`}>
        {label}
      </span>
    </div>
  )
}

export function Hairline({ className = '' }: { className?: string }) {
  return <div className={`h-[3px] rounded-full bg-line ${className}`} aria-hidden="true" />
}

/** Social/contact link. When the URL isn't configured it is hidden in production and shown disabled in dev. */
export function SocialLink({
  kind, className = '', label, children,
}: { kind: 'github' | 'linkedin' | 'email'; className?: string; label?: string; children?: ReactNode }) {
  const map = {
    github: { url: site.github, Icon: GithubIcon, text: 'GitHub', env: 'VITE_GITHUB_URL' },
    linkedin: { url: site.linkedin, Icon: LinkedinIcon, text: 'LinkedIn', env: 'VITE_LINKEDIN_URL' },
    email: { url: `mailto:${site.email}`, Icon: GmailIcon, text: 'Email', env: 'VITE_CONTACT_EMAIL' },
  }[kind]
  const aria = label ?? `${map.text}${kind === 'email' ? ` — ${site.email}` : ''}`
  const inner = children ?? <map.Icon className="h-[18px] w-[18px]" />

  if (!map.url) {
    if (!import.meta.env.DEV) return null
    return (
      <span aria-disabled="true" title={`Dev hint: set ${map.env} in .env.local`} className={`${className} opacity-40`}>
        {inner}
      </span>
    )
  }
  const external = kind !== 'email'
  return (
    <a
      href={map.url}
      aria-label={aria}
      title={aria}
      className={className}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {inner}
    </a>
  )
}

/** Accessible modal: Esc to close, focus trap, scroll lock, focus restore. */
export function Modal({
  open, onClose, labelledBy, children, wide = false,
}: { open: boolean; onClose: () => void; labelledBy: string; children: ReactNode; wide?: boolean }) {
  const panelRef = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!open) return
    const previouslyFocused = document.activeElement as HTMLElement | null
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const panel = panelRef.current
    const focusables = () =>
      Array.from(panel?.querySelectorAll<HTMLElement>('a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])') ?? [])
    focusables()[0]?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
      if (e.key !== 'Tab') return
      const f = focusables()
      if (!f.length) return
      const first = f[0], last = f[f.length - 1]
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus() }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      previouslyFocused?.focus?.()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[80] grid place-items-end sm:place-items-center sm:p-6"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        >
          <button
            type="button" aria-label="Close dialog" tabIndex={-1} onClick={onClose}
            className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            ref={panelRef}
            role="dialog" aria-modal="true" aria-labelledby={labelledBy}
            initial={reduce ? false : { opacity: 0, y: 60, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className={`relative flex max-h-[94vh] w-full flex-col overflow-hidden rounded-b-none rounded-t-[2rem] bg-panel sm:max-h-[92vh] sm:rounded-[2rem] text-panel-ink shadow-2xl ring-1 ring-white/10 ${wide ? 'max-w-4xl' : 'max-w-2xl'}`}
          >
            <button
              type="button" onClick={onClose} aria-label="Close"
              className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full bg-card text-card-ink shadow-pill transition hover:scale-105 active:scale-95"
            >
              <X className="h-5 w-5" />
            </button>
            <span aria-hidden="true" className="mx-auto mt-2.5 block h-1.5 w-12 shrink-0 rounded-full bg-white/25 sm:hidden" />
            <div className="overflow-y-auto overscroll-contain">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/** Subtle 3D tilt toward the pointer. Disabled on touch devices and with reduced motion. */
export function Tilt({ children, className = '' }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0)
  const ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 200, damping: 20 })
  const sry = useSpring(ry, { stiffness: 200, damping: 20 })
  const enabled = !reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches

  function move(e: React.PointerEvent) {
    if (!enabled || !ref.current) return
    const r = ref.current.getBoundingClientRect()
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 6)
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 6)
  }
  function leave() { rx.set(0); ry.set(0) }

  return (
    <motion.div ref={ref} onPointerMove={move} onPointerLeave={leave} style={{ rotateX: srx, rotateY: sry, transformPerspective: 900 }} className={className}>
      {children}
    </motion.div>
  )
}
