import { AnimatePresence, motion, useScroll } from 'framer-motion'
import { Box, BoxSelect, Menu, Moon, Search, Sun, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useLite } from '../lite-context'
import { navItems, site } from '../data/site'
import { useActiveSection, useScrolled, type Theme } from '../hooks'

const ids = navItems.map((n) => n.id)

export default function Navbar({ theme, onToggleTheme, onOpenPalette }: { theme: Theme; onToggleTheme: () => void; onOpenPalette: () => void }) {
  const active = useActiveSection(ids)
  const scrolled = useScrolled(40)
  const [open, setOpen] = useState(false)
  const { lite, toggle: toggleLite } = useLite()
  const { scrollYProgress } = useScroll()

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6">
      <div className={`mx-auto flex max-w-6xl items-center gap-2 transition-all duration-300 sm:gap-3 ${scrolled ? 'lg:max-w-5xl' : ''}`}>
        <nav
          aria-label="Primary"
          className={`relative flex min-w-0 flex-1 items-center rounded-full bg-panel px-2 text-panel-ink shadow-pill ring-1 ring-white/10 transition-all duration-300 ${scrolled ? 'py-1' : 'py-2'}`}
        >
          {/* Desktop links */}
          <ul className="hidden w-full items-center justify-between lg:flex">
            {navItems.map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id} className="relative">
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`relative block whitespace-nowrap rounded-full px-2.5 py-2 text-sm transition-colors xl:px-3 2xl:px-4 ${isActive ? 'font-bold text-white' : 'text-panel-ink/70 hover:text-white'}`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="nav-pill" aria-hidden="true"
                        className="absolute inset-0 -z-10 rounded-full bg-white/12"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                    {item.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline" aria-hidden="true"
                        className="absolute inset-x-5 bottom-1 h-[2px] rounded-full bg-accent"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                  </a>
                </li>
              )
            })}
          </ul>

          <motion.span
            aria-hidden="true" style={{ scaleX: scrollYProgress }}
            className="absolute inset-x-8 bottom-[3px] h-[2px] origin-left rounded-full bg-accent/80"
          />

          {/* Mobile bar */}
          <div className="flex w-full items-center justify-between lg:hidden">
            <span className="px-3 font-mono text-xs uppercase tracking-[0.2em] text-panel-ink/70">
              {navItems.find((n) => n.id === active)?.label}
            </span>
            <button
              type="button" onClick={() => setOpen((o) => !o)}
              aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}
              className="grid h-10 w-10 place-items-center rounded-full bg-card text-card-ink transition active:scale-95"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        <button
          type="button" onClick={onOpenPalette} aria-label="Search and commands (Ctrl K)" title="Search and commands (Ctrl K)"
          className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-2 rounded-full bg-panel px-0 2xl:px-3.5 text-panel-ink shadow-pill ring-1 ring-white/10 transition hover:scale-105 active:scale-95"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
          <span className="hidden font-mono text-[11px] text-panel-mute 2xl:inline">Ctrl K</span>
        </button>

        <button
          type="button" onClick={toggleLite} aria-label="3D effects" aria-pressed={!lite}
          title={lite ? 'Lite mode: 3D figures are still frames. Click to animate.' : 'Turn 3D animation off (lite mode)'}
          className="inline-flex h-11 min-w-11 shrink-0 items-center justify-center gap-1.5 rounded-full bg-panel px-0 sm:px-3 text-panel-ink shadow-pill ring-1 ring-white/10 transition hover:scale-105 active:scale-95"
        >
          {lite ? <BoxSelect className="h-5 w-5 opacity-70" aria-hidden="true" /> : <Box className="h-5 w-5" aria-hidden="true" />}
          <span className="hidden font-mono text-[11px] font-bold sm:inline">{lite ? 'LITE' : '3D'}</span>
        </button>

        <button
          type="button" onClick={onToggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-panel text-panel-ink shadow-pill ring-1 ring-white/10 transition hover:scale-105 active:scale-95"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={theme}
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </motion.span>
          </AnimatePresence>
        </button>

        <a
          href="#home" aria-label={`${site.name} — back to top`}
          className="hidden shrink-0 sm:flex items-center gap-2 rounded-full bg-panel py-1.5 pl-1.5 pr-2 text-panel-ink shadow-pill ring-1 ring-white/10 transition hover:scale-[1.03] sm:pr-5"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-card font-display text-lg leading-none tracking-wide text-card-ink">
            {site.initials}
          </span>
          <span className={`hidden text-sm font-bold sm:inline ${scrolled ? 'lg:hidden xl:inline' : ''}`}>{site.name}</span>
        </a>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="mx-auto mt-2 max-w-6xl rounded-[2rem] bg-panel p-3 text-panel-ink shadow-pill ring-1 ring-white/10 lg:hidden"
          >
            <ul className="grid gap-1">
              {navItems.map((item, i) => (
                <motion.li
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                >
                  <a
                    href={`#${item.id}`} onClick={() => setOpen(false)}
                    aria-current={active === item.id ? 'true' : undefined}
                    className={`flex items-center justify-between rounded-full px-5 py-3 text-base ${active === item.id ? 'bg-card font-bold text-card-ink' : 'hover:bg-white/10'}`}
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-xs opacity-60">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
