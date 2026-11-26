import { navItems } from '../data/site'
import { useActiveSection } from '../hooks'

const ids = navItems.map((n) => n.id)

/** Slim dot rail on very wide screens showing where you are on the page. */
export default function SectionIndex() {
  const active = useActiveSection(ids)
  return (
    <nav aria-label="Page sections" className="fixed right-4 top-1/2 z-30 hidden -translate-y-1/2 xl:block 2xl:right-6">
      <ul className="flex flex-col items-end gap-3">
        {navItems.map((n) => {
          const on = active === n.id
          return (
            <li key={n.id}>
              <a href={`#${n.id}`} aria-label={n.label} aria-current={on ? 'true' : undefined} className="group flex items-center gap-2">
                <span className={`rounded-full bg-panel px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-panel-ink opacity-0 transition group-hover:opacity-100 group-focus-visible:opacity-100 ${on ? 'opacity-100' : ''}`}>{n.label}</span>
                <span className={`block rounded-full ring-1 ring-black/30 transition-all dark:ring-white/40 ${on ? 'h-3 w-3 bg-accent-strong' : 'h-2 w-2 bg-transparent group-hover:bg-accent'}`} />
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
