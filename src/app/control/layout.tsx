"use client"

import RequireAdmin from "@/components/control/RequireAdmin"
import AdminNavbar from "@/components/control/AdminNavbar"
import { usePathname } from "next/navigation"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const isAuthPage = pathname === "/control/login" || pathname === "/control/signup"

  if (isAuthPage) {
    return children
  }

  return (
    <RequireAdmin>
      <AdminNavbar />
      <main className="min-h-[calc(100vh-73px)] bg-[var(--secondary)]">
        <div className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">
        {children}
        </div>
      </main>
    </RequireAdmin>
  )
}
