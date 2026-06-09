import { sendNotification } from "./sendNotification"
import { sendEmail } from "@/lib/email/sendEmail"
import { getAdminDb } from "@/lib/firebaseAdmin"
import { buildNotificationEmail } from "./template"

export async function notifyUser({
  userId,
  type,
  title,
  message,
  link,
  emailSubject,
  emailHtml,
  sendEmail: shouldSendEmail = true,
}: any) {
  await sendNotification({
    userId,
    type,
    title,
    message,
    link,
  })

  const adminDb = getAdminDb()
  const user = await adminDb.collection("users").doc(userId).get()

  if (user.exists) {
    const email = user.data()?.email
    if (email && shouldSendEmail) {
      const htmlContent = emailHtml || buildNotificationEmail({ title, message, link })
      try {
        await sendEmail({
          to: email,
          subject: emailSubject || title,
          html: htmlContent,
        })
      } catch (err) {
        console.error("notifyUser: sendEmail error", err)
      }
    }
  }
}
