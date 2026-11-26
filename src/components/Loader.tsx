import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Loader() {
  const reduce = useReducedMotion()
  const [show, setShow] = useState(!reduce)

  useEffect(() => {
    if (reduce) return
    const t = window.setTimeout(() => setShow(false), 1300)
    return () => window.clearTimeout(t)
  }, [reduce])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status" aria-label="Loading portfolio"
          className="fixed inset-0 z-[100] grid place-items-center bg-[#0a0a0b] text-[#f4f4f1]"
          exit={{ y: '-100%', borderBottomLeftRadius: '50%', borderBottomRightRadius: '50%' }}
          transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="text-center">
            <motion.div
              className="display text-8xl sm:text-9xl"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
            >
              JD<span className="text-[#9d7bf8]">.</span>
            </motion.div>
            <div className="mx-auto mt-5 h-[3px] w-44 overflow-hidden rounded-full bg-white/15">
              <motion.div
                className="h-full rounded-full bg-[#f4f4f1]"
                initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1.1, ease: 'easeInOut' }}
              />
            </div>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.3em] text-white/50">Initializing portfolio</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
