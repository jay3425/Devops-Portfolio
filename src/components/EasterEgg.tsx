import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const PHRASE = 'sudohirejay'

/** Type "sudo hire jay" anywhere (or run it in the demo shell) for a small surprise. */
export default function EasterEgg() {
  const [show, setShow] = useState(false)
  const buffer = useRef('')

  useEffect(() => {
    const trigger = () => setShow(true)
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable)) return
      if (e.key.length !== 1 || e.key === ' ') return
      buffer.current = (buffer.current + e.key.toLowerCase()).slice(-PHRASE.length)
      if (buffer.current === PHRASE) { buffer.current = ''; trigger() }
    }
    window.addEventListener('keydown', onKey)
    window.addEventListener('easter-egg', trigger)
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('easter-egg', trigger) }
  }, [])

  useEffect(() => {
    if (!show) return
    const t = window.setTimeout(() => setShow(false), 8000)
    return () => window.clearTimeout(t)
  }, [show])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status" initial={{ opacity: 0, y: 30, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 left-1/2 z-[90] w-[min(92vw,26rem)] -translate-x-1/2 rounded-[1.75rem] bg-panel p-5 text-panel-ink shadow-pill ring-1 ring-white/15"
        >
          <p className="font-mono text-xs text-accent">$ sudo hire jay</p>
          <p className="mt-2 text-sm">Permission granted. <span className="text-panel-mute">(Just kidding — but I'd genuinely love to talk.)</span></p>
          <div className="mt-4 flex gap-2">
            <a href="#contact" onClick={() => setShow(false)} className="rounded-full bg-card px-5 py-2.5 text-sm font-bold text-card-ink">Go to Contact</a>
            <button type="button" onClick={() => setShow(false)} className="rounded-full border border-white/30 px-5 py-2.5 text-sm font-bold">Dismiss</button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
