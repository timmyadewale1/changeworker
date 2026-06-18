import { NextResponse } from "next/server"
import { getAdminApp } from "@/lib/firebaseAdmin"
import { sendEmail } from "@/lib/email/sendEmail"
import { buildAuthActionLink, buildAuthEmailTemplate, extractOobCode } from "@/lib/email/authEmailTemplate"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("authorization") || ""
    const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : ""
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const adminApp = getAdminApp()
    const decoded = await adminApp.auth().verifyIdToken(token)
    const email = decoded.email
    if (!email) return NextResponse.json({ error: "Email missing on account" }, { status: 400 })

    const continueUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://changeworker.ng"}/login?verified=1`
    const firebaseLink = await adminApp.auth().generateEmailVerificationLink(email, { url: continueUrl })
    const oobCode = extractOobCode(firebaseLink)
    if (!oobCode) return NextResponse.json({ error: "Could not generate verification code" }, { status: 500 })

    const actionUrl = buildAuthActionLink("verifyEmail", oobCode, continueUrl)
    const html = buildAuthEmailTemplate({
      title: "Verify your email",
      body: "Confirm your changeworker email to secure your account and continue onboarding.",
      ctaText: "Verify email",
      actionUrl,
      supportText: "This link expires automatically. If it expires, request a new verification email from your dashboard.",
    })

    await sendEmail({
      to: email,
      subject: "Verify your changeworker email",
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error("[/api/auth/send-verification]", error)
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 })
  }
}
