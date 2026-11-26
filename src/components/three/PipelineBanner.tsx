import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import { Group, Mesh } from 'three'
import Scene3D from './Scene3D'

function Pipeline({ animate, count }: { animate: boolean; count: number }) {
  const STAGES = count
  const { viewport } = useThree()
  const w = viewport.width
  const size = Math.min(viewport.height * 0.34, (w / STAGES) * 0.32)
  const xs = Array.from({ length: STAGES }, (_, i) => ((i + 0.5) / STAGES) * w - w / 2)
  const blocks = useRef<Group>(null)
  const packet = useRef<Mesh>(null)
  const y = viewport.height * 0.08

  useFrame((state) => {
    const t = animate ? state.clock.elapsedTime : 1.2
    const p = (t * 0.22) % 1
    const x = xs[0] + p * (xs[STAGES - 1] - xs[0])
    if (packet.current) packet.current.position.set(x, y, size * 0.2)
    blocks.current?.children.forEach((b, i) => {
      const near = Math.max(0, 1 - Math.abs(x - xs[i]) / (w / STAGES / 1.6))
      b.scale.setScalar(1 + near * 0.18)
      b.position.y = y + near * size * 0.12
      b.rotation.y = animate ? Math.sin(t * 0.6 + i) * 0.35 : 0.3
    })
  })

  return (
    <group>
      <mesh position={[0, y, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[size * 0.05, size * 0.05, xs[STAGES - 1] - xs[0], 16]} />
        <meshStandardMaterial color="#8a8a96" metalness={0.5} roughness={0.4} />
      </mesh>
      <group ref={blocks}>
        {xs.map((x, i) => (
          <mesh key={i} position={[x, y, 0]}>
            <boxGeometry args={[size, size, size]} />
            <meshStandardMaterial
              color={i === STAGES - 1 ? '#7c5cf0' : '#e8e8e4'} roughness={0.4} metalness={0.25}
              emissive={i === STAGES - 1 ? '#6d28d9' : '#000000'} emissiveIntensity={i === STAGES - 1 ? 0.5 : 0}
            />
          </mesh>
        ))}
      </group>
      <mesh ref={packet}>
        <sphereGeometry args={[size * 0.17, 24, 24]} />
        <meshStandardMaterial color="#9d7bf8" emissive="#9d7bf8" emissiveIntensity={1.2} />
      </mesh>
    </group>
  )
}

export default function PipelineBanner({ stages, className = '' }: { stages: number; className?: string }) {
  return (
    <Scene3D className={className} camera={[0, 0, 14]} fov={18} label="Decorative 3D pipeline: a packet travelling through four stages">
      {(animate) => <Pipeline animate={animate} count={stages} />}
    </Scene3D>
  )
}
