import type { Review } from "@/lib/types"

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

export const testimonials: Testimonial[] = []
