import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { initialLite, LiteContext } from './lite-context'

export default function LiteProvider({ children }: { children: ReactNode }) {
  const [lite, setLite] = useState(initialLite)
  const toggle = useCallback(() => {
    setLite((v) => {
      try { localStorage.setItem('lite3d', v ? '0' : '1') } catch { /* ignore */ }
      return !v
    })
  }, [])
  const value = useMemo(() => ({ lite, toggle }), [lite, toggle])
  return <LiteContext.Provider value={value}>{children}</LiteContext.Provider>
}
