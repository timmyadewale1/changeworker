"use client"

import type { ReactNode } from "react"
import Navbar from "@/components/layout/Navbar"
import Footer from "@/components/layout/Footer"

export function PublicPage({
  children,
  showFooter = true,
}: {
  children: ReactNode
  showFooter?: boolean
}) {
  return (
    <div className="public-page min-h-screen overflow-x-hidden">
      <Navbar />
      <main>{children}</main>
      {showFooter ? <Footer /> : null}
    </div>
  )
}

export function PublicHero({
  kicker,
  title,
  accent,
  subtitle,
  aside,
  actions,
}: {
  kicker?: ReactNode
  title: ReactNode
  accent?: ReactNode
  subtitle?: ReactNode
  aside?: ReactNode
  actions?: ReactNode
}) {
  return (
    <section className="public-hero">
      <div className="public-container">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,.8fr)] lg:items-end">
          <div>
            {kicker ? <div className="mb-6">{kicker}</div> : null}
            <h1 className="public-title">
              {title} {accent ? <span className="public-title-accent">{accent}</span> : null}
            </h1>
            {subtitle ? <div className="public-subtitle mt-6">{subtitle}</div> : null}
            {actions ? <div className="mt-8 flex flex-wrap gap-3">{actions}</div> : null}
          </div>
          {aside ? <div className="public-card p-7">{aside}</div> : null}
        </div>
      </div>
    </section>
  )
}

export function PublicSection({
  kicker,
  title,
  copy,
  children,
  className = "",
}: {
  kicker?: ReactNode
  title?: ReactNode
  copy?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={`public-section ${className}`}>
      <div className="public-container">
        {title ? (
          <div className="public-section-head">
            {kicker ? <div className="mb-4">{kicker}</div> : null}
            <h2 className="public-section-title">{title}</h2>
            {copy ? <div className="public-section-copy">{copy}</div> : null}
          </div>
        ) : null}
        {children}
      </div>
    </section>
  )
}
