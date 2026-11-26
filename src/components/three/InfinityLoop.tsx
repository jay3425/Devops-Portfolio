import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Curve, Group, MathUtils, TubeGeometry, Vector3 } from 'three'
import Scene3D from './Scene3D'
import { pointer, settleDrag, type DragState } from './webgl'

class Lemniscate extends Curve<Vector3> {
  constructor() { super() }
  getPoint(t: number, target = new Vector3()) {
    const a = Math.PI * 2 * t
    const d = 1 + Math.sin(a) ** 2
    return target.set((3.4 * Math.cos(a)) / d, (3.4 * Math.sin(a) * Math.cos(a)) / d, 0.7 * Math.sin(a))
  }
}

const BEADS = 8

function Loop({ animate, drag }: { animate: boolean; drag: DragState }) {
  const curve = useMemo(() => new Lemniscate(), [])
  const tube = useMemo(() => new TubeGeometry(curve, 320, 0.17, 18, true), [curve])
  const root = useRef<Group>(null)
  const beads = useRef<Group>(null)

  useFrame((state, dt) => {
    settleDrag(drag, dt)
    const t = animate ? state.clock.elapsedTime : 0
    if (root.current) {
      root.current.rotation.y = MathUtils.damp(root.current.rotation.y, Math.sin(t * 0.3) * 0.35 + pointer.x * 0.4 + drag.x, 3, dt)
      root.current.rotation.x = MathUtils.damp(root.current.rotation.x, 0.15 + pointer.y * 0.15 + drag.y, 3, dt)
    }
    beads.current?.children.forEach((b, i) => {
      curve.getPoint((i / BEADS + t * 0.06) % 1, b.position)
    })
  })

  return (
    <group ref={root}>
      <mesh geometry={tube}>
        <meshStandardMaterial color="#e8e8e4" roughness={0.3} metalness={0.55} />
      </mesh>
      <group ref={beads}>
        {Array.from({ length: BEADS }, (_, i) => (
          <mesh key={i} scale={i % 4 === 0 ? 1.5 : 1}>
            <sphereGeometry args={[0.24, 24, 24]} />
            <meshStandardMaterial color="#9d7bf8" emissive="#6d28d9" emissiveIntensity={0.9} roughness={0.35} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

export default function InfinityLoop({ className = '' }: { className?: string }) {
  return (
    <Scene3D className={className} camera={[0, 0, 10]} fov={34} interactive label="Decorative 3D infinity loop representing the continuous DevOps lifecycle. Drag to rotate.">
      {(animate, drag) => <Loop animate={animate} drag={drag} />}
    </Scene3D>
  )
}
