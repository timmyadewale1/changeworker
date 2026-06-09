import Link from "next/link"
import AdminPageHeader from "@/components/control/AdminPageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAdminDb } from "@/lib/firebaseAdmin"
import { buildWorkspaceDisplayTitle, formatAdminDate } from "@/lib/adminData"

export const dynamic = "force-dynamic"

type WorkspacesPageProps = {
  searchParams?: Promise<{ status?: string; q?: string; page?: string }>
}

const PAGE_SIZE = 10

const statusFilters = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "disputed", label: "Disputed" },
]

function filterHref(status: string, q: string, page = 1) {
  const params = new URLSearchParams()
  if (status !== "all") params.set("status", status)
  if (q) params.set("q", q)
  if (page > 1) params.set("page", String(page))
  const s = params.toString()
  return s ? `/control/workspaces?${s}` : "/control/workspaces"
}

export default async function WorkspacesPage({ searchParams }: WorkspacesPageProps) {
  const resolvedSearchParams = (await searchParams) || {}
  const selectedStatus = resolvedSearchParams.status || "all"
  const q = String(resolvedSearchParams.q || "").trim().toLowerCase()
  const page = Math.max(1, Number(resolvedSearchParams.page || 1))
  const db = getAdminDb()

  let baseQuery: any = db.collection("workspaces").orderBy("createdAt", "desc")
  let countQuery: any = db.collection("workspaces")
  if (selectedStatus !== "all") {
    baseQuery = baseQuery.where("status", "==", selectedStatus)
    countQuery = countQuery.where("status", "==", selectedStatus)
  }

  const [countSnap, pageSnap] = await Promise.all([
    countQuery.count().get(),
    baseQuery.offset((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).get(),
  ])

  const workspaces: any[] = pageSnap.docs
    .map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter((workspace: any) => {
      if (!q) return true
      const blob = `${workspace.gigTitle || ""} ${workspace.clientName || ""} ${workspace.talentName || ""}`.toLowerCase()
      return blob.includes(q)
    })

  const totalWorkspaces = Number((countSnap.data() as any)?.count || 0)
  const totalPages = Math.max(1, Math.ceil(totalWorkspaces / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const activeCount = Number((await db.collection("workspaces").where("status", "==", "active").count().get()).data().count || 0)
  const completedCount = Number((await db.collection("workspaces").where("status", "==", "completed").count().get()).data().count || 0)

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Workspace operations"
        title="Track workspaces"
        description="Follow the active delivery flow across milestones, final submissions, approvals, disputes, and payout progression."
        stats={[
          { label: "Total workspaces", value: totalWorkspaces },
          { label: "Active", value: activeCount },
          { label: "Completed", value: completedCount },
          { label: "Latest view", value: "Realtime" },
        ]}
      />

      <Card className="rounded-[1.75rem] border-0 shadow-sm">
        <CardContent className="p-6">
          <form action="/control/workspaces" className="mb-5 flex flex-col gap-3 lg:flex-row">
            <input name="q" defaultValue={resolvedSearchParams.q || ""} placeholder="Search by gig, client, or talent" className="w-full rounded-full border px-4 py-2 text-sm" />
            <input type="hidden" name="status" value={selectedStatus} />
            <button className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white">Search</button>
          </form>
          <div className="text-xs font-semibold uppercase tracking-[0.16em] text-gray-500">Workspace state</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {statusFilters.map((item) => {
              const active = selectedStatus === item.key
              return (
                <Link
                  key={item.key}
                  href={filterHref(item.key, String(resolvedSearchParams.q || ""), 1)}
                  className={[
                    "rounded-full border px-4 py-2 text-sm font-semibold transition",
                    active
                      ? "border-orange-500 bg-orange-50 text-[var(--primary)]"
                      : "text-gray-700 hover:border-orange-200 hover:bg-orange-50",
                  ].join(" ")}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {workspaces.length === 0 ? (
          <Card className="rounded-[1.75rem] border-0 shadow-sm">
            <CardContent className="p-10 text-center text-gray-600">No workspaces found.</CardContent>
          </Card>
        ) : (
          workspaces.map((workspace) => (
            <Card key={workspace.id} className="rounded-[1.75rem] border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-extrabold text-gray-900">{buildWorkspaceDisplayTitle(workspace)}</h2>
                      <Badge className="bg-orange-50 text-[var(--primary)] hover:bg-orange-50">{workspace.status || "unknown"}</Badge>
                    </div>

                    <div className="mt-4 grid gap-4 text-sm md:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <div className="font-semibold text-gray-500">Client</div>
                        <div className="mt-1 text-gray-900">{workspace.clientName || workspace.clientUid || "N/A"}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-500">Talent</div>
                        <div className="mt-1 text-gray-900">{workspace.talentName || workspace.talentUid || "N/A"}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-500">Gig</div>
                        <div className="mt-1 text-gray-900">{workspace.gigTitle || workspace.gigId || "N/A"}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-500">Created</div>
                        <div className="mt-1 text-gray-900">{formatAdminDate(workspace.createdAt)}</div>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/control/workspaces/${workspace.id}`}
                    className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    View workspace
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <Link href={filterHref(selectedStatus, String(resolvedSearchParams.q || ""), Math.max(1, safePage - 1))} className="rounded-full border px-4 py-2 text-sm font-semibold text-gray-700">
            Previous
          </Link>
          <div className="text-sm font-semibold text-gray-600">
            Page {safePage} of {totalPages}
          </div>
          <Link href={filterHref(selectedStatus, String(resolvedSearchParams.q || ""), Math.min(totalPages, safePage + 1))} className="rounded-full border px-4 py-2 text-sm font-semibold text-gray-700">
            Next
          </Link>
        </div>
      ) : null}
    </div>
  )
}
