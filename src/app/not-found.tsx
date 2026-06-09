"use client"

import Link from "next/link"
import Navbar from "@/components/layout/Navbar"
import { Search, Home, ArrowLeft, ShieldAlert } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <main className="mx-auto flex min-h-[calc(100vh-73px)] max-w-4xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-[var(--primary)]">
          <ShieldAlert size={28} />
        </div>
        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.22em] text-gray-400">Page not found</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-gray-900 md:text-5xl">
          We couldn’t find that page.
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
          The link may be broken, moved, or typed incorrectly. Use the options below to get back to the platform quickly.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-2xl bg-[var(--primary)] px-5 py-3 text-sm font-bold text-white shadow-[0_12px_28px_rgba(249,115,22,.22)] transition hover:opacity-95"
          >
            <Home size={16} />
            Home
          </Link>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[var(--primary)]"
          >
            <Search size={16} />
            Search
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[var(--primary)]"
          >
            <ArrowLeft size={16} />
            Go back
          </button>
        </div>
      </main>
    </div>
  )
}
