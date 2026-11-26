import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Check, CheckCircle2, Copy, FileText, LoaderCircle, Mail, MessageSquare, Send } from 'lucide-react'
import { lazy, Suspense, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { notes } from '../data/notes'
import { site } from '../data/site'
import { GithubIcon, LinkedinIcon } from './icons'
import { Hairline, Reveal, SectionLabel, SocialLink } from './ui'

const ServerRack = lazy(() => import('./three/ServerRack'))

type Values = { name: string; email: string; subject: string; message: string }
type Errors = Partial<Record<keyof Values, string>>
type Status = 'idle' | 'sending' | 'success' | 'error' | 'unconfigured'

const empty: Values = { name: '', email: '', subject: '', message: '' }

function validate(v: Values): Errors {
  const e: Errors = {}
  if (v.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.email.trim())) e.email = 'Please enter a valid email address.'
  if (v.subject.trim().length < 3) e.subject = 'Please add a short subject.'
  if (v.message.trim().length < 10) e.message = 'Your message should be at least 10 characters.'
  return e
}

const linkTile = 'group flex items-center gap-3 rounded-full bg-card py-2 pl-2 pr-5 text-sm font-bold text-card-ink shadow-pill transition hover:-translate-y-0.5 active:scale-95'
const linkIcon = 'grid h-10 w-10 place-items-center rounded-full bg-panel text-panel-ink'

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return <p id={id} className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-red-700"><AlertCircle className="h-3.5 w-3.5" />{message}</p>
}

