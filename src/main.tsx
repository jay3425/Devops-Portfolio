import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

const plausible = import.meta.env.VITE_PLAUSIBLE_DOMAIN?.trim()
if (plausible) {
  // Privacy-friendly analytics; only loaded when a domain is configured.
  const s = document.createElement('script')
  s.defer = true
  s.dataset.domain = plausible
  s.src = 'https://plausible.io/js/script.js'
  document.head.appendChild(s)
}

const goatCounter = import.meta.env.VITE_GOATCOUNTER_URL?.trim()
if (goatCounter) {
  const s = document.createElement('script')
  s.defer = true
  s.dataset.goatcounter = goatCounter
  s.src = 'https://gc.zgo.at/count.js'
  document.head.appendChild(s)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
