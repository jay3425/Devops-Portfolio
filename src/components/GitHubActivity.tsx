import { ExternalLink, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { GithubIcon } from './icons'
import { Reveal } from './ui'

interface Repo { id: number; name: string; html_url: string; description: string | null; language: string | null; stargazers_count: number; pushed_at: string; fork: boolean }
type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ok'; repos: Repo[] }

const fmt = (iso: string) => new Date(iso).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })

/** Real, public data straight from the GitHub REST API (no key needed; rate-limited per visitor IP). */
export default function GitHubActivity({ user }: { user: string }) {
  const [state, setState] = useState<State>({ status: 'loading' })

  useEffect(() => {
    const ctl = new AbortController()
    fetch(`https://api.github.com/users/${encodeURIComponent(user)}/repos?sort=pushed&per_page=12`, { signal: ctl.signal, headers: { Accept: 'application/vnd.github+json' } })
      .then(async (r) => {
        if (r.status === 403 || r.status === 429) throw new Error('GitHub rate limit reached for now.')
        if (!r.ok) throw new Error(`GitHub returned ${r.status}.`)
        const repos = ((await r.json()) as Repo[]).filter((x) => !x.fork).slice(0, 6)
        setState({ status: 'ok', repos })
      })
      .catch((e: unknown) => {
        if ((e as { name?: string }).name === 'AbortError') return
        setState({ status: 'error', message: e instanceof Error ? e.message : 'Could not load repositories.' })
      })
    return () => ctl.abort()
  }, [user])

  return (
    <Reveal className="mt-10 rounded-[2.25rem] bg-panel p-5 text-panel-ink ring-1 ring-white/10 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.25em] text-accent"><GithubIcon className="h-4 w-4" /> Recently active on GitHub</p>
        <a href={`https://github.com/${user}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-xs font-bold text-card-ink">
          @{user} <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
      <div className="mt-5" aria-live="polite">
        {state.status === 'loading' && <p className="font-mono text-sm text-panel-mute">Loading public repositories…</p>}
        {state.status === 'error' && <p className="rounded-2xl bg-white/10 p-4 text-sm">{state.message} <a className="font-bold underline" href={`https://github.com/${user}`} target="_blank" rel="noopener noreferrer">View the profile on GitHub</a>.</p>}
        {state.status === 'ok' && state.repos.length === 0 && <p className="text-sm text-panel-mute">No public repositories to show yet.</p>}
        {state.status === 'ok' && state.repos.length > 0 && (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {state.repos.map((r) => (
              <li key={r.id}>
                <a href={r.html_url} target="_blank" rel="noopener noreferrer" className="block h-full rounded-2xl border border-white/20 p-4 transition hover:-translate-y-0.5 hover:border-accent">
                  <p className="font-mono text-sm font-bold">{r.name}</p>
                  {r.description && <p className="mt-1 line-clamp-2 text-sm text-panel-mute">{r.description}</p>}
                  <p className="mt-3 flex items-center gap-3 font-mono text-[11px] text-panel-mute">
                    {r.language && <span>{r.language}</span>}
                    <span className="inline-flex items-center gap-1"><Star className="h-3 w-3" />{r.stargazers_count}</span>
                    <span className="ml-auto">pushed {fmt(r.pushed_at)}</span>
                  </p>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Reveal>
  )
}
