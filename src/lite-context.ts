import { createContext, useContext } from 'react'

export interface LiteState { lite: boolean; toggle: () => void }

export const LiteContext = createContext<LiteState>({ lite: false, toggle: () => {} })
export const useLite = () => useContext(LiteContext)

interface NavigatorHints { connection?: { saveData?: boolean }; deviceMemory?: number }

/** Saved choice wins; otherwise default to lite on data-saver, very low-core devices or reduced motion. */
export function initialLite(): boolean {
  try {
    const saved = localStorage.getItem('lite3d')
    if (saved === '1') return true
    if (saved === '0') return false
  } catch { /* storage unavailable */ }
  const n = navigator as Navigator & NavigatorHints
  return (
    n.connection?.saveData === true ||
    (n.hardwareConcurrency !== undefined && n.hardwareConcurrency <= 2) ||
    (n.deviceMemory !== undefined && n.deviceMemory <= 2) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}
