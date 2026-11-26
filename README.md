# Jay Dengle — DevOps Engineer Portfolio

A black-and-off-white, editorial-style portfolio built with **React 19 + Vite + TypeScript + Tailwind CSS v4 + Framer Motion + Lucide**.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in your real links (see below)
npm run dev                  # http://localhost:5173
npm run build                # type-check + production build into dist/
npm run preview              # serve the production build locally
npm run lint
```

Requires Node 20+.

## Where to edit content

Everything is data-driven; no component edits needed for normal updates.

| What | File |
| --- | --- |
| Name, status label, nav items, hero keywords | `src/data/site.ts` |
| Projects, case studies, filters | `src/data/projects.ts` |
| Experience timeline | `src/data/experience.ts` |
| Tech stack and “used / learning” status | `src/data/stack.ts` |
| Certificates | `src/data/certificates.ts` |
| Notes (blog-style write-ups; section appears once you add one) | `src/data/notes.ts` |
| Testimonials (appear once you add a real one) | `src/data/testimonials.ts` |
| Glossary tooltips | `src/data/glossary.ts` |
| Screenshots / demo clips | `media` field in `src/data/projects.ts`, files in `public/projects/` |

## Configuration (`.env.local`)

| Variable | Purpose |
| --- | --- |
| `VITE_GITHUB_URL`, `VITE_LINKEDIN_URL` | Profile links. If empty they are **hidden in production** (shown greyed out in `npm run dev` as a reminder). |
| `VITE_CONTACT_EMAIL` | Public email shown on the site (defaults to `jaydengle2005@gmail.com`). |
| `VITE_RESUME_URL` | Optional. By default the Resume button opens the built-in printable page `/resume.html` (generated from your data files; use Print → Save as PDF). Set this to your own PDF, e.g. `/resume.pdf` in `public/`, to override it. |
| `VITE_PHOTO_URL` | Optional portrait shown in About, e.g. `/photo.jpg` (put the file in `public/`). Hidden when empty. |
| `VITE_PLAUSIBLE_DOMAIN` | Optional. Your site's domain to enable privacy-friendly Plausible analytics. Nothing loads when empty. |
| `VITE_SITE_URL` | Your deployed URL without a trailing slash (e.g. `https://jaydengle.vercel.app`). Needed so LinkedIn/WhatsApp link previews can load `public/og.png`. |
| `VITE_STATUS` | Hero status label, e.g. `OPEN TO DEVOPS OPPORTUNITIES`. |
| `VITE_REPO_NEXOPS`, `VITE_REPO_PIPELINE`, `VITE_REPO_INFRAWATCH` | Real GitHub repo URLs for each project. |
| `VITE_DEMO_*` | Live demo URLs. Leave empty if there is no demo (the “Live Demo” filter then shows an honest empty state). |
| `VITE_WEB3FORMS_KEY` **or** `VITE_FORM_ENDPOINT` | Contact form backend (below). |

> `VITE_*` values are embedded in the public bundle. Only put public values there (a Web3Forms *access key* and a Formspree *endpoint* are designed to be public).

## Making the contact form actually send

The form never shows “sent” unless a service confirms delivery.

**Option A — Web3Forms (free, no server):** create a key at <https://web3forms.com> using your email, then set `VITE_WEB3FORMS_KEY`.

**Option B — Formspree:** create a form at <https://formspree.io>, then set `VITE_FORM_ENDPOINT=https://formspree.io/f/xxxxxxx`.

With neither configured, a valid submission shows an honest “not sent” notice and a prefilled **Send via email app** (`mailto:`) button.

## Content you must verify before publishing

- **NexOps** (`src/data/projects.ts`): the case study is written from the project brief only. Compare it with the repository README and edit it; add `FastAPI` to `tech` only if it is really implemented. A dev-only banner reminds you while running `npm run dev`.
- **Experience:** dates and responsibilities for Synent Technologies and iBase Technologies are intentionally left out until confirmed — fill in `dates` / `points`.
- **Tech stack:** items are marked *Used in projects* or *Learning*; adjust to match reality.
- **Certificates:** the list is empty by design. Add verified entries (and optional images in `public/certs/`).

