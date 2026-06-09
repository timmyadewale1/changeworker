"use client"

import { motion } from "framer-motion"

type FancyLoaderProps = {
  label?: string
  compact?: boolean
}

export default function FancyLoader({
  label = "Loading your workspace...",
  compact = false,
}: FancyLoaderProps) {
  return (
    <div
      className={`flex items-center justify-center px-4 ${compact ? "py-6" : "min-h-[calc(100vh-64px)] bg-[var(--secondary)]"}`}
    >
      <div className={`w-full ${compact ? "max-w-sm" : "max-w-md"}`}>
        <div className="relative overflow-hidden rounded-3xl border bg-white p-6 shadow-sm">
          <motion.div
            aria-hidden
            className="absolute -top-24 -right-24 h-56 w-56 rounded-full bg-orange-200/30 blur-3xl"
            animate={{ y: [0, 10, 0], x: [0, -10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-orange-300/20 blur-3xl"
            animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative">
            <div className="text-xl font-extrabold text-[var(--primary)]">Changeworker</div>
            <div className="mt-1 text-sm text-gray-600">{label}</div>

            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <motion.div
                className="h-full rounded-full bg-[var(--primary)]"
                initial={{ x: "-60%" }}
                animate={{ x: "120%" }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                style={{ width: "45%" }}
              />
            </div>

            <div className="mt-6 flex items-center gap-2">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]"
                  animate={{ opacity: [0.35, 1, 0.35], y: [0, -4, 0] }}
                  transition={{
                    duration: 0.9,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.12,
                  }}
                />
              ))}
              <span className="ml-2 text-xs text-gray-500">Almost there...</span>
            </div>
          </div>
        </div>

        <div className="mt-4 text-center text-xs text-gray-500">Impact-first marketplace · Nigeria</div>
      </div>
    </div>
  )
}
