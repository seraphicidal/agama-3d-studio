import { WishlistView } from "@/components/product/wishlist-view"
import { queryProducts } from "@/lib/data/products"

export const metadata = { title: "Obľúbené" }

export default function WishlistPage() {
  return <WishlistView products={queryProducts({})} />
}
