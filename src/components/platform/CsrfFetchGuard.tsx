"use client"

import { useEffect } from "react"
import { COOKIE_NAMES, getCookie } from "@/lib/cookies"

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"])

export default function CsrfFetchGuard() {
  useEffect(() => {
    const originalFetch = window.fetch.bind(window)

    window.fetch = async (input: RequestInfo | URL, init: RequestInit = {}) => {
      const request = input instanceof Request ? input : null
      const method = String(init.method || request?.method || "GET").toUpperCase()
      const url = typeof input === "string" || input instanceof URL ? String(input) : request?.url || ""
      const sameOriginApi = url.startsWith("/") || url.startsWith(window.location.origin)

      if (sameOriginApi && !SAFE_METHODS.has(method)) {
        const headers = new Headers(init.headers || request?.headers || undefined)
        const token = getCookie(COOKIE_NAMES.csrf)
        if (token && !headers.has("x-csrf-token")) {
          headers.set("x-csrf-token", token)
        }
        init = { ...init, headers }
      }

      return originalFetch(input as any, init)
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [])

  return null
}
