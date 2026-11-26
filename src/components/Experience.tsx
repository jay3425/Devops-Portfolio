import { motion, useReducedMotion, useSpring, type MotionValue } from 'framer-motion'
import { lazy, Suspense } from 'react'
import { experience, type ExperienceItem } from '../data/experience'
import { Hairline, Reveal, SectionLabel } from './ui'
import HorizontalScroll from './HorizontalScroll'

const TowerBuild = lazy(() => import('./three/TowerBuild'))

function Tower({ progress }: { progress: MotionValue<number> }) {
  const smooth = useSpring(progress, { stiffness: 120, damping: 28 })
  return (
    <div className="relative h-[440px] w-72 overflow-hidden rounded-[2rem] bg-panel p-3 text-panel-ink ring-1 ring-white/10">
      <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <Suspense fallback={null}><TowerBuild progress={smooth} className="relative h-[380px] w-full" /></Suspense>
      <p className="relative mt-1 text-center font-mono text-[11px] text-panel-mute">Builds as you scroll · illustration</p>
    </div>
  )
}

type Tone = 'dark' | 'light' | 'violet'

function toneFor(item: ExperienceItem, i: number): Tone {
  if (i === 0) return 'dark'
  if (item.kind === 'Independent project') return 'violet'
  return 'light'
}

const toneClass: Record<Tone, { card: string; mute: string; chip: string; num: string }> = {
  dark: { card: 'bg-panel text-panel-ink ring-1 ring-white/10', mute: 'text-panel-mute', chip: 'border-white/25', num: 'text-white/[0.07]' },
  light: { card: 'bg-card text-card-ink ring-1 ring-black/10', mute: 'text-card-mute', chip: 'border-black/25', num: 'text-black/[0.06]' },
  violet: { card: 'bg-accent text-black ring-1 ring-black/10', mute: 'text-black/65', chip: 'border-black/35', num: 'text-black/[0.1]' },
}

function Card({ item, i }: { item: ExperienceItem; i: number }) {
  const tone = toneFor(item, i)
  const t = toneClass[tone]
  const thin = !item.summary && !item.points && !item.tech
  return (
    <article className={`relative flex w-full flex-col overflow-hidden rounded-[2rem] p-6 shadow-pill sm:p-8 ${t.card}`}>
      {tone === 'dark' && <div className="grid-lines pointer-events-none absolute inset-0 opacity-50" aria-hidden="true" />}
      <span aria-hidden="true" className={`display pointer-events-none absolute -right-2 -top-6 select-none text-[9rem] leading-none ${t.num}`}>{String(i + 1).padStart(2, '0')}</span>
      <div className="relative flex flex-wrap items-center gap-2">
        <span className={`rounded-full px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider ${tone === 'dark' ? 'bg-accent text-black' : tone === 'violet' ? 'bg-black text-white' : 'bg-panel text-panel-ink'}`}>{item.kind}</span>
        {i === 0 && <span className="rounded-full border border-white/30 px-3 py-1 font-mono text-[11px] font-bold uppercase tracking-wider">Latest</span>}
      </div>
      <h3 className="display relative mt-5 text-4xl uppercase leading-[0.95] sm:text-5xl">{item.role}</h3>
      <p className={`relative mt-2 text-sm font-semibold ${t.mute}`}>{item.org}</p>
      {item.summary && <p className="relative mt-4 text-[15px] opacity-90">{item.summary}</p>}
      {item.points && (
        <ul className={`relative mt-4 space-y-2.5 text-[14px] ${tone === 'dark' ? 'font-mono text-[13px]' : ''}`}>
          {item.points.map((p) => (
            <li key={p} className="flex gap-3">
              <span aria-hidden="true" className={`shrink-0 font-mono font-bold ${tone === 'dark' ? 'text-accent' : tone === 'violet' ? 'text-black' : 'text-accent-strong'}`}>{tone === 'dark' ? '$' : '▸'}</span>
              <span className="opacity-90">{p}</span>
            </li>
          ))}
        </ul>
      )}
      {thin && <p className={`relative mt-5 rounded-2xl border border-dashed p-3 font-mono text-xs ${t.chip} ${t.mute}`}>Details to be added.</p>}
      {item.tech && (
        <ul className="relative mt-auto flex flex-wrap gap-2 pt-6" aria-label="Technologies">
          {item.tech.map((x) => <li key={x} className={`rounded-full border px-3 py-1 font-mono text-xs ${t.chip}`}>{x}</li>)}
        </ul>
      )}
    </article>
  )
}

export default function Experience() {
  const reduce = useReducedMotion()
  const counts = {
    internships: experience.filter((e) => e.kind === 'Internship').length,
    projects: experience.filter((e) => e.kind === 'Independent project').length,
  }
  return (
    <section id="experience" aria-labelledby="exp-title" className="px-3 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionLabel num="0.4" label="Experience" /></Reveal>
        <Hairline className="mt-4" />
        <Reveal className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 id="exp-title" className="display text-[clamp(3rem,9vw,7rem)] uppercase">Path <span className="inline-block rotate-2 rounded-md bg-accent px-3 text-black">&amp;</span> practice</h2>
            <p className="mt-3 max-w-xl text-sm text-page-mute">Internships, independent projects and education — only what I can stand behind.</p>
          </div>
          <dl className="flex gap-3">
            {[[counts.internships, 'Internships'], [counts.projects, 'Project track']].map(([n, l]) => (
              <div key={l} className="rounded-3xl bg-panel px-5 py-3 text-panel-ink shadow-pill">
                <dd className="display text-4xl leading-none text-accent">{String(n).padStart(2, '0')}</dd>
                <dt className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-panel-mute">{l}</dt>
              </div>
            ))}
          </dl>
        </Reveal>
        <div className="mt-6">
          <HorizontalScroll label="Experience timeline" hint="Keep scrolling →">
            {(progress) => (
              <>
                <li aria-hidden="true" className="hidden shrink-0 items-end lg:flex"><Tower progress={progress} /></li>
                {experience.map((item, i) => (
                  <motion.li
                    key={item.id}
                    initial={reduce ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                    className="flex w-[min(86vw,26rem)] shrink-0 snap-start flex-col self-start"
                  >
                    <div className="mb-3 flex items-center gap-3" aria-hidden="true">
                      <span className={`h-3.5 w-3.5 shrink-0 rounded-full ring-4 ring-accent/30 ${i === 0 ? 'bg-accent-strong' : 'bg-page-ink'}`} />
                      <span className="h-[2px] flex-1 rounded-full bg-gradient-to-r from-accent-strong/70 to-transparent" />
                      <span className="font-mono text-[11px] uppercase tracking-wider text-page-mute">{item.dates ?? ''}</span>
                    </div>
                    <Card item={item} i={i} />
                  </motion.li>
                ))}
              </>
            )}
          </HorizontalScroll>
        </div>
      </div>
    </section>
  )
}
