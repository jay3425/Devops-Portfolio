import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { ExtrudeGeometry, Group, MathUtils, Path, Shape } from 'three'
import Scene3D from './Scene3D'
import { pointer, settleDrag, type DragState } from './webgl'

const EXTRUDE = { depth: 0.6, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.06, bevelSegments: 4, curveSegments: 32 }

function letterJ() {
  const s = new Shape()
  s.moveTo(0.5, 1.2); s.lineTo(0.95, 1.2); s.lineTo(0.95, -0.4)
  s.absarc(0, -0.4, 0.95, 0, -Math.PI, true)
  s.lineTo(-0.5, -0.4)
  s.absarc(0, -0.4, 0.5, -Math.PI, 0, false)
  s.closePath()
  return s
}

function letterD() {
  const s = new Shape()
  s.moveTo(0, -1.2); s.lineTo(0.6, -1.2)
  s.absarc(0.6, 0, 1.2, -Math.PI / 2, Math.PI / 2, false)
  s.lineTo(0, 1.2); s.closePath()
  const hole = new Path()
  hole.moveTo(0.4, -0.72); hole.lineTo(0.6, -0.72)
  hole.absarc(0.6, 0, 0.72, -Math.PI / 2, Math.PI / 2, false)
  hole.lineTo(0.4, 0.72); hole.closePath()
  s.holes.push(hole)
  return s
}

function Letters({ animate, drag }: { animate: boolean; drag: DragState }) {
  const root = useRef<Group>(null)
  const j = useMemo(() => new ExtrudeGeometry(letterJ(), EXTRUDE), [])
  const d = useMemo(() => new ExtrudeGeometry(letterD(), EXTRUDE), [])

  useFrame((state, dt) => {
    settleDrag(drag, dt)
    if (!root.current) return
    const t = animate ? state.clock.elapsedTime : 0
    root.current.rotation.y = MathUtils.damp(root.current.rotation.y, Math.sin(t * 0.5) * 0.5 + pointer.x * 0.5 + drag.x, 3, 0.016)
    root.current.rotation.x = MathUtils.damp(root.current.rotation.x, pointer.y * 0.2 + drag.y, 3, 0.016)
  })

  return (
    <group ref={root} position={[-1.05, 0, -0.3]}>
      <mesh geometry={j} position={[0, 0, 0]}><meshStandardMaterial color="#f4f4f1" roughness={0.35} metalness={0.25} /></mesh>
      <mesh geometry={d} position={[1.5, 0, 0]}><meshStandardMaterial color="#9d7bf8" emissive="#6d28d9" emissiveIntensity={0.35} roughness={0.35} metalness={0.25} /></mesh>
    </group>
  )
}

export default function Monogram({ className = '' }: { className?: string }) {
  return (
    <Scene3D interactive className={className} camera={[0, 0, 7.5]} fov={34} label="Decorative 3D JD monogram">
      {(animate, drag) => <Letters animate={animate} drag={drag} />}
    </Scene3D>
  )
}
