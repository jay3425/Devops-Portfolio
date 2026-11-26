import { motion, useReducedMotion } from 'framer-motion'
import type { ProjectArtKind } from '../data/projects'

/** Custom SVG illustrations (no external assets). Purely decorative. */
export default function ProjectArt({ kind, className = '' }: { kind: ProjectArtKind; className?: string }) {
  const reduce = useReducedMotion()
  const anim = (d: number) => (reduce ? {} : { initial: { pathLength: 0 }, whileInView: { pathLength: 1 }, viewport: { once: true }, transition: { duration: 1.2, delay: d } })

  return (
    <svg viewBox="0 0 320 200" role="img" aria-hidden="true" className={`h-full w-full ${className}`} fill="none">
      <defs>
        <linearGradient id={`g-${kind}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2a2a30" /><stop offset="1" stopColor="#0f0f12" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill={`url(#g-${kind})`} />
      <g stroke="#ffffff" strokeOpacity=".06">
        {Array.from({ length: 9 }).map((_, i) => <path key={`v${i}`} d={`M${i * 40} 0V200`} />)}
        {Array.from({ length: 6 }).map((_, i) => <path key={`h${i}`} d={`M0 ${i * 40}H320`} />)}
      </g>

      {kind === 'nexops' && (
        <g>
          <rect x="26" y="30" width="150" height="104" rx="14" fill="#f6f6f3" />
          <circle cx="42" cy="46" r="4" fill="#0a0a0b" /><circle cx="55" cy="46" r="4" fill="#9a9aa0" /><circle cx="68" cy="46" r="4" fill="#cfcfd2" />
          <path d="M42 70l10 8-10 8" stroke="#6d28d9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="60" y="74" width="80" height="6" rx="3" fill="#0a0a0b" />
          <rect x="42" y="96" width="110" height="6" rx="3" fill="#b4b4b1" />
          <rect x="42" y="110" width="70" height="6" rx="3" fill="#b4b4b1" />
          <g stroke="#9d7bf8" strokeWidth="2.5" strokeLinecap="round">
            <motion.path d="M176 82 C210 82 206 50 238 50" {...anim(0.2)} />
            <motion.path d="M176 82 C210 82 206 118 238 118" {...anim(0.4)} />
            <motion.path d="M176 82 H238" {...anim(0.3)} />
          </g>
          <circle cx="250" cy="50" r="14" fill="#9d7bf8" /><circle cx="250" cy="82" r="14" fill="#f6f6f3" /><circle cx="250" cy="118" r="14" fill="#f6f6f3" />
          <circle cx="170" cy="82" r="10" fill="#f6f6f3" stroke="#0a0a0b" strokeWidth="3" />
          <path d="M243 50l5 5 9-10" stroke="#0a0a0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="26" y="150" width="268" height="26" rx="13" fill="#f6f6f3" fillOpacity=".08" />
          <rect x="40" y="159" width="90" height="8" rx="4" fill="#f6f6f3" fillOpacity=".5" />
        </g>
      )}

      {kind === 'pipeline' && (
        <g>
          <motion.path d="M30 100 H290" stroke="#9d7bf8" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" {...anim(0.1)} />
          {[
            { x: 40, t: 'BUILD' }, { x: 100, t: 'SCAN' }, { x: 160, t: 'IMAGE' }, { x: 220, t: 'DEPLOY' },
          ].map((s, i) => (
            <g key={s.t}>
              <rect x={s.x - 22} y="74" width="52" height="52" rx="16" fill={i === 3 ? '#9d7bf8' : '#f6f6f3'} />
              <text x={s.x + 4} y="104" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="8.5" fontWeight="700" fill="#0a0a0b">{s.t}</text>
            </g>
          ))}
          <circle cx="285" cy="100" r="16" fill="#f6f6f3" /><path d="M279 100h12m-5-5l5 5-5 5" stroke="#0a0a0b" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="30" y="148" width="260" height="28" rx="14" fill="#f6f6f3" fillOpacity=".08" />
          <path d="M44 166l16-10 14 6 18-12 16 8 18-10 18 8 20-9 18 6" stroke="#f6f6f3" strokeOpacity=".7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="30" y="26" width="90" height="26" rx="13" fill="#f6f6f3" /><text x="75" y="43" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fontWeight="700" fill="#0a0a0b">TERRAFORM</text>
          <rect x="130" y="26" width="64" height="26" rx="13" fill="none" stroke="#f6f6f3" strokeOpacity=".5" /><text x="162" y="43" textAnchor="middle" fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#f6f6f3">EKS</text>
        </g>
      )}

      {kind === 'infrawatch' && (
        <g>
          <rect x="26" y="28" width="268" height="100" rx="16" fill="#f6f6f3" />
          <g fill="#0a0a0b">
            {[18, 34, 26, 48, 38, 62, 44, 70, 52, 40, 58, 30].map((h, i) => (
              <motion.rect key={i} x={44 + i * 20} y={116 - h} width="11" height={h} rx="5.5"
                {...(reduce ? {} : { initial: { scaleY: 0 }, whileInView: { scaleY: 1 }, viewport: { once: true }, transition: { duration: 0.6, delay: i * 0.05 } })}
                style={{ transformOrigin: `0px ${116}px`, transformBox: 'fill-box' }} />
            ))}
          </g>
          <motion.path d="M44 66 L90 56 L130 74 L170 48 L210 62 L250 40 L280 52" stroke="#6d28d9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" {...anim(0.5)} />
          <g fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#f6f6f3" fillOpacity=".75">
            <text x="30" y="152">0 */1 * * *  report.sh</text><text x="30" y="168">logrotate  weekly  rotate 4</text><text x="30" y="184">$ tail -f infrawatch.log<tspan className="caret">_</tspan></text>
          </g>
        </g>
      )}
    </svg>
  )
}
