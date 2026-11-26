import { lazy, Suspense } from 'react'
import Gloss from './Gloss'
import { site } from '../data/site'
import GitHubActivity from './GitHubActivity'
import { Hairline, Reveal, SectionLabel } from './ui'

const InfinityLoop = lazy(() => import('./three/InfinityLoop'))
const lifecycle = ['Plan', 'Code', 'Build', 'Test', 'Release', 'Deploy', 'Operate', 'Monitor']

const facts = [
  { k: 'Education', v: 'B.E. in Computer Science and Engineering', s: 'PRMCEAM · SGBAU', rot: '-rotate-2' },
  { k: 'Batch', v: '2026', s: 'Graduate', rot: 'rotate-1 sm:mt-6' },
  { k: 'Approach', v: 'Automate. Improve. Learn.', s: 'Automate repetitive work, improve reliability, continuously learn.', rot: '-rotate-1' },
]
const interests = ['Cloud-native infrastructure', 'Containerization', 'Deployment automation', 'Monitoring', 'System reliability']

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className="px-3 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionLabel num="0.2" label="About" /></Reveal>
        <Hairline className="mt-4" />

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <Reveal className="relative overflow-hidden rounded-[2.25rem] bg-panel p-6 text-panel-ink ring-1 ring-white/10 sm:p-10 lg:col-span-7">
            <div className="grid-lines pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
            <h2 id="about-title" className="display relative break-words text-[clamp(2.8rem,7vw,6rem)] uppercase">
              Engineering the flow from <span className="text-accent">code</span> to cloud.
            </h2>
            <p className="relative mt-6 max-w-xl text-[15px] leading-relaxed text-panel-ink/85">
              <Gloss text="I'm Jay Dengle, a Computer Science and Engineering graduate with a strong interest in DevOps engineering, cloud computing, infrastructure automation, and CI/CD pipelines. I enjoy understanding how applications move from development to production and building repeatable, reliable deployment workflows using modern DevOps tools." />
            </p>
            <div className="relative mt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-panel-mute">My interests</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {interests.map((i) => (
                  <li key={i} className="rounded-full border border-white/25 px-4 py-1.5 text-xs">{i}</li>
                ))}
              </ul>

            </div>
          </Reveal>

          <Reveal delay={0.15} className="lg:col-span-5">
            <div className="h-full rounded-[2.25rem] bg-card p-6 text-card-ink shadow-pill sm:p-8 lg:-ml-10 lg:mt-14">
              {site.photo ? (
                <figure className="-mx-1 mb-5 overflow-hidden rounded-[1.75rem] bg-panel ring-1 ring-black/10">
                  <img src={site.photo} alt={`Illustrated portrait of ${site.name}`} loading="lazy" className="aspect-square w-full object-cover object-top grayscale transition duration-500 hover:grayscale-0 active:grayscale-0" />
                </figure>
              ) : import.meta.env.DEV ? (
                <p className="mb-5 rounded-2xl border border-dashed border-black/30 p-4 text-center font-mono text-xs text-card-mute">Dev hint: set VITE_PHOTO_URL (e.g. /photo.jpg in public/) to show your portrait here.</p>
              ) : null}
              <div className="flex items-center justify-between">
                <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-accent-strong">Technical profile</p>
                <span className="font-mono text-[11px] text-card-mute">profile.json</span>
              </div>
              <pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words rounded-2xl bg-panel p-5 font-mono text-[12.5px] leading-6 text-panel-ink">
{`{
  "name": "Jay Dengle",
  "role": "DevOps Engineer",
  "focus": [
    "CI/CD automation",
    "Cloud infrastructure",
    "Infrastructure as Code",
    "Containers"
  ],
  "education": "B.E. CSE, 2026",
  "approach": "automate · improve · learn"
}`}
              </pre>
            </div>
          </Reveal>
        </div>

        <ul className="mt-10 grid gap-5 sm:grid-cols-3">
          {facts.map((f, i) => (
            <Reveal key={f.k} delay={i * 0.1} className={`${f.rot} transition-transform hover:rotate-0`}>
              <li className="list-none rounded-[1.75rem] bg-panel p-5 text-panel-ink shadow-pill ring-1 ring-white/10">
                <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-accent">{f.k}</p>
                <p className="display mt-2 text-3xl uppercase">{f.v}</p>
                <p className="mt-2 text-sm text-panel-mute">{f.s}</p>
              </li>
            </Reveal>
          ))}
        </ul>

        {site.githubUser && <GitHubActivity user={site.githubUser} />}

        <Reveal className="relative mt-10 overflow-hidden rounded-[2.25rem] bg-panel p-4 text-panel-ink ring-1 ring-white/10 sm:p-8">
          <div className="grid-lines pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative flex flex-wrap items-center justify-between gap-2">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-accent">The DevOps lifecycle</p>
            <p className="font-mono text-[11px] text-panel-mute">Illustration · continuous loop</p>
          </div>
          <div className="relative h-[300px] sm:h-[420px] lg:h-[480px]">
            <Suspense fallback={null}><InfinityLoop className="h-full w-full" /></Suspense>
          </div>
          <ol className="relative flex flex-wrap justify-center gap-2" aria-label="DevOps lifecycle stages">
            {lifecycle.map((l, i) => (
              <li key={l} className="flex items-center gap-2 rounded-full border border-white/25 py-1.5 pl-1.5 pr-4 text-xs">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-card font-mono text-[11px] font-bold text-card-ink">{i + 1}</span>{l}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  )
}
