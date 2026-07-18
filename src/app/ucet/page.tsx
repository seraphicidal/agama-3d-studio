import { AccountView } from "@/components/account/account-view"

export const metadata = { title: "Môj účet" }

export default async function AccountPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const tab = typeof params.tab === "string" ? params.tab : undefined
  return <AccountView initialTab={tab} />
}
