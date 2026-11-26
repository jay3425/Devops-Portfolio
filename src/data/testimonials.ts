export interface Testimonial {
  id: string
  quote: string
  name: string
  role: string
  org: string
}

/**
 * Add real recommendations only, with the person's permission.
 * While this list is empty the Testimonials block is hidden.
 */
export const testimonials: Testimonial[] = []
