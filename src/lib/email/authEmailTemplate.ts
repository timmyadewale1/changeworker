function appBaseUrl() {
  return process.env.NEXT_PUBLIC_APP_URL || "https://changeworker.ng"
}

export function buildAuthActionLink(mode: "verifyEmail" | "resetPassword", oobCode: string, continueUrl?: string) {
  const url = new URL("/auth/action", appBaseUrl())
  url.searchParams.set("mode", mode)
  url.searchParams.set("oobCode", oobCode)
  if (continueUrl) {
    url.searchParams.set("continueUrl", continueUrl)
  }
  return url.toString()
}

export function buildAuthEmailTemplate({
  title,
  body,
  ctaText,
  actionUrl,
  supportText,
}: {
  title: string
  body: string
  ctaText: string
  actionUrl: string
  supportText: string
}) {
  const brandUrl = appBaseUrl()
  const logoUrl = `${brandUrl.replace(/\/+$/, "")}/logo.png`

  return `
  <!doctype html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
    </head>
    <body style="margin:0;padding:24px;background:#f8fafc;font-family:Inter,Segoe UI,Tahoma,Geneva,Verdana,sans-serif;color:#1f2937;">
      <div style="max-width:680px;margin:0 auto;">
        <div style="border:1px solid #e5e7eb;border-radius:28px;overflow:hidden;background:#ffffff;box-shadow:0 18px 42px rgba(15,23,42,0.08);">
          <div style="padding:26px 28px 22px;border-bottom:1px solid #e5e7eb;background:#ffffff;">
            <div style="display:flex;align-items:center;gap:14px;">
              <div style="height:52px;width:52px;border-radius:18px;background:#fff7ed;border:1px solid #fed7aa;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                <img src="${logoUrl}" alt="changeworker" style="height:28px;width:28px;object-fit:contain;display:block;" />
              </div>
              <div style="min-width:0;">
                <div style="font-size:21px;line-height:1.15;font-weight:800;color:#111827;margin:0;">changeworker</div>
                <div style="font-size:12px;line-height:1.5;color:#9a3412;font-weight:600;letter-spacing:.04em;text-transform:uppercase;margin-top:2px;">Account security</div>
              </div>
            </div>
          </div>
          <div style="padding:30px 28px 32px;">
            <div style="font-size:28px;line-height:1.18;font-weight:800;color:#111827;letter-spacing:-0.03em;">${title}</div>
            <div style="margin-top:18px;padding:22px 24px;border-radius:22px;background:#f9fafb;border:1px solid #e5e7eb;font-size:16px;line-height:1.75;color:#374151;">
              ${body}
            </div>
            <div style="margin-top:28px;">
              <a href="${actionUrl}" style="display:inline-flex;align-items:center;justify-content:center;padding:14px 22px;background:#f97316;color:#ffffff;text-decoration:none;border-radius:999px;font-weight:700;font-size:14px;box-shadow:0 10px 24px rgba(249,115,22,0.24);">${ctaText}</a>
            </div>
            <div style="margin-top:18px;font-size:12px;color:#6b7280;line-height:1.7;">
              ${supportText}
            </div>
          </div>
          <div style="padding:18px 28px;background:#0f172a;color:#cbd5e1;font-size:12px;line-height:1.8;">
            If this was not you, secure your account immediately and contact support@changeworker.ng or operations@changeworker.ng.
          </div>
        </div>
      </div>
    </body>
  </html>
  `
}

export function extractOobCode(link: string) {
  try {
    const parsed = new URL(link)
    return parsed.searchParams.get("oobCode") || ""
  } catch {
    return ""
  }
}
