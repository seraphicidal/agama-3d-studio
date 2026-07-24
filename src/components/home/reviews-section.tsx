import Image from "next/image"
import { Quote } from "lucide-react"
import { Container } from "@/components/container"
import { SectionHeading } from "@/components/section-heading"
import { RatingStars } from "@/components/rating-stars"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel"
import { testimonials } from "@/lib/data/reviews"
import { dict } from "@/lib/i18n"

export function ReviewsSection() {
  if (testimonials.length === 0) return null

  return (
    <section className="py-20 sm:py-28">
      <Container className="space-y-10">
        <SectionHeading eyebrow="Recenzie" title={dict.home.reviewsTitle} align="center" />
        <Carousel opts={{ align: "start", loop: true }}>
          <CarouselContent>
            {testimonials.map((t) => (
              <CarouselItem key={t.id} className="sm:basis-1/2 lg:basis-1/3">
                <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card">
                  <div className="relative aspect-[16/9]">
                    <Image src={t.photo} alt="" fill sizes="400px" className="object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    <Quote className="size-5 text-brand-primary" />
                    <RatingStars rating={t.rating} size={13} />
                    <p className="flex-1 text-sm text-muted-foreground">{t.comment}</p>
                    <div className="flex items-center gap-2.5 pt-1">
                      <div className="relative size-8 overflow-hidden rounded-full bg-secondary">
                        <Image src={t.avatar} alt={t.author} fill sizes="32px" className="object-cover" />
                      </div>
                      <span className="text-sm font-medium">{t.author}</span>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-6 flex items-center justify-center gap-3">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
        </Carousel>
      </Container>
    </section>
  )
}
