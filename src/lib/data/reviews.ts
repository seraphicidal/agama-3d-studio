import type { Review } from "@/lib/types"

// Reviews are earned from verified purchases — none exist before launch.
// The EU Omnibus Directive prohibits publishing fabricated or unverifiable
// reviews, so this returns an empty list until real, purchase-verified reviews
// are sourced from the orders/reviews tables (Phase 1 backend wiring).
export function getReviewsForProduct(_productId: string, _count = 5): Review[] {
  return []
}

export interface Testimonial {
  id: string
  author: string
  avatar: string
  rating: number
  comment: string
  photo: string
}

// No fabricated testimonials. Populate from real, consented customer reviews
// once the review pipeline exists; the homepage section hides itself while empty.
export const testimonials: Testimonial[] = []