export default function Contact() {
  const [values, setValues] = useState<Values>(empty)
  const [errors, setErrors] = useState<Errors>({})
  const [touched, setTouched] = useState<Partial<Record<keyof Values, boolean>>>({})
  const [status, setStatus] = useState<Status>('idle')
  const [copied, setCopied] = useState<'idle' | 'ok' | 'fail'>('idle')
  const [honey, setHoney] = useState('')
  const nameRef = useRef<HTMLInputElement>(null)

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = { ...values, [e.target.name]: e.target.value }
    setValues(next)
    if (touched[e.target.name as keyof Values]) setErrors(validate(next))
    if (status !== 'sending') setStatus('idle')
  }
  const onBlur = (k: keyof Values) => { setTouched((t) => ({ ...t, [k]: true })); setErrors(validate(values)) }

  const mailtoHref = `mailto:${site.email}?subject=${encodeURIComponent(values.subject || 'Hello Jay')}&body=${encodeURIComponent(values.message + (values.name ? `\n\n— ${values.name}` : ''))}`

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (honey) return // bot
    const errs = validate(values)
    setErrors(errs); setTouched({ name: true, email: true, subject: true, message: true })
    if (Object.keys(errs).length) {
      document.getElementById(`field-${Object.keys(errs)[0]}`)?.focus()
      return
    }
    if (!site.web3formsKey && !site.formEndpoint) { setStatus('unconfigured'); return }

    setStatus('sending')
    try {
      let ok = false
      if (site.web3formsKey) {
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ access_key: site.web3formsKey, name: values.name, email: values.email, subject: values.subject, message: values.message, from_name: 'Portfolio contact form' }),
        })
        const data = await res.json().catch(() => ({}))
        ok = res.ok && data.success === true
      } else if (site.formEndpoint) {
        const res = await fetch(site.formEndpoint, {
          method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(values),
        })
        ok = res.ok
      }
      if (ok) { setStatus('success'); setValues(empty); setTouched({}) } else setStatus('error')
    } catch {
      setStatus('error')
    }
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied('ok')
    } catch {
      try {
        const ta = document.createElement('textarea')
        ta.value = site.email; ta.style.position = 'fixed'; ta.style.opacity = '0'
        document.body.appendChild(ta); ta.select()
        const ok = document.execCommand('copy'); document.body.removeChild(ta)
        setCopied(ok ? 'ok' : 'fail')
      } catch { setCopied('fail') }
    }
    window.setTimeout(() => setCopied('idle'), 2200)
  }

  const field = (k: keyof Values) => ({
    id: `field-${k}`, name: k, value: values[k], onChange, onBlur: () => onBlur(k),
    'aria-invalid': errors[k] ? (true as const) : undefined,
    'aria-describedby': errors[k] ? `err-${k}` : undefined,
    className: `mt-1.5 w-full rounded-2xl border-2 bg-white/60 px-4 py-3 text-[15px] text-card-ink placeholder:text-card-mute/70 focus:border-accent-strong focus:outline-none ${errors[k] ? 'border-red-600' : 'border-transparent ring-1 ring-black/15'}`,
  })

  return (
    <section id="contact" aria-labelledby="contact-title" className="px-3 pb-10 pt-14 sm:px-6 sm:pt-20">
      <div className="mx-auto max-w-6xl">
        <Reveal><SectionLabel num={notes.length ? '0.8' : '0.7'} label="Contact" /></Reveal>
        <Hairline className="mt-4" />

        <Reveal className="relative mt-8 overflow-hidden rounded-[2.5rem] bg-panel p-5 text-panel-ink ring-1 ring-white/10 sm:p-10">
          <div className="grid-lines pointer-events-none absolute inset-0 opacity-70" aria-hidden="true" />
          <div className="relative grid gap-8 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <h2 id="contact-title" className="display break-words text-[clamp(3rem,8vw,6.6rem)] uppercase">Let's build something <span className="text-accent">reliable.</span></h2>
              <p className="mt-5 max-w-md text-[15px] text-panel-ink/85">
                Interested in DevOps opportunities, cloud infrastructure, automation, or engineering collaboration? Let's connect.
              </p>

              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                <li><SocialLink kind="email" label={`Email ${site.email}`} className={linkTile}><span className={linkIcon}><Mail className="h-4 w-4" /></span>Gmail</SocialLink></li>
                <li>
                  <a href="#contact-form" onClick={() => window.setTimeout(() => nameRef.current?.focus(), 400)} className={linkTile}>
                    <span className={linkIcon}><MessageSquare className="h-4 w-4" /></span>Contact me
                  </a>
                </li>
                {site.github && <li><SocialLink kind="github" className={linkTile}><span className={linkIcon}><GithubIcon className="h-4 w-4" /></span>GitHub</SocialLink></li>}
                {site.linkedin && <li><SocialLink kind="linkedin" className={linkTile}><span className={linkIcon}><LinkedinIcon className="h-4 w-4" /></span>LinkedIn</SocialLink></li>}
                {site.resume && <li><a href={site.resume} target="_blank" rel="noopener noreferrer" className={linkTile}><span className={linkIcon}><FileText className="h-4 w-4" /></span>Resume</a></li>}
              </ul>

              <div className="mt-6 flex flex-wrap items-center gap-3 rounded-full border border-white/25 py-2 pl-5 pr-2">
                <span className="min-w-0 truncate font-mono text-sm">{site.email}</span>
                <button type="button" onClick={copyEmail} className="ml-auto inline-flex items-center gap-2 rounded-full bg-card px-4 py-2 text-xs font-bold text-card-ink transition active:scale-95">
                  {copied === 'ok' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied === 'ok' ? 'Copied!' : copied === 'fail' ? 'Copy failed' : 'Copy email'}
                </button>
              </div>
              <p className="sr-only" aria-live="polite">{copied === 'ok' ? 'Email address copied to clipboard' : copied === 'fail' ? 'Could not copy email address' : ''}</p>
            </div>

            <div className="grid content-start gap-4">
            {status === 'success' ? (
              <div id="contact-form" role="status" className="grid place-content-center gap-3 self-start rounded-[2rem] bg-card p-8 text-center text-card-ink">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-700"><CheckCircle2 className="h-8 w-8" /></span>
                <h3 className="display text-5xl uppercase">Message sent</h3>
                <p className="text-sm text-card-mute">Thank you — I'll get back to you soon.</p>
                <button type="button" onClick={() => setStatus('idle')} className="mx-auto mt-2 rounded-full bg-panel px-6 py-3 text-sm font-bold text-panel-ink shadow-pill transition active:scale-95">Send another message</button>
              </div>
            ) : (
            <form id="contact-form" onSubmit={onSubmit} noValidate aria-label="Contact form" className="self-start rounded-[2rem] bg-card p-5 text-card-ink sm:p-7">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="field-name" className="text-xs font-bold uppercase tracking-wider">Name</label>
                  <input {...field('name')} ref={nameRef} type="text" autoComplete="name" placeholder="Your name" />
                  <FieldError id="err-name" message={errors.name} />
                </div>
                <div>
                  <label htmlFor="field-email" className="text-xs font-bold uppercase tracking-wider">Email</label>
                  <input {...field('email')} type="email" autoComplete="email" placeholder="you@example.com" />
                  <FieldError id="err-email" message={errors.email} />
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="field-subject" className="text-xs font-bold uppercase tracking-wider">Subject</label>
                <input {...field('subject')} type="text" placeholder="What's this about?" />
                <FieldError id="err-subject" message={errors.subject} />
              </div>
              <div className="mt-4">
                <label htmlFor="field-message" className="text-xs font-bold uppercase tracking-wider">Message</label>
                <textarea {...field('message')} rows={5} maxLength={1000} placeholder="Tell me a little about the opportunity or idea…" />
                <div className="flex justify-between gap-3"><FieldError id="err-message" message={errors.message} /><span className="ml-auto mt-1 font-mono text-xs text-card-mute" aria-hidden="true">{values.message.length}/1000</span></div>
              </div>
              {/* Honeypot — hidden from people, catches bots */}
              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label>Leave blank <input tabIndex={-1} autoComplete="off" value={honey} onChange={(e) => setHoney(e.target.value)} /></label>
              </div>

              <button
                type="submit" disabled={status === 'sending'}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-panel px-6 py-3.5 text-sm font-bold text-panel-ink shadow-pill transition hover:-translate-y-0.5 active:scale-[0.98] disabled:opacity-60"
              >
                {status === 'sending' ? <><LoaderCircle className="h-4 w-4 animate-spin" /> Sending…</> : <><Send className="h-4 w-4" /> Send message</>}
              </button>

              <div aria-live="polite" className="mt-4">
                <AnimatePresence mode="wait">
                  {status === 'error' && (
                    <motion.div key="e" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl bg-red-100 p-3 text-sm text-red-900">
                      <p className="flex items-start gap-2 font-semibold"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> Your message was not sent. Please try again, or email me directly.</p>
                      <a href={mailtoHref} className="mt-2 inline-block font-bold underline">Open in email app</a>
                    </motion.div>
                  )}
                  {status === 'unconfigured' && (
                    <motion.div key="u" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl bg-amber-100 p-3 text-sm text-amber-950">
                      <p className="flex items-start gap-2 font-semibold"><AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> The contact form isn't connected to a mail service yet, so this message has not been sent.</p>
                      <p className="mt-1">You can send it from your own email app instead:</p>
                      <a href={mailtoHref} className="mt-2 inline-flex items-center gap-2 rounded-full bg-panel px-4 py-2 font-bold text-panel-ink"><Mail className="h-4 w-4" /> Send via email app</a>
                      {import.meta.env.DEV && <p className="mt-2 font-mono text-xs">Dev: set VITE_WEB3FORMS_KEY or VITE_FORM_ENDPOINT — see README.</p>}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
            )}
              <div className="h-64 sm:h-80">
                <Suspense fallback={null}><ServerRack className="h-full w-full" /></Suspense>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
