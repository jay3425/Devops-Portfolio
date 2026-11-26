import { Fragment, useId } from 'react'
import { glossary } from '../data/glossary'

const terms = Object.keys(glossary).sort((a, b) => b.length - a.length)
const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')
const pattern = new RegExp(`(${terms.map(escape).join('|')})`, 'g')

function Term({ term }: { term: string }) {
  const id = useId()
  return (
    <span className="group relative inline-block">
      <button
        type="button" aria-describedby={id}
        className="cursor-help rounded-sm underline decoration-dotted decoration-1 underline-offset-4 focus-visible:outline-offset-2"
      >
        {term}
      </button>
      <span
        id={id} role="tooltip"
        className="pointer-events-none invisible absolute bottom-full left-0 z-40 mb-2 w-60 rounded-xl bg-card p-3 text-left text-xs font-medium normal-case leading-snug tracking-normal text-card-ink opacity-0 shadow-pill transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
      >
        {glossary[term]}
      </span>
    </span>
  )
}

/** Renders text with known DevOps terms turned into accessible hover/focus tooltips. */
export default function Gloss({ text }: { text: string }) {
  const parts = text.split(pattern)
  return (
    <>
      {parts.map((p, i) => (glossary[p] ? <Term key={i} term={p} /> : <Fragment key={i}>{p}</Fragment>))}
    </>
  )
}
