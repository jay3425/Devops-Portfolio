import { Quote } from 'lucide-react'
import { testimonials } from '../data/testimonials'
import { Reveal } from './ui'

/** Rendered only when src/data/testimonials.ts has real, permitted quotes. */
export default function Testimonials() {
  if (!testimonials.length) return null
  return (
    <section aria-label="Recommendations" className="px-3 py-10 sm:px-6">
      <ul className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
        {testimonials.map((t, i) => (
          <Reveal key={t.id} delay={i * 0.08}>
            <li className="list-none rounded-[2rem] bg-card p-6 text-card-ink shadow-pill sm:p-8">
              <Quote className="h-7 w-7 text-accent-strong" aria-hidden="true" />
              <blockquote className="mt-3 text-lg font-semibold leading-snug">“{t.quote}”</blockquote>
              <p className="mt-4 text-sm"><b>{t.name}</b> · <span className="text-card-mute">{t.role}, {t.org}</span></p>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  )
}
