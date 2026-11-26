import { Search } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Modal } from './ui'

export interface PaletteItem { id: string; label: string; hint: string; run: () => void }

export default function CommandPalette({ open, onClose, items }: { open: boolean; onClose: () => void; items: PaletteItem[] }) {
  const [q, setQ] = useState('')
  const [index, setIndex] = useState(0)
  const input = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    return s ? items.filter((i) => `${i.label} ${i.hint}`.toLowerCase().includes(s)) : items
  }, [q, items])

  useEffect(() => {
    if (!open) return
    const t = window.setTimeout(() => input.current?.focus(), 60)
    return () => window.clearTimeout(t)
  }, [open])

  function choose(item?: PaletteItem) {
    if (!item) return
    onClose()
    setQ(''); setIndex(0)
    window.setTimeout(item.run, 120)
  }

  return (
    <Modal open={open} onClose={() => { onClose(); setQ(''); setIndex(0) }} labelledBy="palette-title">
      <div className="p-4 pt-5 sm:p-6">
        <h2 id="palette-title" className="sr-only">Command palette</h2>
        <div className="flex items-center gap-3 rounded-full bg-card py-1.5 pl-5 pr-16 text-card-ink">
          <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
          <label htmlFor="palette-input" className="sr-only">Search commands</label>
          <input
            id="palette-input" ref={input} value={q} autoComplete="off" role="combobox" aria-expanded="true" aria-controls="palette-list"
            aria-activedescendant={results[index] ? `pal-${results[index].id}` : undefined}
            onChange={(e) => { setQ(e.target.value); setIndex(0) }}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setIndex((i) => Math.min(i + 1, results.length - 1)) }
              else if (e.key === 'ArrowUp') { e.preventDefault(); setIndex((i) => Math.max(i - 1, 0)) }
              else if (e.key === 'Enter') { e.preventDefault(); choose(results[index]) }
            }}
            placeholder="Jump to a section, open a project, copy email…"
            className="min-w-0 flex-1 bg-transparent py-2.5 text-[15px] focus:outline-none"
          />
        </div>
        <ul id="palette-list" role="listbox" aria-label="Commands" className="mt-4 grid max-h-[50vh] gap-1 overflow-y-auto">
          {results.map((r, i) => (
            <li key={r.id} id={`pal-${r.id}`} role="option" aria-selected={i === index}>
              <button
                type="button" tabIndex={-1} onMouseEnter={() => setIndex(i)} onClick={() => choose(r)}
                className={`flex w-full items-center justify-between gap-3 rounded-full px-5 py-3 text-left text-sm ${i === index ? 'bg-card font-bold text-card-ink' : 'hover:bg-white/10'}`}
              >
                <span>{r.label}</span>
                <span className={`font-mono text-[11px] ${i === index ? 'text-card-mute' : 'text-panel-mute'}`}>{r.hint}</span>
              </button>
            </li>
          ))}
          {results.length === 0 && <li className="px-5 py-6 text-center text-sm text-panel-mute" role="status">No commands match “{q}”.</li>}
        </ul>
        <p className="mt-4 text-center font-mono text-[11px] text-panel-mute">↑ ↓ to move · Enter to run · Esc to close</p>
      </div>
    </Modal>
  )
}
