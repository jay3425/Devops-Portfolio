export interface Note {
  id: string
  title: string
  date: string
  summary: string
  tags?: string[]
  /** Paragraphs shown in a reading dialog. Provide this or `url`. */
  body?: string[]
  /** External link (e.g. a Dev.to / Hashnode / LinkedIn post). */
  url?: string
}

/**
 * Short write-ups you have actually written, e.g. "How I wired Trivy into Jenkins".
 * While this list is empty the Notes section and its nav link are hidden.
 */
export const notes: Note[] = []
