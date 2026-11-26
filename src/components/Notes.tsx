import { ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { notes, type Note } from '../data/notes'
import { Hairline, Modal, Reveal, SectionLabel } from './ui'

/** Rendered only when src/data/notes.ts has entries. */
export default function Notes() {
  const [open, setOpen] = useState<Note | null>(null)
  if (!notes.length) return null
  return (
    <section id="notes" aria-labelledby="notes-title" className="px-3 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionLabel num="0.7" label="Notes" /></Reveal>
        <Hairline className="mt-4" />
        <Reveal className="mt-8">
          <h2 id="notes-title" className="display text-[clamp(3rem,9vw,7rem)] uppercase">Field notes</h2>
          <p className="mt-3 max-w-xl text-sm text-page-mute">Short write-ups on things I built, broke and learned.</p>
        </Reveal>
        <ul className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((n, i) => (
            <Reveal key={n.id} delay={i * 0.06}>
              <li className="flex h-full list-none flex-col rounded-[2rem] bg-panel p-6 text-panel-ink shadow-pill ring-1 ring-white/10">
                <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{n.date}</p>
                <h3 className="display mt-2 text-3xl uppercase leading-none">{n.title}</h3>
                <p className="mt-3 text-sm text-panel-ink/80">{n.summary}</p>
                {n.tags && <ul className="mt-4 flex flex-wrap gap-1.5">{n.tags.map((t) => <li key={t} className="rounded-full border border-white/20 px-2.5 py-1 font-mono text-[11px]">{t}</li>)}</ul>}
                <div className="mt-auto pt-5">
                  {n.url ? (
                    <a href={n.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-bold text-card-ink">Read note <ArrowUpRight className="h-4 w-4" /></a>
                  ) : n.body ? (
                    <button type="button" onClick={() => setOpen(n)} className="inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-bold text-card-ink">Read note <ArrowUpRight className="h-4 w-4" /></button>
                  ) : null}
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </div>
      <Modal open={!!open} onClose={() => setOpen(null)} labelledBy="note-title">
        {open && (
          <article className="p-6 sm:p-9">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{open.date}</p>
            <h3 id="note-title" className="display mt-2 pr-12 text-4xl uppercase sm:text-5xl">{open.title}</h3>
            <div className="mt-5 space-y-4 text-[15px] leading-relaxed text-panel-ink/85">{open.body?.map((p, i) => <p key={i}>{p}</p>)}</div>
          </article>
        )}
      </Modal>
    </section>
  )
}
