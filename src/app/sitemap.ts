import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"
import { products } from "@/lib/data/products"
import { blogPosts } from "@/lib/data/blog"
import { creators } from "@/lib/data/creators"

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, priority: 1, changeFrequency: "weekly" },
    { url: `${SITE_URL}/modely`, priority: 0.9, changeFrequency: "daily" },
    { url: `${SITE_URL}/kategorie`, priority: 0.8, changeFrequency: "weekly" },
    { url: `${SITE_URL}/zakazkova-vyroba`, priority: 0.9, changeFrequency: "monthly" },
    { url: `${SITE_URL}/ako-to-funguje`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${SITE_URL}/materialy`, priority: 0.6, changeFrequency: "monthly" },
    { url: `${SITE_URL}/o-nas`, priority: 0.5, changeFrequency: "yearly" },
    { url: `${SITE_URL}/kontakt`, priority: 0.5, changeFrequency: "yearly" },
    { url: `${SITE_URL}/blog`, priority: 0.7, changeFrequency: "weekly" },
    { url: `${SITE_URL}/faq`, priority: 0.5, changeFrequency: "monthly" },
    { url: `${SITE_URL}/ochrana-sukromia`, priority: 0.2, changeFrequency: "yearly" },
    { url: `${SITE_URL}/obchodne-podmienky`, priority: 0.2, changeFrequency: "yearly" },
  ]

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/modely/${p.slug}`,
    lastModified: new Date(p.createdAt),
    priority: 0.8,
    changeFrequency: "weekly",
  }))

  const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    priority: 0.5,
    changeFrequency: "monthly",
  }))

  const creatorRoutes: MetadataRoute.Sitemap = creators.map((c) => ({
    url: `${SITE_URL}/tvorcovia/${c.slug}`,
    priority: 0.4,
    changeFrequency: "monthly",
  }))

  return [...staticRoutes, ...productRoutes, ...blogRoutes, ...creatorRoutes]
}
