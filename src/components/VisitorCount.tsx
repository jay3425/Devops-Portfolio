import { useEffect, useState } from 'react'

const endpoint = import.meta.env.VITE_GOATCOUNTER_URL?.trim()

function isCounterResponse(value: unknown): value is { count: string } {
  return typeof value === 'object'
    && value !== null
    && 'count' in value
    && typeof value.count === 'string'
}

export default function VisitorCount() {
  const [count, setCount] = useState<string>()
  const [unavailable, setUnavailable] = useState(false)

  useEffect(() => {
    if (!endpoint) return

    const controller = new AbortController()
    const loadCount = async () => {
      try {
        const url = new URL('/counter/TOTAL.json', endpoint)
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) throw new Error(`Counter returned HTTP ${response.status}`)

        const result: unknown = await response.json()
        if (!isCounterResponse(result)) throw new Error('Counter returned an invalid response')
        setCount(result.count)
      } catch (error) {
        if (controller.signal.aborted) return
        console.error('Unable to load portfolio view count', error)
        setUnavailable(true)
      }
    }

    void loadCount()
    return () => controller.abort()
  }, [])

  if (!endpoint) return null

  return (
    <span className="text-panel-mute" aria-live="polite">
      {count ? `Portfolio views · ${count}` : unavailable ? 'Views temporarily unavailable' : 'Portfolio views · loading'}
    </span>
  )
}
