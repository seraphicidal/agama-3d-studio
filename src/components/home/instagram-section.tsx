import Image from "next/image"
import { Container } from "@/components/container"
import { SectionHeading } from "@/components/section-heading"
import { InstagramIcon } from "@/components/icons/social"
import { instagramImage } from "@/lib/data/images"
import { dict } from "@/lib/i18n"

export function InstagramSection() {
  const images = Array.from({ length: 6 }, (_, i) => instagramImage(i))

  return (
    <section className="py-20 sm:py-28">
      <Container className="space-y-10">
        <SectionHeading
          eyebrow="Instagram"
          title={dict.home.instagramTitle}
          action={{ label: "@agama3dstudio", href: "https://instagram.com/agama3dstudio" }}
        />
        <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:grid-cols-6">
          {images.map((src, i) => (
            <a
              key={i}
              href="https://instagram.com/agama3dstudio"
              target="_blank"
              rel="noreferrer"
              className="group relative aspect-square overflow-hidden rounded-2xl bg-secondary"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="200px"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/30 group-hover:opacity-100">
                <InstagramIcon className="size-6 text-white" />
              </div>
            </a>
          ))}
        </div>
      </Container>
    </section>
  )
}
