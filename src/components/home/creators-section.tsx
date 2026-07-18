import { Container } from "@/components/container"
import { SectionHeading } from "@/components/section-heading"
import { CreatorCard } from "@/components/creator/creator-card"
import { creators } from "@/lib/data/creators"
import { dict } from "@/lib/i18n"

export function CreatorsSection() {
  return (
    <section className="bg-secondary/50 py-20 sm:py-28">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Tvorcovia"
          title={dict.home.creatorsTitle}
          subtitle={dict.home.creatorsSubtitle}
        />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((creator) => (
            <CreatorCard key={creator.id} creator={creator} />
          ))}
        </div>
      </Container>
    </section>
  )
}
