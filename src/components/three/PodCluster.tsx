import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Group, MathUtils } from 'three'
import Scene3D from './Scene3D'
import { pointer } from './webgl'

function Cluster({ animate, count, active }: { animate: boolean; count: number; active: number }) {
  const ring = useRef<Group>(null)
  const pods = useMemo(
    () => Array.from({ length: count }, (_, i) => {
      const a = (i / count) * Math.PI * 2
      return { x: Math.cos(a) * 1.9, z: Math.sin(a) * 1.9, y: Math.sin(a * 2) * 0.15 }
    }),
    [count],
  )
  useFrame((state) => {
    if (!ring.current) return
    const t = animate ? state.clock.elapsedTime : 0
    ring.current.rotation.y = t * 0.25 + pointer.x * 0.3
    ring.current.rotation.x = MathUtils.damp(ring.current.rotation.x, 0.45 + pointer.y * 0.1, 3, 0.016)
  })
  return (
    <group ref={ring}>
      {/* control plane */}
      <mesh>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
        <meshStandardMaterial color="#f4f4f1" roughness={0.45} metalness={0.2} />
      </mesh>
      <mesh scale={1.04}>
        <boxGeometry args={[0.95, 0.95, 0.95]} />
        <meshBasicMaterial color="#9d7bf8" wireframe transparent opacity={0.6} />
      </mesh>
      {pods.map((p, i) => {
        const on = active === i
        return (
          <mesh key={i} position={[p.x, p.y + (on ? 0.18 : 0), p.z]} scale={on ? 1.25 : 1}>
            <boxGeometry args={[0.42, 0.42, 0.42]} />
            <meshStandardMaterial color={on ? '#9d7bf8' : '#6a6a75'} emissive={on ? '#6d28d9' : '#000'} emissiveIntensity={on ? 0.6 : 0} roughness={0.5} metalness={0.3} />
          </mesh>
        )
      })}
    </group>
  )
}

/** `active` highlights one pod (-1 for none). `count` pods orbit the control plane. */
export default function PodCluster({ count, active, className = '' }: { count: number; active: number; className?: string }) {
  return (
    <Scene3D className={className} camera={[0, 1.2, 6.8]} fov={36} label="Decorative 3D cluster of pods orbiting a central control plane">
      {(animate) => <Cluster animate={animate} count={count} active={active} />}
    </Scene3D>
  )
}