## Deployment

The build output is a static site in `dist/`.

- **Vercel / Netlify / Cloudflare Pages:** import the repo, build command `npm run build`, output directory `dist`, and add your `VITE_*` variables in the project settings.
- **GitHub Pages:** the included Actions workflow builds and deploys `dist/` on pushes to `main`. In **Settings → Pages**, set the source to **GitHub Actions**. The Vite base path is configured for this repository's project URL.
- **S3 + CloudFront:** `npm run build` then sync `dist/` to the bucket.

## Interactive features

- **Lite mode** (cube button in the nav): freezes the 3D figures into still frames. It defaults on for data-saver or very low-power devices and the choice is remembered.
- **Drag to rotate** the hero containers, the infinity loop, the server rack and the JD monogram; **click a container** to see which tool it stands for.
- **Demo shell** in the hero (`help`, `projects`, `open nexops`, `skills`, `theme dark`, `lite`…), **Ctrl/Cmd + K** command palette, and the `sudo hire jay` easter egg. Everything runs in the browser and reads only your data files.
- **Pipeline playground** (Projects): toggle SonarQube and Trivy and watch the pipeline and its consequences change. It is an illustration, not a live system.
- **Tool graph** (Tech Stack), **glossary tooltips**, desktop-only **cursor ring** and **magnetic buttons** (all disabled on touch devices and with reduced motion).
- **GitHub activity** in About: appears when `VITE_GITHUB_URL` is set and shows your latest public, non-fork repositories from GitHub's public API (it fails gracefully if GitHub rate-limits a visitor).
- **Printable résumé** at `/resume.html`, built from the same data files as the portfolio.

## 3D figures

Decorative `three` / `@react-three/fiber` scenes live in `src/components/three/`:

| Scene | Where |
| --- | --- |
| `ContainerStack` — pyramid of shipping containers | Hero |
| `InfinityLoop` — DevOps lifecycle loop with travelling beads | About |
| `PipelineBanner` — packet moving through Build → Scan → Image → Deploy | Projects |
| `TowerBuild` — tower that assembles as you scroll the timeline | Experience (desktop) |
| `PodCluster` — pods orbiting a control plane; highlights the selected category | Tech Stack (tablet and up) |
| `ServerRack` — rack with blinking lights | Contact |
| `Monogram` — extruded JD | Footer |

All are illustrations, not live data. Each canvas is lazy-loaded (~240 KB gzipped, fetched after first paint) and mounted only while near the viewport, so only one or two WebGL contexts exist at a time. With reduced motion a single still frame is drawn; without WebGL the figure is omitted. To remove one, delete its `lazy(...)` import and usage in the matching section component.

## Accessibility & motion

Semantic landmarks, skip link, visible focus states, labelled form fields with inline errors, `aria-live` status messages, dialogs with focus trap + Esc, and `prefers-reduced-motion` support (Framer Motion `reducedMotion="user"` plus CSS fallbacks).


## Music

A generative ambient loop (pads, bass, plucks, light beat) is synthesised in the browser with the Web Audio API — no audio files or licensing. It is **off by default**; the floating button at the bottom-left turns it on/off, with a volume slider (remembered), and it pauses when the tab is hidden. To use your own track instead, put it in `public/` and set `VITE_MUSIC_URL=/music.mp3`.

## Portrait

`public/photo.jpg` is shown (grayscale, colour on hover/tap) in the About card. Replace the file or set `VITE_PHOTO_URL`.

## Horizontal sections

`HorizontalScroll` pins Projects and Experience on large screens and slides the cards sideways as you scroll down. On phones and with reduced motion it becomes a normal swipeable row. Reuse it for any other section.
