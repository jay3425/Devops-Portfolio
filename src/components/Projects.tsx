import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, ExternalLink, Info } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { projectFilters, projects, type Project } from '../data/projects'
import { GithubIcon } from './icons'
import ArchitectureDiagram from './ArchitectureDiagram'
import Gloss from './Gloss'
import HorizontalScroll from './HorizontalScroll'
import ProjectArt from './ProjectArt'
import { Hairline, Modal, Reveal, SectionLabel, Tilt } from './ui'

const PipelineBanner = lazy(() => import('./three/PipelineBanner'))

function matches(p: Project, filter: string) {
  if (filter === 'All') return true
  if (filter === 'Live Demo') return !!p.demo
  return p.filters.includes(filter)
}

function RepoButton({ project, compact = false }: { project: Project; compact?: boolean }) {
  if (!project.repo) {
    if (!import.meta.env.DEV) return null
    return <span aria-disabled="true" title="Dev hint: set the repo URL in .env.local" className="grid h-11 w-11 place-items-center rounded-full bg-card/30 text-panel-ink opacity-50"><GithubIcon className="h-5 w-5" /></span>
  }
  return compact ? (
    <a href={project.repo} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} on GitHub`} className="grid h-11 w-11 place-items-center rounded-full bg-card text-card-ink shadow-pill transition hover:-translate-y-0.5 active:scale-95">
      <GithubIcon className="h-5 w-5" />
    </a>
  ) : (
    <a href={project.repo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-bold text-card-ink transition hover:-translate-y-0.5">
      <GithubIcon className="h-4 w-4" /> View repository
    </a>
  )
}

function CaseStudy({ project }: { project: Project }) {
  const cs = project.caseStudy
  const sections: [string, React.ReactNode][] = [
    ['Overview', <p key="o" className="text-[15px] leading-relaxed text-panel-ink/85"><Gloss text={cs.overview} /></p>],
    ['Architecture', <ArchitectureDiagram key="a" arch={cs.architecture} />],
    ['Implementation', <ul key="i" className="space-y-2 text-[15px] text-panel-ink/85">{cs.implementation.map((t) => <li key={t} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /><span><Gloss text={t} /></span></li>)}</ul>],
    ['Challenges', <ul key="c" className="space-y-2 text-[15px] text-panel-ink/85">{cs.challenges.map((t) => <li key={t} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{t}</li>)}</ul>],
    ['Lessons learned', <ul key="l" className="space-y-2 text-[15px] text-panel-ink/85">{cs.lessons.map((t) => <li key={t} className="flex gap-3"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{t}</li>)}</ul>],
  ]
  return (
    <article>
      <div className="aspect-[16/8] w-full overflow-hidden"><ProjectArt kind={project.art} /></div>
      <div className="p-6 sm:p-9">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">{project.category}</p>
        <h3 id="case-title" className="display mt-2 text-5xl uppercase sm:text-6xl">{project.title}</h3>
        <p className="mt-3 text-[15px] text-panel-ink/85">{project.description}</p>
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Technologies">
          {project.tech.map((t) => <li key={t} className="rounded-full border border-white/25 px-3 py-1 font-mono text-xs">{t}</li>)}
        </ul>
        {project.needsVerification && import.meta.env.DEV && (
          <p className="mt-4 flex gap-2 rounded-2xl border border-amber-300/40 bg-amber-300/10 p-3 text-xs text-amber-200">
            <Info className="h-4 w-4 shrink-0" /> Dev note: this copy is based on the project brief. Check it against the repository README and edit src/data/projects.ts before publishing.
          </p>
        )}
        {project.media && project.media.length > 0 && (
          <ul className="mt-8 grid gap-3 sm:grid-cols-2" aria-label="Screenshots and demos">
            {project.media.map((m) => (
              <li key={m.src} className="overflow-hidden rounded-2xl bg-panel-2 ring-1 ring-white/10">
                {m.type === 'video'
                  ? <video src={m.src} poster={m.poster} controls preload="none" playsInline className="w-full" aria-label={m.alt} />
                  : <img src={m.src} alt={m.alt} loading="lazy" className="w-full" />}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-8 grid gap-7">
          {sections.map(([title, body], i) => (
            <div key={title}>
              <div className="mb-3 flex items-center gap-3 rounded-full bg-card py-1.5 pl-1.5 pr-5 text-card-ink">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-panel font-mono text-xs font-bold text-panel-ink">{i + 1}.</span>
                <span className="text-sm font-bold">{title}</span>
              </div>
              {body}
            </div>
          ))}
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <RepoButton project={project} />
          {project.demo && (
            <a href={project.demo} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-bold">
              <ExternalLink className="h-4 w-4" /> Live demo
            </a>
          )}
        </div>
      </div>
    </article>
  )
}

export default function Projects({ activeId, onOpen, onClose }: { activeId: string | null; onOpen: (id: string) => void; onClose: () => void }) {
  const [filter, setFilter] = useState('All')
  const [gates, setGates] = useState({ sonar: true, trivy: true })
  const reduce = useReducedMotion()
  const shown = projects.filter((p) => matches(p, filter))
  const active = projects.find((p) => p.id === activeId)
  const pipelineStages = ['Build', ...(gates.sonar ? ['SonarQube'] : []), 'Image', ...(gates.trivy ? ['Trivy'] : []), 'Deploy']
  const gateMessage = gates.sonar && gates.trivy
    ? 'Full DevSecOps gate: code quality and image vulnerabilities are both checked before anything is deployed.'
    : gates.trivy
      ? 'No static analysis: code-quality problems can slip into the image.'
      : gates.sonar
        ? 'No image scan: known vulnerabilities in the container image would ship.'
        : 'No gates: whatever gets built gets deployed. This is exactly what DevSecOps exists to prevent.'

  return (
    <section id="projects" aria-labelledby="projects-title" className="px-3 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionLabel num="0.3" label="Projects" /></Reveal>
        <Hairline className="mt-4" />
        <Reveal className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="projects-title" className="display text-[clamp(3rem,9vw,7rem)] uppercase">Selected <span className="inline-block -rotate-2 rounded-md bg-panel px-3 text-panel-ink">work</span></h2>
          <p className="max-w-sm text-sm text-page-mute">Hands-on DevOps projects covering automation, delivery pipelines and Linux monitoring.</p>
        </Reveal>


        <Reveal className="relative mt-8 overflow-hidden rounded-[2.25rem] bg-panel p-4 text-panel-ink ring-1 ring-white/10 sm:p-6">
          <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative flex flex-wrap items-center justify-between gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">Pipeline playground <span className="normal-case tracking-normal text-panel-mute">· illustration</span></p>
            <div role="group" aria-label="Toggle pipeline gates" className="flex flex-wrap gap-2">
              {([['sonar', 'SonarQube'], ['trivy', 'Trivy']] as const).map(([k, label]) => (
                <button
                  key={k} type="button" aria-pressed={gates[k]} onClick={() => setGates((g) => ({ ...g, [k]: !g[k] }))}
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs font-bold transition active:scale-95 ${gates[k] ? 'bg-card text-card-ink' : 'border border-dashed border-white/40 text-panel-ink/70'}`}
                >
                  <span aria-hidden="true" className={`h-2 w-2 rounded-full ${gates[k] ? 'bg-accent-strong' : 'border border-current'}`} /> {label} {gates[k] ? 'on' : 'off'}
                </button>
              ))}
            </div>
          </div>
          <div className="pointer-events-none relative h-48 sm:h-64" aria-hidden="true">
            <Suspense fallback={null}><PipelineBanner stages={pipelineStages.length} className="h-full w-full" /></Suspense>
          </div>
          <ul className="relative -mt-2 grid text-center font-mono text-[10px] font-bold uppercase tracking-wider sm:text-xs" style={{ gridTemplateColumns: `repeat(${pipelineStages.length}, minmax(0, 1fr))` }} aria-label="Pipeline stages">
            {pipelineStages.map((l) => <li key={l}>{l}</li>)}
          </ul>
          <p role="status" className="relative mt-4 rounded-2xl bg-white/10 px-4 py-3 text-sm text-panel-ink/90">{gateMessage}</p>
        </Reveal>

        <LayoutGroup>
          <div role="group" aria-label="Filter projects" className="no-scrollbar -mx-3 mt-8 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&>*]:shrink-0">
            {projectFilters.map((f) => {
              const on = filter === f
              return (
                <button
                  key={f} type="button" aria-pressed={on} onClick={() => setFilter(f)}
                  className="relative rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-line transition-colors"
                >
                  {on && <motion.span layoutId="filter-pill" className="absolute inset-0 rounded-full bg-panel shadow-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span className={`relative ${on ? 'text-panel-ink' : 'text-page-ink'}`}>{f}</span>
                </button>
              )
            })}
          </div>

          {shown.length > 0 && <div className="mt-6"><HorizontalScroll label="Projects" hint="Scroll to explore →">
            <AnimatePresence mode="popLayout">
              {shown.map((p) => (
                <motion.li
                  key={p.id} layout
                  initial={reduce ? false : { opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.92 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex w-[min(86vw,25rem)] shrink-0 snap-start lg:w-[30rem]"
                >
                  <Tilt className="flex w-full"><article className="group flex w-full flex-col overflow-hidden rounded-[2rem] bg-panel p-3 text-panel-ink shadow-pill ring-1 ring-white/10">
                    <div className="aspect-[16/10] overflow-hidden rounded-[1.5rem] transition-transform duration-500 group-hover:scale-[1.02]">
                      {p.media?.[0]?.type === 'image'
                        ? <img src={p.media[0].src} alt={p.media[0].alt} loading="lazy" className="h-full w-full object-cover" />
                        : <ProjectArt kind={p.art} />}
                    </div>
                    <div className="flex flex-1 flex-col p-4">
                      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{p.category}</p>
                      <h3 className="display mt-2 text-4xl uppercase leading-[0.95]">{p.title}</h3>
                      <p className="mt-2 text-sm font-bold text-panel-ink">{p.highlight}</p>
                      <p className="mt-2 line-clamp-4 text-sm text-panel-ink/70">{p.description}</p>
                      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Technologies">
                        {p.tech.map((t) => <li key={t} className="rounded-full border border-white/20 px-2.5 py-1 font-mono text-[11px]">{t}</li>)}
                      </ul>
                      <div className="mt-auto flex items-center gap-2 pt-5">
                        <button type="button" onClick={() => onOpen(p.id)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-card px-5 py-3 text-sm font-bold text-card-ink shadow-pill transition hover:-translate-y-0.5 active:scale-95">
                          View Case Study <ArrowUpRight className="h-4 w-4" />
                        </button>
                        <RepoButton project={p} compact />
                      </div>
                    </div>
                  </article></Tilt>
                </motion.li>
              ))}
            </AnimatePresence>
          </HorizontalScroll></div>}
        </LayoutGroup>

        <AnimatePresence>
          {shown.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              role="status" className="mt-8 rounded-[2rem] border-2 border-dashed border-line p-10 text-center"
            >
              <p className="display text-4xl uppercase">Nothing here yet</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-page-mute">
                {filter === 'Live Demo' ? 'None of these projects has a hosted live demo right now — the code and case studies are available instead.' : `No projects match “${filter}”.`}
              </p>
              <button type="button" onClick={() => setFilter('All')} className="mt-5 rounded-full bg-panel px-6 py-3 text-sm font-bold text-panel-ink">Show all projects</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Modal open={!!active} onClose={onClose} labelledBy="case-title" wide>
        {active && <CaseStudy project={active} />}
      </Modal>
    </section>
  )
}
