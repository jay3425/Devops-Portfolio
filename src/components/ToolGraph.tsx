import { useMemo, useState } from 'react'

interface N { id: string; label: string; x: number; y: number }
interface E { from: string; to: string; label: string }

const W = 900
const H = 340
const NW = 128
const NH = 44

const nodes: N[] = [
  { id: 'github', label: 'GitHub', x: 80, y: 50 },
  { id: 'jenkins', label: 'Jenkins', x: 270, y: 50 },
  { id: 'docker', label: 'Docker', x: 470, y: 50 },
  { id: 'trivy', label: 'Trivy', x: 670, y: 50 },
  { id: 'sonar', label: 'SonarQube', x: 270, y: 170 },
  { id: 'eks', label: 'Amazon EKS', x: 470, y: 170 },
  { id: 'prom', label: 'Prometheus', x: 670, y: 170 },
  { id: 'grafana', label: 'Grafana', x: 830, y: 170 },
  { id: 'tf', label: 'Terraform', x: 80, y: 290 },
  { id: 'aws', label: 'AWS', x: 470, y: 290 },
]
const edges: E[] = [
  { from: 'github', to: 'jenkins', label: 'triggers' },
  { from: 'jenkins', to: 'docker', label: 'builds' },
  { from: 'docker', to: 'trivy', label: 'scanned by' },
  { from: 'jenkins', to: 'sonar', label: 'analyses with' },
  { from: 'docker', to: 'eks', label: 'deployed to' },
  { from: 'prom', to: 'eks', label: 'monitors' },
  { from: 'grafana', to: 'prom', label: 'visualises' },
  { from: 'tf', to: 'aws', label: 'provisions' },
  { from: 'aws', to: 'eks', label: 'hosts' },
]

const byId = Object.fromEntries(nodes.map((n) => [n.id, n]))

function edgePath(a: N, b: N) {
  const dx = b.x - a.x
  const dy = b.y - a.y
  // connect box edges, not centres
  if (Math.abs(dx) >= Math.abs(dy)) {
    const sx = a.x + Math.sign(dx) * (NW / 2)
    const ex = b.x - Math.sign(dx) * (NW / 2)
    return { d: `M${sx},${a.y} L${ex},${b.y}`, mx: (sx + ex) / 2, my: (a.y + b.y) / 2 }
  }
  const sy = a.y + Math.sign(dy) * (NH / 2)
  const ey = b.y - Math.sign(dy) * (NH / 2)
  return { d: `M${a.x},${sy} L${b.x},${ey}`, mx: (a.x + b.x) / 2, my: (sy + ey) / 2 }
}

/** Hover or focus a tool to light up the tools it is connected to. */
export default function ToolGraph() {
  const [active, setActive] = useState<string | null>(null)
  const linked = useMemo(() => {
    const s = new Set<string>()
    if (active) {
      s.add(active)
      edges.forEach((e) => { if (e.from === active) s.add(e.to); if (e.to === active) s.add(e.from) })
    }
    return s
  }, [active])

  return (
    <div className="overflow-x-auto rounded-[2.25rem] bg-panel p-4 text-panel-ink ring-1 ring-white/10 sm:p-6">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">How the tools connect</p>
        <p className="font-mono text-[11px] text-panel-mute">Hover or focus a tool · based on my CI/CD project</p>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="min-w-[680px] w-full" role="group" aria-label="Diagram of how the tools in the CI/CD project connect">
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="currentColor" />
          </marker>
        </defs>
        {edges.map((e) => {
          const a = byId[e.from]; const b = byId[e.to]
          const { d, mx, my } = edgePath(a, b)
          const on = active ? e.from === active || e.to === active : false
          return (
            <g key={`${e.from}-${e.to}`} style={{ opacity: active ? (on ? 1 : 0.15) : 0.7, transition: 'opacity .2s' }} className={on ? 'text-accent' : 'text-white'}>
              <path d={d} stroke="currentColor" strokeWidth={on ? 2.5 : 1.5} fill="none" markerEnd="url(#arrow)" />
              <text x={mx} y={my - 6} textAnchor="middle" fontSize="11" fontFamily="JetBrains Mono, monospace" fill="currentColor" stroke="#0a0a0b" strokeWidth="4" paintOrder="stroke">{e.label}</text>
            </g>
          )
        })}
        {nodes.map((n) => {
          const on = linked.has(n.id)
          const dim = active && !on
          const related = edges.filter((e) => e.from === n.id || e.to === n.id).map((e) => byId[e.from === n.id ? e.to : e.from].label)
          return (
            <g
              key={n.id} tabIndex={0} role="button"
              aria-label={`${n.label}: connected to ${related.join(', ')}`}
              onMouseEnter={() => setActive(n.id)} onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(n.id)} onBlur={() => setActive(null)}
              style={{ opacity: dim ? 0.3 : 1, transition: 'opacity .2s', cursor: 'pointer', outline: 'none' }}
            >
              <rect x={n.x - NW / 2} y={n.y - NH / 2} width={NW} height={NH} rx={NH / 2} fill={active === n.id ? '#9d7bf8' : on ? '#e8defd' : '#f6f6f3'} stroke={on ? '#9d7bf8' : 'transparent'} strokeWidth="2" />
              <text x={n.x} y={n.y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fontFamily="Manrope, sans-serif" fill="#0a0a0b">{n.label}</text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
