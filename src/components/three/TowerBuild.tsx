import { useFrame } from '@react-three/fiber'
import type { MotionValue } from 'framer-motion'
import { useRef } from 'react'
import { Group, MathUtils } from 'three'
import Scene3D from './Scene3D'
import { pointer } from './webgl'

const LAYERS = 12
const H = 0.26

function Tower({ animate, progress }: { animate: boolean; progress: MotionValue<number> }) {
  const root = useRef<Group>(null)
  const layers = useRef<Group>(null)

  useFrame((state) => {
    const t = animate ? state.clock.elapsedTime : 0
    const p = animate ? MathUtils.clamp(progress.get(), 0, 1) : 1
    const shown = p * LAYERS
    if (root.current) root.current.rotation.y = t * 0.25 + pointer.x * 0.4
    layers.current?.children.forEach((l, i) => {
      const target = MathUtils.clamp(shown - i, 0, 1)
      l.scale.y = MathUtils.damp(l.scale.y, Math.max(target, 0.0001), 6, 0.016)
      l.position.y = i * (H + 0.03) - 1.7 + (1 - l.scale.y) * 0.4
    })
  })

  return (
    <group ref={root} rotation={[0.12, 0, 0]}>
      <mesh position={[0, -1.95, 0]}>
        <boxGeometry args={[3.2, 0.1, 3.2]} />
        <meshStandardMaterial color="#3a3a42" metalness={0.4} roughness={0.5} />
      </mesh>
      <mesh position={[0, -1.89, 0]}>
        <boxGeometry args={[3.2, 0.02, 3.2]} />
        <meshBasicMaterial color="#9d7bf8" wireframe />
      </mesh>
      <group ref={layers}>
        {Array.from({ length: LAYERS }, (_, i) => {
          const w = 2.1 - i * 0.075
          const top = i === LAYERS - 1
          return (
            <mesh key={i}>
              <boxGeometry args={[w, H, w]} />
              <meshStandardMaterial
                color={top ? '#7c5cf0' : i % 2 ? '#e8e8e4' : '#6a6a75'} roughness={0.45} metalness={0.3}
                emissive={top ? '#6d28d9' : '#000000'} emissiveIntensity={top ? 0.6 : 0}
              />
            </mesh>
          )
        })}
      </group>
    </group>
  )
}

/** A tower that assembles layer by layer as `progress` (0..1) advances. */
export default function TowerBuild({ progress, className = '' }: { progress: MotionValue<number>; className?: string }) {
  return (
    <Scene3D className={className} camera={[0, 0.3, 8.5]} fov={34} label="Decorative 3D tower that builds up as you scroll the timeline">
      {(animate) => <Tower animate={animate} progress={progress} />}
    </Scene3D>
  )
}
