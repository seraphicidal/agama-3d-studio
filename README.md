# Agama 3D Studio

Premium Slovak 3D-printing marketplace — figures, collectibles, cosplay props, replacement parts and custom prints. Built with Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS v4, shadcn/ui on Base UI, Framer Motion, React Three Fiber and Zustand.

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm run lint
```

## Architecture notes

- **Language**: Slovak-first. All UI chrome strings flow through `src/lib/i18n` (typed dictionary). `en.ts` is fully translated — launching English means routing a locale through `getDictionary()`, not writing copy.
- **Catalog data**: mock datasets in `src/lib/data/*` behind small getters (`getProductBySlug`, `queryProducts`, …). These getters are the seam where Supabase queries slot in.
- **API**: `/api/products`, `/api/products/[slug]`, `/api/categories` — thin route handlers over the data layer; response shapes are what the DB-backed versions will keep.
- **State**: cart / wishlist / recent searches / mock account in Zustand + `localStorage` (`src/store/*`). Demo coupon: `AGAMA10` (−10 %).
- **3D viewer**: `src/components/three/model-viewer.tsx` (React Three Fiber), lazy-loaded so three.js stays out of the main bundle. Ships procedural sample models; to use real scans, add a `src` prop rendering drei's `useGLTF` and self-host any Draco decoder (no runtime CDN fetches).
- **SEO**: `sitemap.ts`, `robots.ts`, `opengraph-image.tsx`, JSON-LD (Organization, WebSite, Product, BreadcrumbList, Article). Canonical origin comes from `NEXT_PUBLIC_SITE_URL` (see `src/lib/site.ts`).

## Production wiring order

1. **Env**: set `NEXT_PUBLIC_SITE_URL` to the real domain.
2. **Database**: create a Supabase project, apply `supabase/schema.sql`, create a `custom-models` storage bucket. Replace the getter bodies in `src/lib/data/*.ts` with Supabase queries (signatures already match).
3. **Auth**: swap the mock `useAccountStore` login for Supabase Auth via the seam in `src/lib/supabase/client.ts`.
4. **Payments**: implement `src/lib/stripe/client.ts` (cards + Apple Pay) and `src/lib/payments/gopay.ts` (SK/CZ bank buttons); the checkout calls the single `createCheckoutSession()` seam in `src/lib/payments`.
5. **Uploads**: point the custom-order wizard's file handler at the `custom-models` bucket and record rows in the `files` table.
