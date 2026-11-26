import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { useLite } from '../lite-context'
import { COMMANDS, runCommand, type TermContext } from '../terminal/commands'

type Line = { id: number; kind: 'in' | 'out' | 'ok' | 'err' | 'accent'; text: string }

const toneClass: Record<Line['kind'], string> = {
  in: 'text-panel-ink', out: 'text-panel-mute', ok: 'text-emerald-300', err: 'text-red-300', accent: 'text-accent',
}
const quick = ['help', 'projects', 'skills', 'contact']

let nextId = 1

export default function InteractiveTerminal({ ctx }: { ctx: Omit<TermContext, 'toggleLite'> }) {
  const reduce = useReducedMotion()
  const { toggle: toggleLite } = useLite()
  const [lines, setLines] = useState<Line[]>([
    { id: 0, kind: 'out', text: "Jay Dengle's demo shell — answers come from this site's data, not a live system." },
    { id: -1, kind: 'out', text: 'Type help, or tap a command below.' },
  ])
  const [value, setValue] = useState('')
  const [history, setHistory] = useState<string[]>([])
  const [cursor, setCursor] = useState(-1)
  const log = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const el = log.current
    if (el) el.scrollTop = el.scrollHeight
  }, [lines])

  function exec(cmd: string) {
    const res = runCommand(cmd, { ...ctx, toggleLite })
    setLines((prev) => {
      const base = res.clear ? [] : [...prev, { id: nextId++, kind: 'in' as const, text: `$ ${cmd}` }]
      return [...base, ...res.lines.map((text) => ({ id: nextId++, kind: (res.tone ?? 'out') as Line['kind'], text }))]
    })
    if (cmd.trim()) setHistory((h) => [cmd, ...h].slice(0, 30))
    setCursor(-1)
  }

  function submit(e: FormEvent) {
    e.preventDefault()
    exec(value)
    setValue('')
  }

  function onKey(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      const n = Math.min(cursor + 1, history.length - 1)
      if (history[n] !== undefined) { setCursor(n); setValue(history[n]) }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      const n = cursor - 1
      setCursor(n)
      setValue(n < 0 ? '' : history[n])
    } else if (e.key === 'Tab') {
      e.preventDefault()
      const m = COMMANDS.find((c) => value && c.startsWith(value.toLowerCase()))
      if (m) setValue(m)
    }
  }

  return (
    <div className="relative flex flex-col overflow-hidden rounded-[1.75rem] bg-panel-2 p-4 ring-1 ring-white/10">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-white/80" /><span className="h-2.5 w-2.5 rounded-full bg-white/40" /><span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        </div>
        <span className="rounded-full border border-white/15 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-panel-mute">Interactive demo shell</span>
      </div>

      <div
        ref={log} role="log" aria-live="polite" aria-label="Terminal output" tabIndex={0}
        onClick={() => input.current?.focus()}
        className="h-[210px] overflow-y-auto overscroll-contain pr-1 font-mono text-[12px] leading-6 sm:text-[13px]"
      >
        {lines.map((l) => (
          <motion.div key={l.id} initial={reduce ? false : { opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className={`${toneClass[l.kind]} whitespace-pre-wrap break-words`}>
            {l.text}
          </motion.div>
        ))}
      </div>

      <form onSubmit={submit} className="mt-2 flex items-center gap-2 border-t border-white/10 pt-2 font-mono text-[13px]">
        <label htmlFor="term-input" className="text-accent">$</label>
        <input
          id="term-input" ref={input} value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={onKey}
          autoComplete="off" autoCapitalize="off" spellCheck={false} placeholder="type a command…" aria-label="Terminal command"
          className="min-w-0 flex-1 bg-transparent text-panel-ink placeholder:text-panel-mute/70 focus:outline-none"
        />
        <button type="submit" className="rounded-full bg-card px-3 py-1 text-[11px] font-bold text-card-ink active:scale-95">Run</button>
      </form>
      <div className="mt-2 flex flex-wrap gap-2" aria-label="Quick commands">
        {quick.map((q) => (
          <button key={q} type="button" onClick={() => exec(q)} className="rounded-full border border-white/20 px-3 py-1 font-mono text-[11px] text-panel-ink/85 transition hover:bg-white/10 active:scale-95">{q}</button>
        ))}
      </div>
    </div>
  )
}
