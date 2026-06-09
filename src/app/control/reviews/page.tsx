import Link from "next/link"
import AdminPageHeader from "@/components/control/AdminPageHeader"
import { Card, CardContent } from "@/components/ui/card"
import { getAdminDb } from "@/lib/firebaseAdmin"
import { formatAdminDate, getAdminIndexes, getUserSummary } from "@/lib/adminData"

export const dynamic = "force-dynamic"

type ReviewsPageProps = {
  searchParams?: Promise<{ kind?: string; page?: string; q?: string }>
}

const PAGE_SIZE = 10

function kindHref(kind: string, page = 1) {
  const params = new URLSearchParams()
  if (kind !== "client") params.set("kind", kind)
  if (page > 1) params.set("page", String(page))
  const query = params.toString()
  return query ? `/control/reviews?${query}` : "/control/reviews"
}

export default async function ReviewsPage({ searchParams }: ReviewsPageProps) {
  const resolvedSearchParams = (await searchParams) || {}
  const kind = String(resolvedSearchParams.kind || "client")
  const q = String(resolvedSearchParams.q || "").trim().toLowerCase()
  const page = Math.max(1, Number(resolvedSearchParams.page || 1))
  const db = getAdminDb()
  const indexes = await getAdminIndexes()
  const workspaces = await db.collection("workspaces").get()
  const workspaceMap = new Map<string, any>()
  workspaces.docs.forEach((doc: any) => workspaceMap.set(doc.id, doc.data()))

  let reviewQuery: any =
    kind === "platform"
      ? db.collection("platform_reviews").orderBy("createdAt", "desc")
      : db.collection("reviews").orderBy("createdAt", "desc")

  if (kind === "client") reviewQuery = reviewQuery.where("fromRole", "==", "client")
  if (kind === "talent") reviewQuery = reviewQuery.where("fromRole", "==", "talent")

  const [countSnap, pageSnap] = await Promise.all([
    reviewQuery.count().get(),
    reviewQuery.offset((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).get(),
  ])

  const reviews: any[] = pageSnap.docs
    .map((doc: any) => ({ id: doc.id, ...doc.data() }))
    .map((review: any) => {
      if (kind === "platform") {
        const workspace = workspaceMap.get(review.workspaceId) || {}
        return {
          ...review,
          kind: "platform",
          from: getUserSummary(review.fromUserId, indexes),
          workspaceLabel: workspace.gigTitle ? `Workspace from ${workspace.gigTitle}` : review.workspaceId || "N/A",
        }
      }
      const workspace = workspaceMap.get(review.workspaceId) || {}
      return {
        ...review,
        kind: "peer",
        from: getUserSummary(review.fromUserId, indexes),
        to: getUserSummary(review.toUserId, indexes),
        workspaceLabel: workspace.gigTitle ? `Workspace from ${workspace.gigTitle}` : review.workspaceId || "N/A",
      }
    })
    .filter((review: any) => {
      if (!q) return true
      const blob = `${review.from?.name || ""} ${review.to?.name || ""} ${review.workspaceLabel || ""} ${review.publicComment || review.comment || ""}`.toLowerCase()
      return blob.includes(q)
    })

  const totalReviews = Number((countSnap.data() as any)?.count || 0)
  const totalPages = Math.max(1, Math.ceil(totalReviews / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum: number, review: any) => sum + Number(review.rating || 0), 0) / reviews.length).toFixed(1)
      : "0.0"

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Reputation layer"
        title="Reviews"
        description="Review client-to-talent reviews, talent-to-client reviews, and platform reviews separately."
        stats={[
          { label: "Reviews", value: totalReviews },
          { label: "Average rating", value: avgRating },
          { label: "Selected view", value: kind },
          { label: "Latest", value: "Realtime" },
        ]}
      />

      <Card className="rounded-[1.75rem] border-0 shadow-sm">
        <CardContent className="flex flex-wrap gap-2 p-6">
          {[
            { key: "client", label: "Client reviews" },
            { key: "talent", label: "Talent reviews" },
            { key: "platform", label: "Platform reviews" },
          ].map((item) => (
            <Link
              key={item.key}
              href={kindHref(item.key, 1)}
              className={[
                "rounded-full border px-4 py-2 text-sm font-semibold transition",
                kind === item.key
                  ? "border-orange-500 bg-orange-50 text-[var(--primary)]"
                  : "text-gray-700 hover:border-orange-200 hover:bg-orange-50",
              ].join(" ")}
            >
              {item.label}
            </Link>
          ))}
        </CardContent>
      </Card>

      <Card className="rounded-[1.75rem] border-0 shadow-sm">
        <CardContent className="p-6">
          <form action="/control/reviews" className="flex flex-col gap-3 lg:flex-row">
            <input type="hidden" name="kind" value={kind} />
            <input
              name="q"
              defaultValue={resolvedSearchParams.q || ""}
              placeholder="Search by reviewer, recipient, workspace, or comment"
              className="w-full rounded-full border px-4 py-2 text-sm"
            />
            <button className="rounded-full bg-[var(--primary)] px-5 py-2 text-sm font-semibold text-white">Search</button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card className="rounded-[1.75rem] border-0 shadow-sm">
            <CardContent className="p-10 text-center text-gray-600">No reviews found.</CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={`${review.kind}-${review.id}`} className="rounded-[1.75rem] border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="text-lg font-extrabold text-gray-900">{review.rating || 0}/5</div>
                    <div className="mt-4 grid gap-4 text-sm md:grid-cols-2 xl:grid-cols-4">
                      <div>
                        <div className="font-semibold text-gray-500">From</div>
                        <div className="mt-1 text-gray-900">{review.from?.name || review.userName || "N/A"}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-500">To</div>
                        <div className="mt-1 text-gray-900">{review.to?.name || "Platform"}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-500">Workspace</div>
                        <div className="mt-1 text-gray-900">{review.workspaceLabel}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-500">Created</div>
                        <div className="mt-1 text-gray-900">{formatAdminDate(review.createdAt)}</div>
                      </div>
                      <div className="md:col-span-2 xl:col-span-4">
                        <div className="font-semibold text-gray-500">Comment</div>
                        <div className="mt-1 line-clamp-3 text-gray-900">
                          {review.publicComment || review.comment || "No comment left."}
                        </div>
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/control/reviews/${review.id}?kind=${kind}`}
                    className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                  >
                    View review
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-3">
          <Link href={kindHref(kind, Math.max(1, safePage - 1))} className="rounded-full border px-4 py-2 text-sm font-semibold text-gray-700">
            Previous
          </Link>
          <div className="text-sm font-semibold text-gray-600">
            Page {safePage} of {totalPages}
          </div>
          <Link href={kindHref(kind, Math.min(totalPages, safePage + 1))} className="rounded-full border px-4 py-2 text-sm font-semibold text-gray-700">
            Next
          </Link>
        </div>
      ) : null}
    </div>
  )
}
