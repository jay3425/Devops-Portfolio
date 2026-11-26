import { MotionConfig } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import About from './components/About'
import CommandPalette, { type PaletteItem } from './components/CommandPalette'
import CursorRing from './components/CursorRing'
import EasterEgg from './components/EasterEgg'
import Certificates from './components/Certificates'
import Contact from './components/Contact'
import Experience from './components/Experience'
import Footer from './components/Footer'
import Hero from './components/Hero'
import MusicPlayer from './components/MusicPlayer'
import SectionIndex from './components/SectionIndex'
import Loader from './components/Loader'
import Navbar from './components/Navbar'
import Notes from './components/Notes'
import SectionDivider from './components/SectionDivider'
import Testimonials from './components/Testimonials'
import Projects from './components/Projects'
import TechStack from './components/TechStack'
import LiteProvider from './LiteProvider'
import { projects } from './data/projects'
import { navItems, site } from './data/site'
import { useLite } from './lite-context'
import { useScrolled, useTheme } from './hooks'

function Shell() {
  const { theme, toggle } = useTheme()
  const [projectId, setProjectId] = useState<string | null>(null)
  const closeProject = useCallback(() => setProjectId(null), [])
  const showTop = useScrolled(700)
  const { toggle: toggleLite } = useLite()
  const [paletteOpen, setPaletteOpen] = useState(false)
  const openPalette = useCallback(() => setPaletteOpen(true), [])
  const closePalette = useCallback(() => setPaletteOpen(false), [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPaletteOpen((o) => !o) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const items = useMemo<PaletteItem[]>(() => {
    const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
    const list: PaletteItem[] = [
      ...navItems.map((n) => ({ id: `go-${n.id}`, label: `Go to ${n.label}`, hint: 'section', run: () => go(n.id) })),
      ...projects.map((p) => ({ id: `proj-${p.id}`, label: `Open case study: ${p.title}`, hint: 'project', run: () => setProjectId(p.id) })),
      { id: 'copy-email', label: 'Copy email address', hint: site.email, run: () => { navigator.clipboard?.writeText(site.email).catch(() => {}) } },
      { id: 'mail', label: 'Send an email', hint: 'opens your mail app', run: () => { window.location.href = `mailto:${site.email}` } },
      { id: 'theme', label: 'Toggle light / dark theme', hint: 'appearance', run: toggle },
      { id: 'lite', label: 'Toggle 3D animation (lite mode)', hint: 'performance', run: toggleLite },
    ]
    if (site.github) list.push({ id: 'gh', label: 'Open GitHub profile', hint: 'external', run: () => window.open(site.github, '_blank', 'noopener') })
    if (site.linkedin) list.push({ id: 'li', label: 'Open LinkedIn profile', hint: 'external', run: () => window.open(site.linkedin, '_blank', 'noopener') })
    if (site.resume) list.push({ id: 'resume', label: 'Open printable resume', hint: 'page', run: () => window.open(site.resume, '_blank', 'noopener') })
    return list
  }, [toggle, toggleLite])

  return (
    <MotionConfig reducedMotion="user">
      <Loader />
      <a href="#about" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-panel focus:px-5 focus:py-3 focus:text-panel-ink">
        Skip to content
      </a>
      <Navbar theme={theme} onToggleTheme={toggle} onOpenPalette={openPalette} />
      <CursorRing />
      <MusicPlayer />
      <SectionIndex />
      <EasterEgg />
      <CommandPalette open={paletteOpen} onClose={closePalette} items={items} />
      <main>
        <Hero onOpenProject={setProjectId} onToggleTheme={toggle} />
        <About />
        <SectionDivider />
        <Projects activeId={projectId} onOpen={setProjectId} onClose={closeProject} />
        <Experience />
        <SectionDivider />
        <TechStack />
        <Certificates />
        <Notes />
        <Testimonials />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
      <a
        href="#home" aria-label="Back to top"
        className={`fixed bottom-5 right-5 z-40 grid h-12 w-12 place-items-center rounded-full bg-panel text-panel-ink shadow-pill ring-1 ring-white/20 transition-all duration-300 ${showTop ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-4 opacity-0'}`}
        tabIndex={showTop ? 0 : -1}
      >
        <ArrowUp className="h-5 w-5" />
      </a>
    </MotionConfig>
  )
}

export default function App() {
  return (
    <LiteProvider>
      <Shell />
    </LiteProvider>
  )
}
