import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { useRef } from 'react'

/** Hairlines that draw in from the centre while an orbiting circle turns with the scroll. Decorative. */
export default function SectionDivider() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const grow = useTransform(scrollYProgress, [0.15, 0.5], [0, 1])
  const spin = useTransform(scrollYProgress, [0, 1], [-200, 200])
  return (
    <div ref={ref} aria-hidden="true" className="mx-auto flex max-w-6xl items-center gap-4 px-3 py-4 sm:px-6">
      <motion.span style={{ scaleX: reduce ? 1 : grow }} className="h-[3px] flex-1 origin-right rounded-full bg-line" />
      <motion.span style={{ rotate: reduce ? 0 : spin }} className="grid h-12 w-12 place-items-center rounded-full bg-panel text-panel-ink shadow-pill ring-1 ring-white/10">
        <ArrowDown className="h-5 w-5" />
      </motion.span>
      <motion.span style={{ scaleX: reduce ? 1 : grow }} className="h-[3px] flex-1 origin-left rounded-full bg-line" />
    </div>
  )
}
