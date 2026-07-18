import { notFound } from "next/navigation"
import Image from "next/image"
import { Users, MapPin, Calendar } from "lucide-react"
import { Container } from "@/components/container"
import { ProductCard } from "@/components/product/product-card"
import { creators, getCreatorBySlug, creatorCover } from "@/lib/data/creators"
import { getProductsByCreator } from "@/lib/data/products"

export function generateStaticParams() {
  return creators.map((c) => ({ slug: c.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const creator = getCreatorBySlug(slug)
  if (!creator) return {}
  return { title: creator.name, description: creator.bio }
}

export default async function CreatorPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const creator = getCreatorBySlug(slug)
  if (!creator) notFound()

  const creatorProducts = getProductsByCreator(creator.id)

  return (
    <div>
      <div className="relative h-56 w-full overflow-hidden sm:h-72">
        <Image src={creatorCover(creator.id)} alt="" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
      </div>
      <Container className="-mt-16 space-y-10 pb-16">
        <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-end sm:text-left">
          <div className="relative size-28 shrink-0 overflow-hidden rounded-full border-4 border-background bg-secondary">
            <Image src={creator.avatar} alt={creator.name} fill sizes="112px" className="object-cover" />
          </div>
          <div className="space-y-1.5 pb-1">
            <h1 className="text-3xl font-semibold tracking-tight">{creator.name}</h1>
            <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground sm:justify-start">
              <span className="flex items-center gap-1">
                <MapPin className="size-3.5" /> {creator.location}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-3.5" /> Od {creator.joinedYear}
              </span>
              <span className="flex items-center gap-1">
                <Users className="size-3.5" /> {creator.followers.toLocaleString("sk-SK")} sledovateľov
              </span>
            </div>
          </div>
        </div>

        <p className="max-w-2xl text-muted-foreground">{creator.bio}</p>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Modely od {creator.name}</h2>
          {creatorProducts.length === 0 ? (
            <p className="text-muted-foreground">Zatiaľ žiadne modely.</p>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
              {creatorProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
