/** Normalised pointer position (-1..1), shared by all scenes. */
export const pointer = { x: 0, y: 0 }
if (typeof window !== 'undefined') {
  window.addEventListener('pointermove', (e) => {
    pointer.x = (e.clientX / window.innerWidth) * 2 - 1
    pointer.y = (e.clientY / window.innerHeight) * 2 - 1
  }, { passive: true })
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch { return false }
}

/**
 * Drag rotation (radians) shared between a canvas and its scene.
 * While the pointer is down `active` is true and x/y follow it; on release the rotation
 * keeps a little inertia (vx/vy) and eases back to rest.
 */
export interface DragState { x: number; y: number; vx: number; vy: number; active: boolean }

export const newDrag = (): DragState => ({ x: 0, y: 0, vx: 0, vy: 0, active: false })

/** Call once per frame from the scene. */
export function settleDrag(d: DragState, dt: number) {
  if (d.active) return
  d.x += d.vx * dt
  d.y += d.vy * dt
  const friction = Math.exp(-4 * dt)
  d.vx *= friction
  d.vy *= friction
  const back = Math.exp(-0.9 * dt)
  d.x *= back
  d.y *= back
}

export function beginDrag(d: DragState) { d.active = true }
export function moveDrag(d: DragState, dx: number, dy: number) {
  d.x += dx
  d.y = Math.max(-0.7, Math.min(0.7, d.y + dy))
  d.vx = dx * 60
  d.vy = dy * 60
}
export function endDrag(d: DragState) { d.active = false }
