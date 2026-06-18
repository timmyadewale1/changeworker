"use client"

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { applyActionCode, confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth"
import { auth } from "@/lib/firebase"
import Navbar from "@/components/layout/Navbar"
import Button from "@/components/ui/Button"
import toast from "react-hot-toast"

type StepState = "loading" | "ready" | "done" | "error"

function AuthActionContent() {
  const params = useSearchParams()
  const router = useRouter()
  const mode = params.get("mode")
  const oobCode = params.get("oobCode")
  const continueUrl = params.get("continueUrl")

  const [state, setState] = useState<StepState>("loading")
  const [errorText, setErrorText] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    let active = true
    const run = async () => {
      if (!oobCode || !mode) {
        if (!active) return
        setErrorText("This link is invalid or incomplete.")
        setState("error")
        return
      }

      try {
        if (mode === "verifyEmail") {
          await applyActionCode(auth, oobCode)
          if (!active) return
          setState("done")
          toast.success("Email verified successfully.")
          setTimeout(() => router.replace(continueUrl || "/login?verified=1"), 900)
          return
        }

        if (mode === "resetPassword") {
          const resolvedEmail = await verifyPasswordResetCode(auth, oobCode)
          if (!active) return
          setEmail(resolvedEmail)
          setState("ready")
          return
        }

        setErrorText("Unsupported action mode.")
        setState("error")
      } catch (error: any) {
        if (!active) return
        setErrorText(error?.message || "This link is invalid or expired.")
        setState("error")
      }
    }

    run()
    return () => {
      active = false
    }
  }, [mode, oobCode, continueUrl, router])

  const isResetMode = mode === "resetPassword"

  const statusTitle = useMemo(() => {
    if (state === "loading") return "Validating link..."
    if (state === "done") return "Success"
    if (state === "error") return "Action failed"
    return "Reset your password"
  }, [state])

  const onSubmitReset = async (e: FormEvent) => {
    e.preventDefault()
    if (!oobCode) return
    if (!password || password.length < 6) {
      toast.error("Password must be at least 6 characters.")
      return
    }
    if (password !== confirm) {
      toast.error("Passwords do not match.")
      return
    }

    setSubmitting(true)
    try {
      await confirmPasswordReset(auth, oobCode, password)
      toast.success("Password reset successful. Please log in.")
      setState("done")
      setTimeout(() => router.replace(continueUrl || "/login?reset=1"), 700)
    } catch (error: any) {
      setErrorText(error?.message || "Could not reset password.")
      setState("error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-extrabold text-gray-900">{statusTitle}</h1>

      {state === "loading" && (
        <p className="mt-3 text-sm text-gray-600">Please wait while we verify your secure link.</p>
      )}

      {state === "done" && (
        <p className="mt-3 text-sm text-gray-600">
          {isResetMode ? "Your new password has been saved." : "Your email is now verified."} Redirecting...
        </p>
      )}

      {state === "error" && (
        <>
          <p className="mt-3 text-sm text-red-600">{errorText || "This action could not be completed."}</p>
          <div className="mt-5">
            <Button onClick={() => router.push("/login")}>Go to login</Button>
          </div>
        </>
      )}

      {state === "ready" && isResetMode && (
        <form className="mt-5 space-y-4" onSubmit={onSubmitReset}>
          <p className="text-sm text-gray-600">
            Resetting password for <span className="font-semibold text-gray-900">{email}</span>
          </p>
          <input
            type="password"
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full rounded-md border px-3 py-2 text-sm"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <Button disabled={submitting}>{submitting ? "Saving..." : "Save new password"}</Button>
        </form>
      )}
    </div>
  )
}

export default function AuthActionPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-[calc(100vh-110px)] bg-[var(--secondary)] px-4 py-12">
        <Suspense
          fallback={
            <div className="mx-auto max-w-md rounded-2xl border bg-white p-6 shadow-sm">
              <h1 className="text-2xl font-extrabold text-gray-900">Validating link...</h1>
              <p className="mt-3 text-sm text-gray-600">Please wait while we verify your secure link.</p>
            </div>
          }
        >
          <AuthActionContent />
        </Suspense>
      </main>
    </>
  )
}
