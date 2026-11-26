import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'
import { useState, type PointerEvent, type ReactNode } from 'react'

/** Nudges its child toward the pointer on desktop. No effect on touch or with reduced motion. */
export default function Magnetic({ children, strength = 0.25, className = '' }: { children: ReactNode; strength?: number; className?: string }) {
  const reduce = useReducedMotion()
  const [enabled] = useState(() => window.matchMedia('(hover: hover) and (pointer: fine)').matches)
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 })
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 })

  function move(e: PointerEvent<HTMLDivElement>) {
    if (!enabled || reduce) return
    const r = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - (r.left + r.width / 2)) * strength)
    y.set((e.clientY - (r.top + r.height / 2)) * strength)
  }
  function leave() { x.set(0); y.set(0) }

  return (
    <motion.div style={{ x, y }} onPointerMove={move} onPointerLeave={leave} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  )
}
