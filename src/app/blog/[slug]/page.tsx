import { notFound } from "next/navigation"
import NextImage from "next/image"
import Link from "next/link"
import { Container } from "@/components/container"
import { JsonLd } from "@/components/json-ld"
import { blogPosts, getBlogPostBySlug } from "@/lib/data/blog"
import { formatDate } from "@/lib/format"
import { SITE_URL, SITE_NAME } from "@/lib/site"

export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.coverImage, width: 1200, height: 800 }],
    },
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getBlogPostBySlug(slug)
  if (!post) notFound()

  const others = blogPosts.filter((p) => p.id !== post.id).slice(0, 3)

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: [post.coverImage],
    datePublished: post.date,
    inLanguage: "sk",
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: SITE_NAME },
    mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
  }

  return (
    <div className="py-12 sm:py-16">
      <JsonLd data={articleJsonLd} />
      <Container className="max-w-3xl space-y-8">
        <div className="space-y-4">
          <Link href="/blog" className="text-sm font-medium text-brand-primary hover:underline">
            ← Späť na blog
          </Link>
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((t) => (
              <span key={t} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium">
                {t}
              </span>
            ))}
          </div>
          <h1 className="text-4xl font-semibold tracking-tight">{post.title}</h1>
          <p className="text-sm text-muted-foreground">
            {post.author} · {formatDate(post.date)} · {post.readMinutes} min čítania
          </p>
        </div>

        <div className="relative aspect-[16/9] overflow-hidden rounded-3xl">
          <NextImage src={post.coverImage} alt={post.title} fill sizes="800px" className="object-cover" priority />
        </div>

        <div className="max-w-none space-y-5">
          {post.content.map((para, i) => (
            <p key={i} className="text-muted-foreground leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {others.length > 0 && (
          <div className="space-y-4 border-t border-border pt-8">
            <h2 className="text-lg font-semibold">Ďalšie články</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {others.map((o) => (
                <Link key={o.id} href={`/blog/${o.slug}`} className="group space-y-2">
                  <div className="relative aspect-video overflow-hidden rounded-xl">
                    <NextImage src={o.coverImage} alt={o.title} fill sizes="300px" className="object-cover transition-transform group-hover:scale-105" />
                  </div>
                  <p className="text-sm font-medium leading-snug group-hover:text-brand-primary">{o.title}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  )
}
