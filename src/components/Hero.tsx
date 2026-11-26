import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, ChevronDown, Download, Mail } from 'lucide-react'
import { lazy, Suspense, useEffect, useState } from 'react'
import { heroKeywords, site } from '../data/site'
import { projects } from '../data/projects'
import Gloss from './Gloss'
import InteractiveTerminal from './InteractiveTerminal'
import Magnetic from './Magnetic'
import ProjectArt from './ProjectArt'
import { GithubIcon, LinkedinIcon } from './icons'
import { Reveal, SocialLink } from './ui'

const ContainerStack = lazy(() => import('./three/ContainerStack'))

export default function Hero({ onOpenProject, onToggleTheme }: { onOpenProject: (id: string) => void; onToggleTheme: () => void }) {
  const reduce = useReducedMotion()
  const [kw, setKw] = useState(0)

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => setKw((k) => (k + 1) % heroKeywords.length), 2200)
    return () => window.clearInterval(id)
  }, [reduce])

  const featured = projects[0]

  return (
    <section id="home" aria-labelledby="hero-title" className="relative px-3 pb-10 pt-24 sm:px-6 sm:pt-28">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="sheen relative overflow-hidden rounded-[2.25rem] bg-panel p-4 text-panel-ink shadow-2xl ring-1 ring-white/10 sm:rounded-[2.75rem] sm:p-8"
        >
          <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden="true" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-card font-mono text-xs font-bold text-card-ink">0.1</span>
              <span className="min-w-0 truncate rounded-full border border-white/25 px-5 py-2.5 text-sm">About Jay Dengle</span>
            </div>
            <div className="hidden text-right sm:block">
              <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-panel-ink/90 md:text-xs">DevOps Engineering • Cloud • Automation</p>
              <div className="mt-2 h-[3px] rounded-full bg-white/30" />
            </div>
          </div>
          <p className="relative mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-panel-ink/80 sm:hidden">DevOps Engineering • Cloud • Automation</p>

          <div className="relative mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(340px,1fr)] lg:gap-8">
            {/* Headline */}
            <div className="relative">
              <h1 id="hero-title" className="display text-[clamp(3.4rem,12vw,7.6rem)] uppercase">
                {['BUILD.', 'AUTOMATE.', 'DEPLOY.'].map((w, i) => (
                  <span key={w} className="block overflow-hidden pb-[0.04em]">
                    <motion.span
                      className="block"
                      initial={reduce ? false : { y: '110%' }} animate={{ y: 0 }}
                      transition={{ duration: 0.8, delay: 1.25 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                    >
                      {w}
                    </motion.span>
                  </span>
                ))}
              </h1>
              <motion.span
                aria-hidden="true"
                initial={reduce ? false : { opacity: 0, scale: 0.8, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: -2 }}
                transition={{ delay: 1.8, type: 'spring', stiffness: 220, damping: 16 }}
                className="absolute left-[3%] top-[27%] z-10 hidden rounded-md border border-white/80 bg-black px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.25em] sm:block"
              >
                Infrastructure as Code
              </motion.span>
              <a
                href="#projects" aria-label="Jump to projects"
                className="absolute right-0 top-0 grid h-14 w-14 place-items-center rounded-full bg-card text-card-ink shadow-pill transition hover:rotate-12 active:scale-95 sm:h-16 sm:w-16"
              >
                <ArrowUpRight className="h-7 w-7" />
              </a>
              <p className="mt-4 max-w-md text-lg font-semibold text-panel-ink">Infrastructure as Code. Delivery without friction.</p>
            </div>

            {/* Right column: intro card + 3D figure */}
            <div className="flex flex-col gap-3">
            <div className="rounded-[2rem] bg-card p-5 text-card-ink sm:p-6">
              <div className="flex flex-wrap gap-2">
                <SocialLink kind="github" label="GitHub profile" className="inline-flex items-center gap-2 rounded-full bg-panel px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-panel-ink shadow-pill transition hover:-translate-y-0.5">
                  <GithubIcon className="h-4 w-4" /> GitHub
                </SocialLink>
                <SocialLink kind="linkedin" label="LinkedIn profile" className="inline-flex items-center gap-2 rounded-full bg-panel px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-panel-ink shadow-pill transition hover:-translate-y-0.5">
                  <LinkedinIcon className="h-4 w-4" /> LinkedIn
                </SocialLink>
              </div>
              <h2 className="mt-5 text-xl font-extrabold">Who is Jay Dengle?</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-card-mute">
                <Gloss text="I'm Jay Dengle, a Computer Science and Engineering graduate focused on DevOps, cloud infrastructure, CI/CD automation, and reliable deployment workflows." />
              </p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                <Magnetic><a href="#projects" className="group inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-panel py-3 pl-6 pr-4 text-sm font-bold text-panel-ink shadow-pill transition hover:-translate-y-0.5 active:scale-95">
                  Explore My Work <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </a></Magnetic>
                {site.resume ? (
                  <a href={site.resume} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-3 text-sm font-bold underline decoration-2 underline-offset-4 transition hover:text-accent-strong"><Download className="h-4 w-4" /> Resume</a>
                ) : import.meta.env.DEV ? (
                  <span aria-disabled="true" title="Dev hint: set VITE_RESUME_URL in .env.local" className="inline-flex items-center gap-2 px-4 py-3 text-sm font-bold opacity-40"><Download className="h-4 w-4" /> Resume</span>
                ) : null}
                <a href="#contact" className="inline-flex items-center whitespace-nowrap rounded-full border-2 border-card-ink px-6 py-[10px] text-sm font-bold transition hover:bg-panel hover:text-panel-ink active:scale-95">
                  Let's Connect
                </a>
              </div>
              <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-panel/[0.07] px-3.5 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em]">
                <span className="pulse-dot h-2 w-2 rounded-full bg-accent-strong" aria-hidden="true" /> {site.status}
              </p>
            </div>
            <div className="-mx-2 h-64 sm:h-80 lg:mx-0 lg:h-auto lg:min-h-[300px] lg:flex-1">
              <Suspense fallback={null}><ContainerStack className="h-full w-full" /></Suspense>
            </div>
            </div>
          </div>

          {/* Slider + keyword rotator + circle controls */}
          <div className="relative mt-6 grid items-center gap-4 md:grid-cols-[1fr_auto]">
            <div className="flex items-center gap-4 rounded-full bg-card py-1 pl-6 pr-3 text-card-ink">
              <label htmlFor="kw-slider" className="sr-only">Browse technology keywords</label>
              <input
                id="kw-slider" type="range" className="slider" min={0} max={heroKeywords.length - 1} value={kw}
                onChange={(e) => setKw(Number(e.target.value))}
              />
              <div className="relative h-8 w-36 shrink-0 overflow-hidden text-right font-mono text-xs font-bold uppercase tracking-wider" aria-live="off">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={kw} className="absolute inset-0 grid items-center justify-end"
                    initial={reduce ? false : { y: 18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={reduce ? { opacity: 0 } : { y: -18, opacity: 0 }} transition={{ duration: 0.25 }}
                  >
                    {heroKeywords[kw]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {(['github', 'linkedin', 'email'] as const).map((k) => (
                <SocialLink key={k} kind={k} className="grid h-12 w-12 place-items-center rounded-full bg-card text-card-ink shadow-pill transition hover:-translate-y-1 active:scale-95">
                  {k === 'email' ? <Mail className="h-5 w-5" /> : undefined}
                </SocialLink>
              ))}
              <a href="#about" className="ml-auto inline-flex items-center gap-3 rounded-full bg-card py-2.5 pl-6 pr-2.5 text-sm font-medium text-card-ink shadow-pill transition hover:-translate-y-0.5 md:ml-2">
                View more <span className="grid h-8 w-8 place-items-center rounded-full bg-panel text-panel-ink"><ArrowRight className="h-4 w-4" /></span>
              </a>
            </div>
          </div>
        </motion.div>


        <Reveal className="mt-4 rounded-[2.25rem] bg-panel p-4 text-panel-ink shadow-2xl ring-1 ring-white/10 sm:rounded-[2.75rem] sm:p-6">
          <p className="mb-4 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em] text-panel-mute">
            <span className="h-px flex-1 bg-white/15" /> How I work · what I'm building <span className="h-px flex-1 bg-white/15" />
          </p>
            <div className="grid gap-4 md:grid-cols-2">
            <InteractiveTerminal
              ctx={{
                go: (id) => document.getElementById(id)?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }),
                openProject: onOpenProject,
                toggleTheme: onToggleTheme,
                easter: () => window.dispatchEvent(new Event('easter-egg')),
              }}
            />
            <div className="grid overflow-hidden rounded-[1.75rem] bg-card text-card-ink sm:grid-cols-[1fr_1.1fr]">
              <div className="h-40 sm:h-auto"><ProjectArt kind={featured.art} /></div>
              <div className="flex flex-col justify-between gap-3 p-5">
                <div>
                  <p className="font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-accent-strong">Featured project</p>
                  <h3 className="display mt-1 text-4xl uppercase">{featured.title}</h3>
                  <p className="mt-1 line-clamp-3 text-sm text-card-mute">{featured.description}</p>
                </div>
                <button
                  type="button" onClick={() => onOpenProject(featured.id)}
                  className="inline-flex w-fit items-center gap-2 rounded-full bg-panel px-5 py-2.5 text-sm font-bold text-panel-ink shadow-pill transition hover:-translate-y-0.5 active:scale-95"
                >
                  View Case Study <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </Reveal>

        <a href="#about" aria-label="Scroll to About" className="mx-auto mt-6 flex w-fit flex-col items-center gap-1 font-mono text-[11px] uppercase tracking-[0.3em] text-page-mute">
          Scroll
          <motion.span animate={reduce ? undefined : { y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
            <ChevronDown className="h-5 w-5" />
          </motion.span>
        </a>
      </div>
    </section>
  )
}
