import { AccountView } from "@/components/account/account-view"
import { AuthPanel } from "@/components/account/auth-panel"
import { queryProducts } from "@/lib/data/products"
import { isSupabaseConfigured } from "@/lib/supabase/config"
import { getUser } from "@/lib/supabase/server"
import { listUserOrders } from "@/lib/orders/queries"

export const metadata = { title: "Môj účet" }

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const tab = typeof params.tab === "string" ? params.tab : undefined

  // Auth is env-gated: without Supabase the page renders a clear notice.
  if (!isSupabaseConfigured()) {
    return <AuthPanel notConfigured />
  }

  const user = await getUser()
  if (!user) return <AuthPanel />

  const meta = user.user_metadata as { name?: string } | undefined
  const account = {
    name: (meta?.name && meta.name.trim()) || user.email?.split("@")[0] || "",
    email: user.email ?? "",
  }
  const orders = await listUserOrders(user.id)

  return (
    <AccountView
      initialTab={tab}
      products={queryProducts({})}
      orders={orders}
      user={account}
    />
  )
}
