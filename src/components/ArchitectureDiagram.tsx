import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown, ArrowRight } from 'lucide-react'
import type { Project } from '../data/projects'

/** Responsive flow diagram: stages left→right (top→bottom on phones) with supporting lanes. */
export default function ArchitectureDiagram({ arch }: { arch: Project['caseStudy']['architecture'] }) {
  const reduce = useReducedMotion()
  const n = arch.steps.length

  return (
    <figure>
      <ol className="grid gap-2 sm:flex sm:flex-wrap sm:items-stretch" aria-label="Architecture flow">
        {arch.steps.map((step, i) => (
          <li key={step} className="flex items-center gap-2 sm:contents">
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              className="flex flex-1 items-center gap-3 rounded-2xl bg-card px-4 py-3 text-card-ink sm:flex-none"
            >
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-panel font-mono text-xs font-bold text-panel-ink">{i + 1}</span>
              <span className="font-mono text-[12px] font-bold">{step}</span>
            </motion.div>
            {i < n - 1 && (
              <>
                <ArrowRight className="hidden h-4 w-4 shrink-0 self-center text-accent sm:block" aria-hidden="true" />
                <ArrowDown className="h-4 w-4 shrink-0 text-accent sm:hidden" aria-hidden="true" />
              </>
            )}
          </li>
        ))}
      </ol>

      {arch.lanes && (
        <ul className="mt-4 grid gap-2" aria-label="Supporting components">
          {arch.lanes.map((lane) => (
            <li key={lane.label} className="flex flex-wrap items-center gap-2 rounded-2xl border border-dashed border-white/30 px-4 py-2.5">
              <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{lane.label}</span>
              {lane.items.map((it) => <span key={it} className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs">{it}</span>)}
              <span className="ml-auto font-mono text-[11px] text-panel-mute">
                {lane.from === lane.to ? `stage ${lane.from + 1}` : `stages ${lane.from + 1}–${lane.to + 1}`}
              </span>
            </li>
          ))}
        </ul>
      )}
      <figcaption className="mt-3 text-sm text-panel-mute">{arch.note}</figcaption>
    </figure>
  )
}
