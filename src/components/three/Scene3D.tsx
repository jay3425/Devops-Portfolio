import { Canvas, invalidate } from '@react-three/fiber'
import { useReducedMotion } from 'framer-motion'
import { Component, useEffect, useRef, useState, type PointerEvent as RPointerEvent, type ReactNode } from 'react'
import { useLite } from '../../lite-context'
import { beginDrag, endDrag, hasWebGL, moveDrag, newDrag, type DragState } from './webgl'

class Boundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  render() { return this.state.failed ? null : this.props.children }
}

function useIsDark() {
  const read = () => document.documentElement.getAttribute('data-theme') === 'dark'
  const [dark, setDark] = useState(read)
  useEffect(() => {
    const obs = new MutationObserver(() => setDark(read()))
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
    return () => obs.disconnect()
  }, [])
  return dark
}

/**
 * Decorative 3D canvas.
 * - Mounted only while near the viewport, so only one or two WebGL contexts are alive at a time.
 * - Renders nothing without WebGL. With reduced motion or Lite mode it draws still frames.
 * - `interactive` enables drag-to-rotate; scenes read the shared `drag` state.
 * - Lighting adapts to the light / dark theme.
 */
export default function Scene3D({
  children, className = '', camera = [0, 0, 7], fov = 35, label, interactive = false,
}: {
  children: (animate: boolean, drag: DragState) => ReactNode
  className?: string; camera?: [number, number, number]; fov?: number; label: string; interactive?: boolean
}) {
  const reduce = useReducedMotion()
  const { lite } = useLite()
  const dark = useIsDark()
  const ref = useRef<HTMLDivElement>(null)
  const [drag] = useState<DragState>(newDrag)
  const last = useRef<{ x: number; y: number } | null>(null)
  const [near, setNear] = useState(false)
  const [ready, setReady] = useState(false)
  const [ok] = useState(hasWebGL)
  const still = !!reduce || lite

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => { setNear(e.isIntersecting); if (!e.isIntersecting) setReady(false) }, { rootMargin: '200px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // No pointer capture: it would swallow the pointerup that three needs to register clicks on objects.
  function down(e: RPointerEvent) {
    if (!interactive) return
    last.current = { x: e.clientX, y: e.clientY }
    beginDrag(drag)
  }
  function move(e: RPointerEvent) {
    const l = last.current
    if (!interactive || !l) return
    moveDrag(drag, (e.clientX - l.x) * 0.012, (e.clientY - l.y) * 0.008)
    last.current = { x: e.clientX, y: e.clientY }
    if (still) invalidate()
  }
  function up() {
    last.current = null
    endDrag(drag)
    if (still) invalidate()
  }

  return (
    <div
      ref={ref} role="img" aria-label={label}
      className={`relative ${className} ${interactive ? 'cursor-grab touch-pan-y active:cursor-grabbing' : ''}`}
      onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up}
      style={interactive ? { pointerEvents: 'auto' } : undefined}
    >
      {ok && near && !ready && <div aria-hidden="true" className="skeleton pointer-events-none absolute inset-4 rounded-3xl" />}
      {ok && near && (
        <Boundary>
          <Canvas
            dpr={[1, lite ? 1 : 1.6]} camera={{ position: camera, fov }}
            gl={{ alpha: true, antialias: !lite, powerPreference: 'low-power' }}
            frameloop={still ? 'demand' : 'always'}
            onCreated={() => setReady(true)}
            style={{ pointerEvents: interactive ? 'auto' : 'none' }}
          >
            <ambientLight intensity={dark ? 0.48 : 0.6} />
            <directionalLight position={[4, 5, 5]} intensity={dark ? 2.1 : 2.4} />
            <pointLight position={[-4, -2, 3]} intensity={dark ? 42 : 28} color="#9d7bf8" />
            {children(!still, drag)}
          </Canvas>
        </Boundary>
      )}
    </div>
  )
}
