"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { COOKIE_NAMES, getJsonCookie, setJsonCookie } from "@/lib/cookies"

type SearchType = "talent" | "job"
type PrefsCookie = { searchType?: SearchType }

const SearchContext = createContext<any>(null)

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState("")
  const [type, setType] = useState<SearchType>(() => {
    if (typeof window === "undefined") return "talent"
    return getJsonCookie<PrefsCookie>(COOKIE_NAMES.prefs, {}).searchType || "talent"
  })

  useEffect(() => {
    setJsonCookie(
      COOKIE_NAMES.prefs,
      { ...getJsonCookie<PrefsCookie>(COOKIE_NAMES.prefs, {}), searchType: type },
      { maxAge: 60 * 60 * 24 * 365 }
    )
  }, [type])

  return (
    <SearchContext.Provider
      value={{ query, setQuery, type, setType }}
    >
      {children}
    </SearchContext.Provider>
  )
}

export const useSearch = () => useContext(SearchContext)
