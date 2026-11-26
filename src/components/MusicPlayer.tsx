import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Music2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { createMusic, musicSupported, type Music } from '../audio/ambient'
import { site } from '../data/site'

const KEY = 'music-volume'

function savedVolume() {
  try {
    const v = Number(localStorage.getItem(KEY))
    if (v >= 0 && v <= 1 && localStorage.getItem(KEY) !== null) return v
  } catch { /* ignore */ }
  return 0.5
}

/**
 * Floating soundtrack control. Music is OFF until the visitor presses play (browsers require a gesture,
 * and surprise audio is rude). Pauses automatically when the tab is hidden.
 */
export default function MusicPlayer() {
  const reduce = useReducedMotion()
  const music = useRef<Music | null>(null)
  const [supported] = useState(() => !!site.music || musicSupported())
  const [on, setOn] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(false)
  const [volume, setVolume] = useState(savedVolume)
  const [open, setOpen] = useState(false)
  const resumeOnShow = useRef(false)

  function engine() {
    if (!music.current) music.current = createMusic(site.music)
    return music.current
  }

  async function toggle() {
    if (busy) return
    setBusy(true)
    setError(false)
    try {
      const m = engine()
      if (on) { await m.stop(); setOn(false) }
      else { m.setVolume(volume); await m.start(); setOn(true); setOpen(true) }
    } catch {
      setError(true)
      setOn(false)
    } finally {
      setBusy(false)
    }
  }

  function changeVolume(v: number) {
    setVolume(v)
    music.current?.setVolume(v)
    try { localStorage.setItem(KEY, String(v)) } catch { /* ignore */ }
  }

  useEffect(() => {
    const onVis = () => {
      const m = music.current
      if (!m) return
      if (document.hidden && m.playing) { resumeOnShow.current = true; void m.stop().then(() => setOn(false)) }
      else if (!document.hidden && resumeOnShow.current) { resumeOnShow.current = false; void m.start().then(() => setOn(true)).catch(() => {}) }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => { document.removeEventListener('visibilitychange', onVis); void music.current?.stop() }
  }, [])

  if (!supported) return null

  return (
    <div
      role="group" aria-label="Background music"
      className="fixed bottom-5 left-3 z-40 flex items-center gap-1 rounded-full bg-panel p-1.5 text-panel-ink shadow-pill ring-1 ring-white/15 sm:left-6"
      onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
    >
      <button
        type="button" onClick={toggle} aria-pressed={on} disabled={busy}
        aria-label={on ? 'Turn music off' : 'Turn music on'}
        title={on ? 'Music on. Click to turn off' : 'Music off. Click for a chill ambient soundtrack'}
        className={`relative grid h-11 w-11 place-items-center rounded-full transition active:scale-95 ${on ? 'bg-accent-strong text-white' : 'bg-card text-card-ink'}`}
      >
        {on ? (
          <span className="flex h-5 items-end gap-[3px]" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <motion.span
                key={i} className="w-[3px] rounded-full bg-current"
                animate={reduce ? { height: 10 } : { height: [6, 18, 9, 16, 6] }}
                transition={{ duration: 1.1 + i * 0.17, repeat: Infinity, ease: 'easeInOut' }}
              />
            ))}
          </span>
        ) : (
          <Music2 className="h-5 w-5" aria-hidden="true" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {(open || on) && (
          <motion.div
            initial={{ width: 0, opacity: 0 }} animate={{ width: 'auto', opacity: 1 }} exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22 }} className="overflow-hidden"
          >
            <div className="flex items-center gap-2 whitespace-nowrap pl-1 pr-3">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider" aria-live="polite">
                {error ? 'Audio blocked' : on ? 'Music on' : 'Music off'}
              </span>
              {on && (
                <>
                  <label htmlFor="music-volume" className="sr-only">Music volume</label>
                  <input
                    id="music-volume" type="range" min={0} max={1} step={0.05} value={volume}
                    onChange={(e) => changeVolume(Number(e.target.value))}
                    className="h-1.5 w-20 cursor-pointer accent-[#9d7bf8]"
                  />
                  <button type="button" onClick={toggle} aria-label="Turn music off" className="grid h-8 w-8 place-items-center rounded-full border border-white/25 transition hover:bg-white/10 active:scale-95">
                    <VolumeX className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
