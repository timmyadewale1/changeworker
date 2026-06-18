"use client"

import { useState } from "react"
import Navbar from "@/components/layout/Navbar"
import Button from "@/components/ui/Button"
import toast from "react-hot-toast"
import { makeAttemptGuard } from "@/lib/attemptThrottle"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const resetGuard = makeAttemptGuard("cw_reset_attempt_at", 60_000)

  const handleReset = async () => {
    if (!email) return toast.error("Enter your email")
    const attempt = resetGuard.canAttempt()
    if (!attempt.ok) {
      toast.error(`Please wait ${attempt.seconds}s before requesting another reset.`)
      return
    }
    setLoading(true)
    try {
      const resp = await fetch("/api/auth/send-password-reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (!resp.ok) {
        const json = await resp.json().catch(() => ({}))
        throw new Error(json?.error || "Could not send reset email")
      }
      toast.success("Password reset email sent!")
    } catch (err: any) {
      toast.error(err?.message || "Could not send reset email")
      resetGuard.markAttempt()
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-120px)] flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-sm p-6 border">
          <h1 className="text-2xl font-bold mb-2">Forgot password</h1>
          <p className="text-sm text-gray-600 mb-6">
            Enter your email and we’ll send you a reset link.
          </p>

          <input
            type="email"
            placeholder="Email address"
            className="w-full border rounded-md px-3 py-2 text-sm mb-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button onClick={handleReset}>
            {loading ? "Sending..." : "Send reset link"}
          </Button>
        </div>
      </div>
    </>
  )
}
