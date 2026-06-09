import Link from "next/link"
import AdminPageHeader from "@/components/control/AdminPageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { getAdminDb } from "@/lib/firebaseAdmin"
import {
  buildWorkspaceDisplayTitle,
  formatAdminDate,
  formatAdminMoney,
  getAdminIndexes,
  getUserSummary,
  timestampToMillis,
} from "@/lib/adminData"
import { Badge } from "@/components/ui/badge"

export const dynamic = "force-dynamic"

const PAGE_SIZE = 10

type TransactionRow = {
  id: string
  kind: "workspace_funding" | "wallet_transaction" | "withdrawal" | "payout_request" | "escrow_event"
  amount: number
  status: string
  createdAt: any
  title: string
  subtitle: string
  href?: string
}

function statusBadge(status: string) {
  const value = String(status || "recorded").toLowerCase()
  if (["funded", "completed", "paid", "success"].includes(value)) {
    return <Badge className="bg-emerald-50 text-emerald-700 hover:bg-emerald-50">{status}</Badge>
  }
  if (["pending", "requested", "processing", "approved"].includes(value)) {
    return <Badge className="bg-amber-50 text-amber-700 hover:bg-amber-50">{status}</Badge>
  }
  if (["failed", "declined", "reversed"].includes(value)) {
    return <Badge className="bg-red-50 text-red-700 hover:bg-red-50">{status}</Badge>
  }
  return <Badge className="bg-orange-50 text-[var(--primary)] hover:bg-orange-50">{status}</Badge>
}

async function getTransactions() {
  const db = getAdminDb()
  const indexes = await getAdminIndexes()
  const [
    workspacesSnap,
    paymentsSnap,
    walletTxSnap,
    withdrawalsSnap,
    payoutRequestsSnap,
    escrowLedgerSnap,
    payoutRevenueSnap,
  ] = await Promise.all([
    db.collection("workspaces").get(),
    db.collectionGroup("payments").get(),
    db.collectionGroup("transactions").get(),
    db.collectionGroup("withdrawals").get(),
    db.collectionGroup("payoutRequests").get(),
    db.collectionGroup("escrowLedger").get(),
    db.collection("payoutRevenue").get(),
  ])

  const workspaceMap = new Map<string, any>()
  workspacesSnap.docs.forEach((doc: any) => workspaceMap.set(doc.id, { id: doc.id, ...doc.data() }))
  const rows: TransactionRow[] = []

  paymentsSnap.docs.forEach((doc: any) => {
    const data = doc.data() as any
    const workspaceId = doc.ref.parent.parent?.id || ""
    const workspace = workspaceMap.get(workspaceId) || {}
    rows.push({
      id: doc.id,
      kind: "workspace_funding",
      amount: Number(data.amount || 0),
      status: String(data.status || "recorded"),
      createdAt: data.paidAt || data.createdAt,
      title: "Workspace funding",
      subtitle: buildWorkspaceDisplayTitle({ ...workspace, gigTitle: workspace.gigTitle || workspace.gigId }),
      href: workspaceId ? `/control/workspaces/${workspaceId}` : undefined,
    })
  })

  walletTxSnap.docs.forEach((doc: any) => {
    const data = doc.data() as any
    if (String(data.status || "").toLowerCase() === "initiated") return
    const walletUid = doc.ref.parent.parent?.id || ""
    const owner = getUserSummary(walletUid, indexes)
    rows.push({
      id: doc.id,
      kind: "wallet_transaction",
      amount: Number(data.amount || 0),
      status: String(data.status || "recorded"),
      createdAt: data.createdAt || data.updatedAt,
      title: String(data.reason || data.type || "wallet transaction").replace(/_/g, " "),
      subtitle: owner.name,
      href: walletUid ? `/control/wallets/${walletUid}` : undefined,
    })
  })

  withdrawalsSnap.docs.forEach((doc: any) => {
    const data = doc.data() as any
    const walletUid = doc.ref.parent.parent?.id || ""
    const owner = getUserSummary(walletUid, indexes)
    rows.push({
      id: doc.id,
      kind: "withdrawal",
      amount: Number(data.amount || 0),
      status: String(data.status || "requested"),
      createdAt: data.createdAt || data.updatedAt,
      title: "Talent withdrawal",
      subtitle: owner.name,
      href: walletUid ? `/control/wallets/${walletUid}` : undefined,
    })
  })

  payoutRequestsSnap.docs.forEach((doc: any) => {
    const data = doc.data() as any
    const workspaceId = doc.ref.parent.parent?.id || ""
    const workspace = workspaceMap.get(workspaceId) || {}
    rows.push({
      id: doc.id,
      kind: "payout_request",
      amount: Number(workspace.payment?.amount || 0),
      status: String(data.status || "requested"),
      createdAt: data.requestedAt || data.updatedAt,
      title: "Payout request",
      subtitle: buildWorkspaceDisplayTitle({ ...workspace, gigTitle: workspace.gigTitle || workspace.gigId }),
      href: workspaceId ? `/control/workspaces/${workspaceId}` : undefined,
    })
  })

  escrowLedgerSnap.docs.forEach((doc: any) => {
    const data = doc.data() as any
    const workspaceId = doc.ref.parent.parent?.id || ""
    const workspace = workspaceMap.get(workspaceId) || {}
    rows.push({
      id: doc.id,
      kind: "escrow_event",
      amount: Number(data.amount || 0),
      status: String(data.type || "recorded"),
      createdAt: data.createdAt || data.updatedAt,
      title: "Escrow event",
      subtitle: buildWorkspaceDisplayTitle({ ...workspace, gigTitle: workspace.gigTitle || workspace.gigId }),
      href: workspaceId ? `/control/workspaces/${workspaceId}` : undefined,
    })
  })

  const totalVolume = paymentsSnap.docs.reduce((sum: number, doc: any) => {
    const data = doc.data() as any
    return String(data.status || "").toLowerCase() === "funded" ? sum + Number(data.amount || 0) : sum
  }, 0)
  const platformEarnings = payoutRevenueSnap.docs.reduce((sum: number, doc: any) => sum + Number(doc.data().amount || 0), 0)
  const pendingWithdrawals = withdrawalsSnap.docs.filter((doc: any) =>
    ["requested", "processing"].includes(String(doc.data().status || "").toLowerCase())
  ).length
  const pendingPayouts = payoutRequestsSnap.docs.filter((doc: any) =>
    ["requested", "approved", "processing"].includes(String(doc.data().status || "").toLowerCase())
  ).length

  rows.sort((a, b) => timestampToMillis(b.createdAt) - timestampToMillis(a.createdAt))
  return { rows, totalVolume, platformEarnings, pendingWithdrawals, pendingPayouts }
}

