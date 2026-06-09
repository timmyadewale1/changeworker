const DEFAULT_COOLDOWN_MS = 15000

type AttemptResult =
  | { ok: true }
  | { ok: false; seconds: number }

export function makeAttemptGuard(storageKey: string, cooldownMs = DEFAULT_COOLDOWN_MS) {
  return {
    canAttempt(): AttemptResult {
      if (typeof window === "undefined") return { ok: true }
      const last = Number(window.localStorage.getItem(storageKey) || 0)
      if (Date.now() - last < cooldownMs) {
        const seconds = Math.ceil((cooldownMs - (Date.now() - last)) / 1000)
        return { ok: false as const, seconds }
      }
      window.localStorage.setItem(storageKey, String(Date.now()))
      return { ok: true as const }
    },
    markAttempt() {
      if (typeof window === "undefined") return
      window.localStorage.setItem(storageKey, String(Date.now()))
    },
  }
}
