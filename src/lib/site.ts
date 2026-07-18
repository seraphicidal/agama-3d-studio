// Canonical site origin for metadata, sitemap, JSON-LD and OG URLs.
// Set NEXT_PUBLIC_SITE_URL in the deployment environment (e.g. the production
// domain once one exists); the fallback matches the Vercel project name.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://agama-3d-studio.vercel.app"

export const SITE_NAME = "Agama 3D Studio"
