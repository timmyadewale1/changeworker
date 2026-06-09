import Link from "next/link"
import { getAdminDb } from "@/lib/firebaseAdmin"
import AdminPageHeader from "@/components/control/AdminPageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import AdminDeleteGigButton from "@/components/control/AdminDeleteGigButton"

export const dynamic = "force-dynamic"

const PAGE_SIZE = 10

function money(value?: number | null) {
  if (value === null || value === undefined) return "N/A"
  return `N${Number(value).toLocaleString()}`
}

function budgetLabel(gig: any) {
  if (gig.budgetType === "hourly") return `${money(gig.hourlyRate)}/hr`
  if (gig.budgetType === "fixed") return `${money(gig.fixedBudget)} fixed`
  return "N/A"
}

function pageHref(page: number) {
  return page > 1 ? `/control/gigs?page=${page}` : "/control/gigs"
}

export default async function AdminGigsPage({ searchParams }: { searchParams?: Promise<{ page?: string }> }) {
  const resolvedSearchParams = (await searchParams) || {}
  const page = Math.max(1, Number(resolvedSearchParams.page || 1))
  const db = getAdminDb()

  const [countSnap, gigsSnap] = await Promise.all([
    db.collection("gigs").count().get(),
    db.collection("gigs").orderBy("createdAt", "desc").offset((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).get(),
  ])

  const gigs: any[] = gigsSnap.docs.map((doc: any) => ({
    id: doc.id,
    ...doc.data(),
  }))

  const totalGigs = Number((countSnap.data() as any)?.count || 0)
  const totalPages = Math.max(1, Math.ceil(totalGigs / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const openCount = Number((await db.collection("gigs").where("status", "==", "open").count().get()).data().count || 0)
  const closedCount = Number((await db.collection("gigs").where("status", "==", "closed").count().get()).data().count || 0)

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Gig operations"
        title="Monitor gigs"
        description="Track the opportunities being posted on the marketplace, review quality, and jump into the client, proposal, or workspace flow when needed."
        stats={[
          { label: "Total gigs", value: totalGigs },
          { label: "Open", value: openCount },
          { label: "Closed", value: closedCount },
          { label: "Latest view", value: "Realtime" },
        ]}
      />

      <div className="space-y-4">
        {gigs.length === 0 ? (
          <Card className="rounded-[1.75rem] border-0 shadow-sm">
            <CardContent className="p-10 text-center text-gray-600">No gigs found.</CardContent>
          </Card>
        ) : (
          gigs.map((gig) => (
            <Card key={gig.id} className="rounded-[1.75rem] border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-extrabold text-gray-900">{gig.title}</h2>
                      <Badge className="bg-orange-50 text-[var(--primary)] hover:bg-orange-50">{gig.status || "unknown"}</Badge>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                      {gig.description || "No description provided."}
                    </p>

                    <div className="mt-4 grid gap-4 text-sm md:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <div className="font-semibold text-gray-500">Client</div>
                        <div className="mt-1">
                          <Link href={`/control/clients/${gig.clientUid}`} className="font-semibold text-[var(--primary)]">
                            {gig.clientName || gig.clientUid}
                          </Link>
                        </div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-500">Budget</div>
                        <div className="mt-1 text-gray-900">{budgetLabel(gig)}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-500">Hires needed</div>
                        <div className="mt-1 text-gray-900">{gig.hiresNeeded || 1}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-500">Created</div>
                        <div className="mt-1 text-gray-900">{gig.createdAt?.toDate?.().toLocaleDateString() || "N/A"}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/control/gigs/${gig.id}`}
                      className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                    >
                      View gig
                    </Link>
                    <AdminDeleteGigButton gigId={gig.id} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <Link href={pageHref(Math.max(1, safePage - 1))} className="rounded-full border px-4 py-2 text-sm font-semibold text-gray-700">
            Previous
          </Link>
          <div className="text-sm font-semibold text-gray-600">Page {safePage} of {totalPages}</div>
          <Link href={pageHref(Math.min(totalPages, safePage + 1))} className="rounded-full border px-4 py-2 text-sm font-semibold text-gray-700">
            Next
          </Link>
        </div>
      ) : null}
    </div>
  )
}