function pageHref(page: number, kind: string, q: string) {
  const params = new URLSearchParams()
  if (kind !== "all") params.set("kind", kind)
  if (q) params.set("q", q)
  if (page > 1) params.set("page", String(page))
  const s = params.toString()
  return s ? `/control/transactions?${s}` : "/control/transactions"
}

export default async function TransactionsPage({ searchParams }: { searchParams?: Promise<{ page?: string; kind?: string; q?: string }> }) {
  const resolved = (await searchParams) || {}
  const { rows, totalVolume, platformEarnings, pendingWithdrawals, pendingPayouts } = await getTransactions()
  const kind = String(resolved.kind || "all")
  const q = String(resolved.q || "").trim().toLowerCase()
  const page = Math.max(1, Number(resolved.page || 1))

  const filteredRows = rows.filter((row) => {
    if (kind !== "all" && row.kind !== kind) return false
    if (!q) return true
    const blob = `${row.title} ${row.subtitle} ${row.status} ${row.kind}`.toLowerCase()
    return blob.includes(q)
  })

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const visibleRows = filteredRows.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Payment operations"
        title="Review transactions"
        description="Track workspace funding, wallet movement, withdrawal requests, payout requests, escrow events, and the platform’s earned fee from one admin money flow view."
        stats={[
          { label: "Records", value: filteredRows.length },
          { label: "Transaction volume", value: formatAdminMoney(totalVolume) },
          { label: "Platform earnings", value: formatAdminMoney(platformEarnings) },
          { label: "Pending settlements", value: pendingWithdrawals + pendingPayouts },
        ]}
      />

      <Card className="rounded-[1.75rem] border-0 shadow-sm">
        <CardContent className="p-6">
          <form action="/control/transactions" className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">
            <input
              name="q"
              defaultValue={resolved.q || ""}
              placeholder="Search transactions"
              className="w-full rounded-full border px-4 py-2 text-sm"
            />
            <select name="kind" defaultValue={kind} className="rounded-full border px-4 py-2 text-sm">
              <option value="all">All types</option>
              <option value="workspace_funding">Workspace funding</option>
              <option value="wallet_transaction">Wallet transaction</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="payout_request">Payout request</option>
              <option value="escrow_event">Escrow event</option>
            </select>
            <button className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white">Search</button>
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Pending withdrawals", value: pendingWithdrawals },
          { label: "Pending payout requests", value: pendingPayouts },
          { label: "Funded volume", value: formatAdminMoney(totalVolume) },
          { label: "Platform revenue", value: formatAdminMoney(platformEarnings) },
        ].map((item) => (
          <Card key={item.label} className="rounded-[1.75rem] border-0 shadow-sm">
            <CardContent className="p-6">
              <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">{item.label}</div>
              <div className="mt-2 text-3xl font-extrabold text-gray-900">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {visibleRows.length === 0 ? (
          <Card className="rounded-[1.75rem] border-0 shadow-sm">
            <CardContent className="p-10 text-center text-gray-600">No transaction records found yet.</CardContent>
          </Card>
        ) : (
          visibleRows.map((transaction) => (
            <Card key={`${transaction.kind}-${transaction.id}`} className="rounded-[1.75rem] border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-extrabold capitalize text-gray-900">{transaction.title}</h2>
                      {statusBadge(transaction.status)}
                    </div>

                    <div className="mt-4 grid gap-4 text-sm md:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <div className="font-semibold text-gray-500">Amount</div>
                        <div className="mt-1 text-gray-900">{formatAdminMoney(transaction.amount)}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-500">Linked record</div>
                        <div className="mt-1 text-gray-900">{transaction.subtitle}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-500">Created</div>
                        <div className="mt-1 text-gray-900">{formatAdminDate(transaction.createdAt, true)}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-500">Record type</div>
                        <div className="mt-1 capitalize text-gray-900">{transaction.kind.replace(/_/g, " ")}</div>
                      </div>
                    </div>
                  </div>

                  {transaction.href ? (
                    <Link
                      href={transaction.href}
                      className="rounded-full border px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[var(--primary)]"
                    >
                      View record
                    </Link>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <Link href={pageHref(Math.max(1, safePage - 1), kind, q)} className="rounded-full border px-4 py-2 text-sm font-semibold text-gray-700">
            Previous
          </Link>
          <div className="text-sm font-semibold text-gray-600">
            Page {safePage} of {totalPages}
          </div>
          <Link href={pageHref(Math.min(totalPages, safePage + 1), kind, q)} className="rounded-full border px-4 py-2 text-sm font-semibold text-gray-700">
            Next
          </Link>
        </div>
      ) : null}
    </div>
  )
}
