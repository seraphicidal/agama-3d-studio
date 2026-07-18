import { MarketplaceView } from "@/components/marketplace/marketplace-view"

export const metadata = { title: "Modely" }

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const initialCategory = typeof params.kategoria === "string" ? params.kategoria : undefined
  const initialQuery = typeof params.q === "string" ? params.q : undefined
  const initialSort = typeof params.sort === "string" ? params.sort : undefined

  return (
    <MarketplaceView
      initialCategory={initialCategory}
      initialQuery={initialQuery}
      initialSort={initialSort}
    />
  )
}
