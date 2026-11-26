import { ArrowLeft, Printer } from 'lucide-react'
import type { ReactNode } from 'react'
import { resume as r } from './data/resume'
import { site } from './data/site'

/**
 * Printable résumé laid out like Jay's PDF: single-column A4, black on white, ruled section headings.
 * Content lives in src/data/resume.ts. Use the Print button (or Ctrl/Cmd+P) and choose "Save as PDF".
 */
export default function ResumePage() {
  return (
    <div className="min-h-screen bg-[#ebebe8] px-3 py-6 print:bg-white print:p-0" style={{ fontFamily: "'Open Sans', Arial, Helvetica, sans-serif" }}>
      <style>{`@page { size: A4; margin: 10mm 12mm; }`}</style>
      <div className="mx-auto mb-4 flex max-w-[210mm] flex-wrap items-center justify-between gap-3 print:hidden">
        <a href="/" className="inline-flex items-center gap-2 rounded-full bg-[#0a0a0b] px-5 py-3 text-sm font-bold text-white"><ArrowLeft className="h-4 w-4" /> Back to portfolio</a>
        <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-full bg-[#6d28d9] px-5 py-3 text-sm font-bold text-white"><Printer className="h-4 w-4" /> Print / Save as PDF</button>
      </div>

      <main className="mx-auto max-w-[210mm] bg-white px-[12mm] py-[10mm] text-[13px] leading-[1.45] text-black shadow-xl print:max-w-none print:p-0 print:shadow-none">
        <header className="text-center">
          <h1 className="text-[22px] font-bold tracking-wide">{r.name}</h1>
          <p className="text-[14px] font-bold">{r.headline}</p>
          <p className="text-[13px]">
            {r.location} | {r.phone} | <a href={`mailto:${site.email}`}>{site.email}</a>
            {site.github && <> | <a className="underline" href={site.github}>GitHub</a></>}
            {site.linkedin && <> | <a className="underline" href={site.linkedin}>LinkedIn</a></>}
          </p>
        </header>

        <Section title="Summary"><p>{r.summary}</p></Section>

        <Section title="Skills">
          {r.skills.map(([k, v]) => <p key={k}><b>{k}:</b> {v}</p>)}
        </Section>

        <Section title="Education">
          {r.education.map((e) => (
            <div key={e.school} className="break-inside-avoid">
              <p className="flex justify-between gap-4"><span><b>{e.school}</b> | {e.degree}</span><span>{e.place} | <b>{e.years}</b></span></p>
              <ul className="ml-8 list-disc"><li><b>{e.scoreLabel}:</b> {e.score}</li></ul>
            </div>
          ))}
        </Section>

        <Section title="Internship">
          {r.internships.map((i) => (
            <div key={i.org} className="break-inside-avoid">
              <p className="flex justify-between gap-4"><span><b>{i.org}</b> | {i.role}</span><span>{i.dates}</span></p>
              <ul className="ml-8 list-disc">{i.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </div>
          ))}
        </Section>

        <Section title="Projects">
          {r.projects.map((p) => (
            <div key={p.title} className="mb-2 break-inside-avoid">
              <p className="font-bold">{p.title}</p>
              <ul className="ml-6 list-disc">
                <li><b>Objective:</b> {p.objective}</li>
                <li><b>Implementation:</b> {p.implementation}</li>
                <li><b>Core Capabilities:</b> {p.capabilities}</li>
                <li><b>Tech Stack:</b> {p.tech}</li>
              </ul>
            </div>
          ))}
        </Section>

        <Section title="Certificates">
          {r.certificates.map((c) => <p key={c.short}><b>{c.short}</b>{c.full}</p>)}
        </Section>
      </main>
    </div>
  )
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-4">
      <h2 className="mb-1 border-b-2 border-black pb-0.5 text-[16px] font-bold uppercase tracking-wide">{title}</h2>
      {children}
    </section>
  )
}
