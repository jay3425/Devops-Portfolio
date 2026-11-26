import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Group, MathUtils } from 'three'
import Scene3D from './Scene3D'
import { pointer, settleDrag, type DragState } from './webgl'

const ribs = Array.from({ length: 9 }, (_, i) => -1.05 + i * 0.263)

function Container({ position, color, accent = false, onPick }: { position: [number, number, number]; color: string; accent?: boolean; onPick: () => void }) {
  return (
    <group
      position={position}
      onClick={(e) => { if (e.delta > 4) return; e.stopPropagation(); onPick() }}
      onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { document.body.style.cursor = '' }}
    >
      <mesh>
        <boxGeometry args={[2.4, 0.98, 0.98]} />
        <meshStandardMaterial color={color} roughness={0.55} metalness={0.35} emissive={accent ? '#6d28d9' : '#000000'} emissiveIntensity={accent ? 0.35 : 0} />
      </mesh>
      {[0.5, -0.5].map((z) => ribs.map((x) => (
        <mesh key={`${z}-${x}`} position={[x, 0, z]}>
          <boxGeometry args={[0.07, 0.9, 0.04]} />
          <meshStandardMaterial color={accent ? '#b8a3fb' : '#7a7a86'} roughness={0.6} metalness={0.4} />
        </mesh>
      )))}
      <mesh position={[1.21, 0, 0]}><boxGeometry args={[0.03, 0.9, 0.9]} /><meshStandardMaterial color="#f4f4f1" roughness={0.7} /></mesh>
    </group>
  )
}

const notes: Record<string, string> = {
  Docker: 'Package apps as containers', Kubernetes: 'Run and scale containers', Terraform: 'Infrastructure as Code',
  AWS: 'Cloud platform', Linux: 'Operating system and scripting', Jenkins: 'CI/CD automation',
}

const layout: { p: [number, number, number]; c: string; name: string }[] = [
  { p: [-2.5, -1.05, 0], c: '#4a4a54', name: 'Linux' }, { p: [0, -1.05, 0], c: '#555560', name: 'Docker' }, { p: [2.5, -1.05, 0], c: '#3d3d46', name: 'AWS' },
  { p: [-1.25, 0, 0], c: '#3d3d46', name: 'Jenkins' }, { p: [1.25, 0, 0], c: '#4a4a54', name: 'Kubernetes' },
  { p: [0, 1.05, 0], c: '#4a4a54', name: 'Terraform' },
]

function Stack({ animate, drag, picked, onPick }: { animate: boolean; drag: DragState; picked: number | null; onPick: (i: number) => void }) {
  const g = useRef<Group>(null)
  useFrame((state, dt) => {
    if (!g.current) return
    settleDrag(drag, dt)
    const t = animate ? state.clock.elapsedTime : 0
    const ty = 0.5 + Math.sin(t * 0.35) * 0.4 + pointer.x * 0.4 + drag.x
    const tx = -0.1 + pointer.y * 0.12 + drag.y
    g.current.rotation.y = MathUtils.damp(g.current.rotation.y, ty, 3, dt)
    g.current.rotation.x = MathUtils.damp(g.current.rotation.x, tx, 3, dt)
    g.current.position.y = animate ? Math.sin(t * 0.8) * 0.1 : 0
  })
  return (
    <group ref={g} scale={0.95}>
      {layout.map((l, i) => <Container key={i} position={l.p} color={i === picked ? '#5b3fc4' : l.c} accent={i === picked} onPick={() => onPick(i)} />)}
    </group>
  )
}

export default function ContainerStack({ className = '' }: { className?: string }) {
  const [picked, setPicked] = useState<number | null>(null)
  const tool = picked === null ? null : { name: layout[picked].name, note: notes[layout[picked].name] }
  return (
    <div className={`relative ${className}`}>
      <Scene3D interactive className="h-full w-full" camera={[0, 0.6, 8.6]} fov={34} label="Decorative 3D pyramid of shipping containers. Drag to rotate, click a container to see a tool.">
        {(animate, drag) => <Stack animate={animate} drag={drag} picked={picked} onPick={setPicked} />}
      </Scene3D>
      <p className="pointer-events-none absolute bottom-1 left-1 font-mono text-[11px] text-white/55" aria-live="polite">
        {tool ? <span className="rounded-full bg-white/15 px-3 py-1 text-white"><b>{tool.name}</b> · {tool.note}</span> : 'Drag to rotate · click a container'}
      </p>
    </div>
  )
}
