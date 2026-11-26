import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { Group, MathUtils, type MeshStandardMaterial } from 'three'
import Scene3D from './Scene3D'
import { pointer, settleDrag, type DragState } from './webgl'

const SLOTS = 9

function Rack({ animate, drag }: { animate: boolean; drag: DragState }) {
  const root = useRef<Group>(null)
  const leds = useRef<(MeshStandardMaterial | null)[]>([])

  useFrame((state, dt) => {
    settleDrag(drag, dt)
    const t = animate ? state.clock.elapsedTime : 0
    if (root.current) {
      root.current.rotation.y = MathUtils.damp(root.current.rotation.y, -0.5 + Math.sin(t * 0.3) * 0.2 + pointer.x * 0.4 + drag.x, 3, 0.016)
    }
    leds.current.forEach((m, i) => {
      if (!m) return
      const on = animate ? Math.sin(t * (1.4 + (i % 4) * 0.7) + i * 1.9) > 0.1 : i % 3 !== 0
      m.emissiveIntensity = on ? 1.6 : 0.1
    })
  })

  return (
    <group ref={root}>
      <mesh>
        <boxGeometry args={[2.2, 4, 1.7]} />
        <meshStandardMaterial color="#26262c" roughness={0.5} metalness={0.5} />
      </mesh>
      {Array.from({ length: SLOTS }, (_, i) => {
        const y = 1.55 - i * 0.39
        return (
          <group key={i} position={[0, y, 0.86]}>
            <mesh><boxGeometry args={[1.95, 0.3, 0.06]} /><meshStandardMaterial color="#4a4a54" roughness={0.45} metalness={0.5} /></mesh>
            {[0, 1, 2].map((j) => (
              <mesh key={j} position={[-0.7 + j * 0.2, 0, 0.05]}>
                <boxGeometry args={[0.09, 0.09, 0.04]} />
                <meshStandardMaterial
                  ref={(m) => { leds.current[i * 3 + j] = m }}
                  color={(i + j) % 3 === 0 ? '#9d7bf8' : '#f4f4f1'} emissive={(i + j) % 3 === 0 ? '#9d7bf8' : '#f4f4f1'} emissiveIntensity={1}
                />
              </mesh>
            ))}
            <mesh position={[0.45, 0, 0.04]}><boxGeometry args={[0.9, 0.06, 0.03]} /><meshStandardMaterial color="#14141a" /></mesh>
          </group>
        )
      })}
    </group>
  )
}

export default function ServerRack({ className = '' }: { className?: string }) {
  return (
    <Scene3D interactive className={className} camera={[0, 0.2, 9]} fov={34} label="Decorative 3D server rack with blinking lights">
      {(animate, drag) => <Rack animate={animate} drag={drag} />}
    </Scene3D>
  )
}
