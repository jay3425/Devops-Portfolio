import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useMediaQuery } from '../hooks'

/**
 * Horizontal storytelling track.
 * - Large screens: the stage pins to the viewport and vertical scrolling slides the cards sideways.
 * - Phones and reduced motion: a normal swipeable row with snap points (nothing is hijacked).
 * `children` may be a render prop that receives 0→1 progress along the track.
 */
export default function HorizontalScroll({
  label, children, hint = 'Scroll →',
}: {
  label: string
  hint?: string
  children: ReactNode | ((progress: MotionValue<number>) => ReactNode)
}) {
  const reduce = useReducedMotion()
  const wide = useMediaQuery('(min-width: 1024px)')
  const pinned = wide && !reduce

  const outer = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLUListElement>(null)
  const [dist, setDist] = useState(0)
  const [vh, setVh] = useState(() => window.innerHeight)
  const swipe = useMotionValue(0)

  const { scrollYProgress } = useScroll({ target: outer, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist])
  const progress = pinned ? scrollYProgress : swipe

  useEffect(() => {
    const t = track.current
    const s = stage.current
    if (!t || !s) return
    const measure = () => { setDist(Math.max(0, t.scrollWidth - s.clientWidth)); setVh(window.innerHeight) }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(t); ro.observe(s)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [pinned])

  function onSwipe() {
    const s = stage.current
    if (!s) return
    const max = s.scrollWidth - s.clientWidth
    swipe.set(max > 0 ? s.scrollLeft / max : 0)
  }

  const content = typeof children === 'function' ? children(progress) : children

  return (
    <div ref={outer} style={pinned ? { height: dist + vh } : undefined} className="relative">
      <div
        ref={stage}
        onScroll={pinned ? undefined : onSwipe}
        tabIndex={pinned ? undefined : 0}
        role={pinned ? undefined : 'region'}
        aria-label={pinned ? undefined : `${label} (swipe sideways)`}
        className={pinned
          ? 'sticky top-0 flex h-screen flex-col justify-center overflow-hidden pb-6 pt-24'
          : 'no-scrollbar -mx-3 scroll-px-3 snap-x snap-mandatory sm:scroll-px-6 overflow-x-auto px-3 pb-4 sm:-mx-6 sm:px-6'}
      >
        <motion.ul
          ref={track} aria-label={label}
          style={pinned ? { x } : undefined}
          className={`flex w-max items-stretch gap-5 sm:gap-6 ${pinned ? 'px-[max(1.5rem,calc((100vw-72rem)/2))] will-change-transform' : ''}`}
        >
          {content}
        </motion.ul>
        <div className={`mt-5 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.2em] text-page-mute ${pinned ? 'mx-auto w-full max-w-6xl px-6' : 'px-1'}`} aria-hidden="true">
          <span className="h-[3px] flex-1 overflow-hidden rounded-full bg-black/10 dark:bg-white/15">
            <motion.span style={{ scaleX: progress }} className="block h-full origin-left bg-accent-strong" />
          </span>
          <span>{pinned ? hint : 'Swipe →'}</span>
        </div>
      </div>
    </div>
  )
}
