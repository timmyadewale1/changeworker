import { NextResponse } from "next/server"
import { getAdminApp } from "@/lib/firebaseAdmin"
import { sendEmail } from "@/lib/email/sendEmail"
import { buildAuthActionLink, buildAuthEmailTemplate, extractOobCode } from "@/lib/email/authEmailTemplate"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as { email?: string }
    const email = String(body?.email || "").trim().toLowerCase()
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const adminApp = getAdminApp()
    const continueUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://changeworker.ng"}/login?reset=1`
    const firebaseLink = await adminApp.auth().generatePasswordResetLink(email, { url: continueUrl })
    const oobCode = extractOobCode(firebaseLink)
    if (!oobCode) {
      return NextResponse.json({ error: "Could not generate reset code" }, { status: 500 })
    }

    const actionUrl = buildAuthActionLink("resetPassword", oobCode, continueUrl)
    const html = buildAuthEmailTemplate({
      title: "Reset your password",
      body: "A password reset was requested for your changeworker account. Use the button below to set a new password.",
      ctaText: "Reset password",
      actionUrl,
      supportText: "If you did not request this reset, you can ignore this email. Your password stays unchanged until you complete this action.",
    })

    await sendEmail({
      to: email,
      subject: "Reset your changeworker password",
      html,
    })

    return NextResponse.json({ ok: true })
  } catch (error: any) {
    console.error("[/api/auth/send-password-reset]", error)
    return NextResponse.json({ error: error?.message || "Server error" }, { status: 500 })
  }
}
