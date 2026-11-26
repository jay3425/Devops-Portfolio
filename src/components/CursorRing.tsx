import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'

const HOT = 'a, button, [role="button"], [role="tab"], input, textarea, select, summary, [tabindex]:not([tabindex="-1"])'

/** Desktop-only trailing ring. The native cursor stays visible; hidden on touch and with reduced motion. */
export default function CursorRing() {
  const reduce = useReducedMotion()
  const [enabled] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })
  const [hot, setHot] = useState(false)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    if (!enabled || reduce) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY); setShown(true)
      setHot(!!(e.target as Element | null)?.closest?.(HOT))
    }
    const leave = () => setShown(false)
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', leave)
    return () => { window.removeEventListener('pointermove', move); document.documentElement.removeEventListener('pointerleave', leave) }
  }, [enabled, reduce, x, y])

  if (!enabled || reduce) return null
  return (
    <motion.div
      aria-hidden="true"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      animate={{ scale: hot ? 1.6 : 0.4, opacity: shown && hot ? 1 : 0 }}
      transition={{ duration: 0.18 }}
      className="pointer-events-none fixed left-0 top-0 z-[150] h-8 w-8 rounded-full border-2 border-accent mix-blend-difference"
    />
  )
}
