import { NextResponse } from "next/server"
import { getAdminDb, getAdminApp } from "@/lib/firebaseAdmin"
import { FieldValue } from "firebase-admin/firestore"
import { notifyUser } from "@/lib/notifications/sendPlatformNotification"

export async function POST(req: Request) {
  try {
    const adminDb = getAdminDb()
    const adminApp = getAdminApp()

    const authHeader = req.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.slice(7)
    const decoded = await adminApp.auth().verifyIdToken(token)
    const userId = decoded.uid

    const { disputeId, senderId, message, attachments } = await req.json()
    const trimmedMessage = typeof message === "string" ? message.trim() : ""
    const normalizedAttachments = Array.isArray(attachments)
      ? attachments
          .filter(
            (attachment) =>
              attachment &&
              typeof attachment === "object" &&
              typeof attachment.name === "string" &&
              typeof attachment.url === "string" &&
              typeof attachment.storagePath === "string"
          )
          .slice(0, 5)
      : []

    if (!disputeId || !senderId || !trimmedMessage) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (trimmedMessage.length > 2000) {
      return NextResponse.json({ error: "Message is too long" }, { status: 400 })
    }

    // Validate user is part of the dispute
    const disputeRef = adminDb.collection("disputes").doc(disputeId)
    const dispute = (await disputeRef.get()).data()

    if (!dispute) {
      return NextResponse.json({ error: "Dispute not found" }, { status: 404 })
    }

    const clientUid = dispute.clientUid || dispute.clientId
    const talentUid = dispute.talentUid || dispute.talentId

    if (clientUid !== userId && talentUid !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    await adminDb.collection("disputeMessages").add({
      disputeId,
      senderId: userId,
      message: trimmedMessage,
      attachments: normalizedAttachments,
      createdAt: FieldValue.serverTimestamp()
    })

    // Notify the other party
    const otherUserId = clientUid === userId ? talentUid : clientUid
    await notifyUser({
      userId: otherUserId,
      type: "dispute_message",
      title: "New dispute message",
      message: "You have a new message in your dispute",
      link: `/dashboard/disputes/${disputeId}`
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Send message error:", error)
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 })
  }
}
