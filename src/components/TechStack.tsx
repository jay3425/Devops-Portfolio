import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from 'framer-motion'
import { Activity, Boxes, Cloud, Code, GitBranch, Layers, ShieldCheck, Workflow, type LucideIcon } from 'lucide-react'
import { lazy, Suspense, useState } from 'react'
import { stack } from '../data/stack'
import { useMediaQuery } from '../hooks'
import ToolGraph from './ToolGraph'
import { Hairline, Reveal, SectionLabel } from './ui'

const PodCluster = lazy(() => import('./three/PodCluster'))

const icons: Record<string, LucideIcon> = {
  cloud: Cloud, cicd: Workflow, containers: Boxes, iac: Layers, monitoring: ShieldCheck, scripting: Code, platforms: GitBranch,
}

export default function TechStack() {
  const [tab, setTab] = useState('all')
  const reduce = useReducedMotion()
  const md = useMediaQuery('(min-width: 768px)')
  const cats = tab === 'all' ? stack : stack.filter((c) => c.id === tab)
  const tabs = [{ id: 'all', label: 'All' }, ...stack.map((c) => ({ id: c.id, label: c.label }))]
  const current = stack.find((c) => c.id === tab)

  return (
    <section id="stack" aria-labelledby="stack-title" className="px-3 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionLabel num="0.5" label="Tech stack" /></Reveal>
        <Hairline className="mt-4" />
        <Reveal className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h2 id="stack-title" className="display text-[clamp(3rem,9vw,7rem)] uppercase">Tools of the <span className="text-page-mute">trade</span></h2>
          <p className="max-w-sm text-sm text-page-mute">Filled chips are tools I have applied in projects; dashed chips are what I am still learning.</p>
        </Reveal>

        <LayoutGroup id="stack-tabs">
          <div role="tablist" aria-label="Technology categories" className="no-scrollbar -mx-3 mt-8 flex gap-2 overflow-x-auto px-3 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&>*]:shrink-0">
            {tabs.map((t) => {
              const on = tab === t.id
              return (
                <button
                  key={t.id} role="tab" type="button" aria-selected={on} onClick={() => setTab(t.id)}
                  className="relative rounded-full px-5 py-2.5 text-sm font-semibold ring-1 ring-line"
                >
                  {on && <motion.span layoutId="stack-pill" className="absolute inset-0 rounded-full bg-panel shadow-pill" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
                  <span className={`relative ${on ? 'text-panel-ink' : 'text-page-ink'}`}>{t.label}</span>
                </button>
              )
            })}
          </div>
        </LayoutGroup>

        <div role="tabpanel" className="relative mt-6 rounded-[2.25rem] bg-panel p-5 text-panel-ink ring-1 ring-white/10 sm:p-8">
          {md && (
            <div className="pointer-events-none absolute right-6 top-4 h-44 w-56" aria-hidden="true">
              <Suspense fallback={null}><PodCluster className="h-full w-full" count={stack.length} active={tab === 'all' ? -1 : stack.findIndex((c) => c.id === tab)} /></Suspense>
            </div>
          )}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 md:pr-60">
            <p className="text-sm text-panel-mute">{current ? current.blurb : 'Everything I work with, grouped by purpose.'}</p>
            <ul className="flex gap-4 font-mono text-xs text-panel-ink/80" aria-label="Legend">
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-accent-strong ring-2 ring-card" /> Used in projects</li>
              <li className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full border border-dashed border-current" /> Learning</li>
            </ul>
          </div>
          <div className="grid gap-8">
            <AnimatePresence mode="popLayout" initial={false}>
              {cats.map((c) => {
                const Icon = icons[c.id]
                return (
                  <motion.div key={c.id} layout initial={reduce ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <div className="mb-3 flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-card text-card-ink"><Icon className="h-4 w-4" /></span>
                      <h3 className="display text-3xl uppercase">{c.label}</h3>
                      <span className="h-px flex-1 bg-white/15" />
                    </div>
                    <ul className="flex flex-wrap gap-2.5">
                      {c.skills.map((s, i) => (
                        <motion.li
                          key={s.name}
                          initial={reduce ? false : { opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.025 }}
                          whileHover={reduce ? undefined : { y: -3 }}
                          className={`flex items-center gap-2 rounded-full px-4 py-2 font-mono text-xs font-medium ${s.status === 'used' ? 'bg-card text-card-ink' : 'border border-dashed border-white/40 text-panel-ink/75'}`}
                        >
                          <span aria-hidden="true" className={`h-2 w-2 rounded-full ${s.status === 'used' ? 'bg-accent-strong' : 'border border-current'}`} />
                          {s.name}
                          <span className="sr-only">{s.status === 'used' ? '(used in projects)' : '(learning)'}</span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                )
              })}
            </AnimatePresence>
          </div>
        </div>
        <Reveal className="mt-6"><ToolGraph /></Reveal>
        <Reveal className="mt-6">
          <div className="flex flex-wrap items-center gap-3 rounded-[2rem] bg-card p-4 text-card-ink shadow-pill sm:rounded-full sm:py-3 sm:pl-6">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-accent-strong">Currently exploring</span>
            <ul className="flex flex-wrap gap-2">
              {stack.flatMap((c) => c.skills).filter((s) => s.status === 'learning').map((s) => (
                <li key={s.name} className="rounded-full bg-panel px-3 py-1 font-mono text-xs text-panel-ink">{s.name}</li>
              ))}
            </ul>
          </div>
        </Reveal>
        <p className="mt-3 flex items-center gap-2 font-mono text-xs text-page-mute"><Activity className="h-3.5 w-3.5" /> No skill percentages — just an honest view of what I've applied versus what I'm still learning.</p>
      </div>
    </section>
  )
}
