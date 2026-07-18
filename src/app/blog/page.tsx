import Image from "next/image"
import Link from "next/link"
import { Container } from "@/components/container"
import { blogPosts } from "@/lib/data/blog"
import { formatDate } from "@/lib/format"

export const metadata = { title: "Blog" }

export default function BlogPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container className="space-y-10">
        <div className="max-w-2xl space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-primary">
            Blog
          </span>
          <h1 className="text-4xl font-semibold tracking-tight">Novinky a návody</h1>
          <p className="text-lg text-muted-foreground">
            Tipy na materiály, starostlivosť o modely a pohľad do zákulisia našej dielne.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block overflow-hidden rounded-2xl border border-border bg-card"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 p-5">
                <div className="flex flex-wrap gap-1.5">
                  {post.tags.map((t) => (
                    <span key={t} className="rounded-full bg-secondary px-2.5 py-1 text-[11px] font-medium">
                      {t}
                    </span>
                  ))}
                </div>
                <h2 className="text-lg font-semibold leading-snug group-hover:text-brand-primary">
                  {post.title}
                </h2>
                <p className="line-clamp-2 text-sm text-muted-foreground">{post.excerpt}</p>
                <p className="pt-1 text-xs text-muted-foreground">
                  {formatDate(post.date)} · {post.readMinutes} min čítania
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </div>
  )
}
