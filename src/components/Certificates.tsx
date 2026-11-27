import { Award, ExternalLink, Eye } from 'lucide-react'
import { useState } from 'react'
import { certificates, type Certificate } from '../data/certificates'
import { Hairline, Modal, Reveal, SectionLabel } from './ui'
import { publicUrl } from '../data/site'

export default function Certificates() {
  const [preview, setPreview] = useState<Certificate | null>(null)

  return (
    <section id="certificates" aria-labelledby="cert-title" className="px-3 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionLabel num="0.6" label="Certificates" /></Reveal>
        <Hairline className="mt-4" />
        <Reveal className="mt-8">
          <h2 id="cert-title" className="display text-[clamp(3rem,9vw,7rem)] uppercase">Credentials</h2>
          <p className="mt-3 max-w-xl text-sm text-page-mute">Verified certifications with issuer, date and credential ID.</p>
        </Reveal>

        {certificates.length === 0 ? (
          <Reveal className="mt-8">
            <div role="status" className="rounded-[2.25rem] border-2 border-dashed border-line p-10 text-center">
              <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-panel text-panel-ink"><Award className="h-6 w-6" /></span>
              <p className="display mt-4 text-4xl uppercase">Certificates coming soon</p>
              <p className="mx-auto mt-2 max-w-md text-sm text-page-mute">Verified certifications will be listed here with their issuer, date and credential ID.</p>
              {import.meta.env.DEV && <p className="mx-auto mt-3 max-w-md font-mono text-xs text-accent-strong">Dev hint: add entries in src/data/certificates.ts</p>}
            </div>
          </Reveal>
        ) : (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {certificates.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.08}>
                <li className="flex h-full list-none flex-col rounded-[2rem] bg-panel p-5 text-panel-ink shadow-pill ring-1 ring-white/10">
                  {c.image && <img src={c.image} alt={`${c.title} certificate preview`} loading="lazy" className="mb-4 aspect-[4/3] w-full rounded-2xl object-cover" />}
                  <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">{c.issuer}</p>
                  <h3 className="display mt-2 text-3xl uppercase leading-none">{c.title}</h3>
                  <p className="mt-2 font-mono text-xs text-panel-mute">{c.date}{c.credentialId ? ` · ID ${c.credentialId}` : ''}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-5">
                    {c.url && (
                      <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-card px-5 py-2.5 text-sm font-bold text-card-ink">
                        View Certificate <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    {c.image && (
                      <button type="button" onClick={() => setPreview(c)} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-2.5 text-sm font-bold">
                        <Eye className="h-4 w-4" /> Preview
                      </button>
                    )}
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        )}
      </div>

      <Modal open={!!preview} onClose={() => setPreview(null)} labelledBy="cert-preview-title">
        {preview && (
          <div className="p-5 sm:p-8">
            <h3 id="cert-preview-title" className="display pr-12 text-3xl uppercase">{preview.title}</h3>
            <p className="mb-4 font-mono text-xs text-panel-mute">{preview.issuer} · {preview.date}</p>
            {preview.image && <img src={preview.image} alt={`${preview.title} certificate`} className="w-full rounded-2xl" />}
          </div>
        )}
      </Modal>
    </section>
  )
}
