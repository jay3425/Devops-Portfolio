import { ArrowUp } from 'lucide-react'
import { lazy, Suspense } from 'react'
import { site } from '../data/site'
import { Reveal } from './ui'

const Monogram = lazy(() => import('./three/Monogram'))

const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="relative px-3 pb-8 pt-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <Reveal className="relative mx-auto mb-10 max-w-xl overflow-hidden rounded-[2.5rem] bg-panel text-panel-ink ring-1 ring-white/10">
          <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative h-60 sm:h-72">
            <Suspense fallback={null}><Monogram className="h-full w-full" /></Suspense>
          </div>
        </Reveal>
        <Reveal className="relative">
          <a
            href="#home" aria-label="Back to top"
            className="absolute -top-8 left-1/2 z-10 grid h-16 w-16 -translate-x-1/2 place-items-center rounded-full bg-card text-card-ink shadow-pill ring-4 ring-[var(--page)] transition hover:-translate-y-1 active:scale-95"
          >
            <ArrowUp className="h-6 w-6" />
          </a>
          <div className="rounded-full bg-panel p-2.5 text-panel-ink shadow-pill ring-1 ring-white/10">
            <div className="flex flex-col items-center justify-between gap-1 rounded-full border-2 border-white/80 px-6 py-5 font-mono text-[11px] uppercase tracking-[0.25em] sm:flex-row sm:px-10 sm:text-xs">
              <span>{site.status}</span>
              <span className="text-panel-mute">© {YEAR} {site.name}</span>
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  )
}
