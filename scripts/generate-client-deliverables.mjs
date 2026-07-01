import fs from "node:fs"
import path from "node:path"
import { Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, PageBreak } from "docx"
import ExcelJS from "exceljs"

const root = process.cwd()
const docsDir = path.join(root, "docs")
const outputDir = path.join(docsDir, "client-deliverables")
const screenshotsDir = "C:/Users/ADMIN/Pictures/Screenshots"

fs.mkdirSync(outputDir, { recursive: true })

const FONT = "Century Gothic"
const RED = "C00000"
const BLACK = "000000"

const reportMdPath = path.join(docsDir, "platform-workflow-report.md")
const reportMd = fs.existsSync(reportMdPath)
  ? fs.readFileSync(reportMdPath, "utf8")
  : "# Changeworker Platform Workflow Report\n\nReport source not found."

function textRun(text, opts = {}) {
  return new TextRun({
    text,
    font: FONT,
    color: opts.color ?? BLACK,
    bold: opts.bold ?? false,
    size: opts.size ?? 24,
  })
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { after: opts.after ?? 160, before: opts.before ?? 0, line: opts.line ?? 320 },
    children: [textRun(text, opts)],
  })
}

function parseMarkdownToParagraphs(md) {
  const lines = md.split(/\r?\n/)
  const out = []

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line.trim()) {
      out.push(new Paragraph({ spacing: { after: 120 } }))
      continue
    }
    if (line.startsWith("# ")) {
      out.push(
        p(line.slice(2).trim(), {
          color: RED,
          bold: true,
          size: 42,
          after: 260,
          before: 120,
          line: 360,
        })
      )
      continue
    }
    if (line.startsWith("## ")) {
      out.push(
        p(line.slice(3).trim(), {
          color: RED,
          bold: true,
          size: 32,
          after: 220,
          before: 180,
          line: 340,
        })
      )
      continue
    }
    if (line.startsWith("### ")) {
      out.push(
        p(line.slice(4).trim(), {
          color: BLACK,
          bold: true,
          size: 28,
          after: 170,
          before: 120,
          line: 330,
        })
      )
      continue
    }
    if (/^\d+\.\s+/.test(line)) {
      out.push(p(line, { color: BLACK, size: 24, after: 110 }))
      continue
    }
    if (line.startsWith("- ")) {
      out.push(p(`• ${line.slice(2).trim()}`, { color: BLACK, size: 24, after: 90 }))
      continue
    }
    out.push(p(line, { color: BLACK, size: 24, after: 110 }))
  }
  return out
}

async function generateWorkflowDocx() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: parseMarkdownToParagraphs(reportMd),
      },
    ],
  })

  const buf = await Packer.toBuffer(doc)
  const file = path.join(outputDir, "Changeworker-Platform-Workflow-Report.docx")
  fs.writeFileSync(file, buf)
  return file
}

function sopBlock(title, steps) {
  const paragraphs = [
    p(title, { color: RED, bold: true, size: 34, before: 260, after: 180 }),
  ]
  for (const step of steps) {
    paragraphs.push(
      p(`Step ${step.no}: ${step.title}`, {
        color: BLACK,
        bold: true,
        size: 26,
        after: 90,
        before: 120,
      })
    )
    paragraphs.push(p(step.body, { color: BLACK, size: 24, after: 140, line: 340 }))
  }
  return paragraphs
}

async function generateSopDocx() {
  const intro = [
    p("Changeworker Role-Based Training SOP", {
      color: RED,
      bold: true,
      size: 42,
      after: 220,
    }),
    p("Standard Operating Procedure for Talent, Client, and Control (Admin) users", {
      color: BLACK,
      size: 24,
      after: 120,
    }),
    p("Version: 1.0 | Date: June 29, 2026", { color: BLACK, size: 22, after: 260 }),
    p(
      "Purpose: This SOP helps each role understand exactly what to do on the platform, in what order to do it, and what result to expect after each action.",
      { color: BLACK, size: 24, after: 220 }
    ),
  ]

  const talentSteps = [
    {
      no: 1,
      title: "Create account and complete onboarding",
      body:
        "Go to Sign Up, create your account, verify your email if required, then complete onboarding as Talent. Add role details, skills, location, and SDG focus. This makes your profile discoverable and activates your dashboard.",
    },
    {
      no: 2,
      title: "Set up profile quality and wallet readiness",
      body:
        "Open your profile page and complete core details, then open wallet page and add bank details. This is important because approved work and payout flow depend on complete profile and payout setup.",
    },
    {
      no: 3,
      title: "Find gigs and submit strong proposals",
      body:
        "Use Find Work to open relevant gigs, review scope and budget, then submit proposal with clear cover letter and attachments if needed. Keep proposal practical and outcome-focused so the client can evaluate quickly.",
    },
    {
      no: 4,
      title: "Track proposal outcomes and messages",
      body:
        "Monitor Proposals page for status changes (submitted, shortlisted, accepted, rejected). Once shortlisted or accepted, continue communication in Messages and align scope with the client.",
    },
    {
      no: 5,
      title: "Deliver through workspace",
      body:
        "In Workspace, submit milestones on time, then submit final work with complete files and notes. For hourly workspaces, follow hour/session check-in rules correctly so records remain valid.",
    },
    {
      no: 6,
      title: "Request payout and monitor wallet",
      body:
        "After approval points are reached, request payout when enabled. Track movement in wallet history and confirm final transfer status. Raise a dispute only when a clear delivery or payment disagreement exists.",
    },
  ]

  const clientSteps = [
    {
      no: 1,
      title: "Create account and complete onboarding as Client",
      body:
        "Sign up, verify account as needed, and choose Client during onboarding. Add organization details and SDG focus. This configures your dashboard for hiring operations.",
    },
    {
      no: 2,
      title: "Post a complete gig with the right hiring setup",
      body:
        "Use Post Gig and provide category, budget type, required skills, SDG tags, timeline, and number of hires needed. Clear gig information improves proposal quality and reduces delivery confusion later.",
    },
    {
      no: 3,
      title: "Review proposals and select talent",
      body:
        "Open the gig proposals page, filter/search proposals, review cover letters and attachments, then shortlist or accept the best match. Use rejection only when clearly misaligned.",
    },
    {
      no: 4,
      title: "Move to communication and workspace execution",
      body:
        "Use Messages to align final expectations. In Workspace, fund work through wallet or Paystack path, then monitor milestone submissions and final work delivery.",
    },
    {
      no: 5,
      title: "Approve or decline with clear reason",
      body:
        "When milestones/final work are submitted, approve if deliverables are complete or decline with clear feedback when changes are required. This keeps delivery loop professional and traceable.",
    },
    {
      no: 6,
      title: "Close work, review, and escalate only when necessary",
      body:
        "After successful completion, finalize payment flow and leave review. If there is a major unresolved issue, open dispute from workspace so admin can review evidence and resolve settlement.",
    },
  ]

  const adminSteps = [
    {
      no: 1,
      title: "Access Control dashboard and monitor platform health",
      body:
        "Login through /control/login and start with Control dashboard. Review counts, queue cards, and system wellness checks to detect operations or infrastructure issues early.",
    },
    {
      no: 2,
      title: "Run daily operational checks",
      body:
        "Review users, talents, clients, gigs, proposals, transactions, wallets, support, and notifications. Prioritize queues with dispute, payment, and withdrawal urgency.",
    },
    {
      no: 3,
      title: "Handle trust and safety decisions",
      body:
        "In dispute pages, inspect case history (messages, evidence, workspace records, payment state) before making a final action. Keep decisions evidence-based and documented.",
    },
    {
      no: 4,
      title: "Apply settlement actions correctly",
      body:
        "Resolve disputes through release to talent, refund to client, partial settlement, or close-case action. Confirm ledger and wallet records update after each resolution.",
    },
    {
      no: 5,
      title: "Manage support and communication quality",
      body:
        "Use support inbox and message review to unblock users quickly. Keep communication factual, concise, and linked to the right operational record.",
    },
    {
      no: 6,
      title: "Maintain reporting and governance",
      body:
        "Use analytics and transaction pages for trend monitoring, payout oversight, and accountability. Escalate recurring risk patterns to product/engineering for preventive fixes.",
    },
  ]

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          ...intro,
          ...sopBlock("Talent SOP", talentSteps),
          ...sopBlock("Client SOP", clientSteps),
          ...sopBlock("Control/Admin SOP", adminSteps),
        ],
      },
    ],
  })

  const buf = await Packer.toBuffer(doc)
  const file = path.join(outputDir, "Changeworker-Role-Based-Training-SOP.docx")
  fs.writeFileSync(file, buf)
  return file
}

async function generateQaChecklistXlsx() {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet("QA Checklist by Route")

  const columns = [
    { header: "Role", key: "role", width: 16 },
    { header: "Route", key: "route", width: 36 },
    { header: "Test Objective", key: "objective", width: 42 },
    { header: "Step-by-Step Test", key: "steps", width: 58 },
    { header: "Expected Result", key: "expected", width: 48 },
    { header: "Clickable Link", key: "link", width: 44 },
  ]
  ws.columns = columns

  const rows = [
    ["Public", "/", "Landing page renders", "Open home page, scroll hero, CTA, footer links", "No overflow, CTA and navigation work", "/"],
    ["Public", "/login", "User login flow", "Submit valid credentials; test Google sign-in button", "User enters dashboard or onboarding", "/login"],
    ["Public", "/signup", "User signup flow", "Create account with email; validate error handling", "Account created and verification path shown", "/signup"],
    ["Public", "/onboarding", "Role onboarding", "Complete as talent and client separately", "Role-specific dashboard behavior", "/onboarding"],
    ["Talent", "/dashboard", "Talent dashboard metrics", "Check recommendations, proposals, messages, wallet summary", "Counts and cards load correctly", "/dashboard"],
    ["Talent", "/dashboard/find-work", "Gig discovery", "Filter/search and open multiple gig detail pages", "Results and details match filters", "/dashboard/find-work"],
    ["Talent", "/dashboard/find-work/[id]", "Proposal submission", "Submit proposal with attachments", "Proposal status appears in proposals page", "/dashboard/find-work"],
    ["Talent", "/dashboard/proposals", "Proposal status tracking", "Open statuses and detail page", "Submitted/accepted/rejected states update", "/dashboard/proposals"],
    ["Talent", "/dashboard/messages", "Thread listing", "Open threads and send message", "New message appears in thread and recipient view", "/dashboard/messages"],
    ["Talent", "/dashboard/workspaces", "Workspace list", "Open active workspaces and verify title formatting", "Workspace entries use readable names", "/dashboard/workspaces"],
    ["Talent", "/dashboard/workspaces/[id]", "Milestone/final work flow", "Submit milestone and final work", "Client can review and approve/decline", "/dashboard/workspaces"],
    ["Talent", "/dashboard/wallet", "Withdrawal flow", "Set bank, request withdrawal", "Record enters completed/expected status correctly", "/dashboard/wallet"],
    ["Client", "/dashboard", "Client dashboard metrics", "Check gigs, proposals, workspaces, wallet summary", "All summary cards load accurate values", "/dashboard"],
    ["Client", "/dashboard/post-gig", "Gig posting", "Create gig with category, budget, hires needed", "Gig appears in gigs list with proper fields", "/dashboard/post-gig"],
    ["Client", "/dashboard/gigs", "Gig management", "Open created gig and edit details", "Updates persist on refresh", "/dashboard/gigs"],
    ["Client", "/dashboard/gigs/[id]/proposals", "Proposal decisioning", "Shortlist, accept, reject proposal", "Status updates and notifications fire", "/dashboard/gigs"],
    ["Client", "/dashboard/workspaces/[id]", "Funding + approvals", "Fund workspace, approve/decline milestones and final work", "Payment and status updates are consistent", "/dashboard/workspaces"],
    ["Client", "/dashboard/wallet", "Wallet top-up + use", "Fund wallet and apply wallet to workspace funding", "Balance and transaction history update correctly", "/dashboard/wallet"],
    ["Control", "/control/login", "Admin authentication", "Login with admin account", "Control dashboard is accessible", "/control/login"],
    ["Control", "/control/dashboard", "Operations overview", "Check quick links, queues, system wellness refresh", "Dashboard cards and wellness data load", "/control/dashboard"],
    ["Control", "/control/users", "User oversight", "Open users and navigate to talent/client profiles", "Role-aware navigation works", "/control/users"],
    ["Control", "/control/gigs", "Gig oversight", "Open gig detail and linked proposals/workspaces", "Cross-page links resolve correctly", "/control/gigs"],
    ["Control", "/control/workspaces", "Workspace oversight", "Open workspace detail and review linked records", "Settlement and file records are visible", "/control/workspaces"],
    ["Control", "/control/disputes", "Dispute queue", "Open open/under-review/resolved tabs", "Queue counts and filtering are correct", "/control/disputes"],
    ["Control", "/control/disputes/[id]", "Dispute resolution", "Resolve with each action type in test cases", "Wallet/ledger/status updates match action", "/control/disputes"],
    ["Control", "/control/transactions", "Financial monitoring", "Filter by type and search references", "Pagination and filters return correct records", "/control/transactions"],
    ["Control", "/control/wallets", "Wallet oversight", "Open user wallet detail pages", "Client/talent wallet views show role-specific fields", "/control/wallets"],
    ["Control", "/control/support", "Support handling", "Open and reply to support threads", "Conversation updates and unread counts sync", "/control/support"],
  ]

  ws.addRow(["Changeworker QA Checklist by Route", "", "", "", "", ""])
  ws.mergeCells("A1:F1")
  const title = ws.getCell("A1")
  title.font = { name: FONT, size: 14, bold: true, color: { argb: `FF${RED}` } }
  title.alignment = { vertical: "middle", horizontal: "left" }

  ws.addRow(columns.map((c) => c.header))
  ws.getRow(2).font = { name: FONT, bold: true, color: { argb: `FF${RED}` } }
  ws.getRow(2).alignment = { vertical: "middle", wrapText: true }
  ws.getRow(2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFFCEAEA" } }

  for (const row of rows) {
    const [role, route, objective, steps, expected, r] = row
    const url = `https://changeworker.ng${r}`
    const newRow = ws.addRow([role, route, objective, steps, expected, url])
    newRow.font = { name: FONT, size: 10, color: { argb: `FF${BLACK}` } }
    newRow.alignment = { vertical: "top", wrapText: true }
    const linkCell = newRow.getCell(6)
    linkCell.value = { text: url, hyperlink: url }
    linkCell.font = { name: FONT, size: 10, color: { argb: "FF0563C1" }, underline: true }
  }

  ws.views = [{ state: "frozen", ySplit: 2 }]
  ws.autoFilter = { from: "A2", to: "F2" }

  const file = path.join(outputDir, "Changeworker-Clickable-QA-Checklist-by-Route.xlsx")
  await wb.xlsx.writeFile(file)
  return file
}

function getScreenshotCandidates() {
  if (!fs.existsSync(screenshotsDir)) return []
  return fs
    .readdirSync(screenshotsDir)
    .filter((f) => f.toLowerCase().endsWith(".png"))
    .map((name) => {
      const fullPath = path.join(screenshotsDir, name)
      const stat = fs.statSync(fullPath)
      return { name, fullPath, mtime: stat.mtimeMs }
    })
    .sort((a, b) => b.mtime - a.mtime)
}

function imageTypeForDocx(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  if (ext === ".png") return "png"
  if (ext === ".jpg" || ext === ".jpeg") return "jpg"
  if (ext === ".gif") return "gif"
  if (ext === ".bmp") return "bmp"
  return "png"
}

async function generateOnboardingDeckDocx() {
  const screenshots = getScreenshotCandidates().slice(0, 10)

  const deckSections = [
    {
      title: "1) Public Entry and Account Start",
      bullets: [
        "Visitors land on homepage and choose Hire Talent or Find Work.",
        "Sign up/login flows route users into onboarding.",
        "Onboarding defines role behavior for dashboard and feature access.",
        "Public pages provide trust, policy, and support context before conversion.",
      ],
      image: screenshots[0]?.fullPath,
    },
    {
      title: "2) Talent Operating Flow",
      bullets: [
        "Talent discovers gigs, submits proposal, tracks status updates.",
        "Messages and workspace become active after acceptance.",
        "Talent submits milestones/final work and requests payout.",
        "Wallet records earnings and withdrawal history.",
      ],
      image: screenshots[1]?.fullPath,
    },
    {
      title: "3) Client Operating Flow",
      bullets: [
        "Client posts gig with budget, hires needed, and requirements.",
        "Client reviews proposals, shortlists/accepts best match.",
        "Workspace funding and approval actions control payout release.",
        "Client wallet supports top-up and project funding continuity.",
      ],
      image: screenshots[2]?.fullPath,
    },
    {
      title: "4) Control/Admin Operations",
      bullets: [
        "Control dashboard centralizes counts, queues, and wellness checks.",
        "Admin reviews users, gigs, workspaces, wallets, transactions, support.",
        "Dispute module enables evidence-based resolution actions.",
        "Admin alerts focus on critical money and trust events.",
      ],
      image: screenshots[3]?.fullPath,
    },
    {
      title: "5) Dispute and Settlement Logic",
      bullets: [
        "Dispute starts from workspace when delivery/payment conflict occurs.",
        "Admin reviews evidence, messages, payment records, and milestones.",
        "Resolution outcomes: release talent, refund client, split settlement, close case.",
        "Wallets, ledgers, statuses, and notifications update after decision.",
      ],
      image: screenshots[4]?.fullPath,
    },
    {
      title: "6) Owner Go-Live Checklist",
      bullets: [
        "Validate onboarding for both talent and client accounts.",
        "Run full gig-to-workspace-to-payout test using QA checklist.",
        "Confirm control access and dispute resolution end-to-end.",
        "Track first-week support and queue health daily.",
      ],
      image: screenshots[5]?.fullPath,
    },
  ]

  const children = [
    p("Changeworker Project Owner Onboarding Deck", {
      color: RED,
      bold: true,
      size: 42,
      after: 240,
      before: 120,
    }),
    p("Simple walkthrough of platform operations and owner checkpoints", {
      color: BLACK,
      size: 24,
      after: 120,
    }),
    p("Prepared: June 29, 2026", { color: BLACK, size: 22, after: 220 }),
    new Paragraph({ children: [new PageBreak()] }),
  ]

  for (const section of deckSections) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_1,
        spacing: { before: 120, after: 180 },
        children: [textRun(section.title, { color: RED, bold: true, size: 34 })],
      })
    )
    for (const bullet of section.bullets) {
      children.push(p(`• ${bullet}`, { color: BLACK, size: 24, after: 90 }))
    }

    if (section.image && fs.existsSync(section.image)) {
      const imgBuffer = fs.readFileSync(section.image)
      children.push(
        new Paragraph({
          spacing: { before: 180, after: 120 },
          children: [
            new ImageRun({
              data: imgBuffer,
              type: imageTypeForDocx(section.image),
              transformation: { width: 620, height: 350 },
            }),
          ],
        })
      )
      children.push(
        p(`Screenshot: ${path.basename(section.image)}`, {
          color: BLACK,
          size: 18,
          after: 180,
        })
      )
    } else {
      children.push(
        p("Screenshot placeholder: no image found for this section.", {
          color: BLACK,
          size: 20,
          after: 160,
        })
      )
    }

    children.push(new Paragraph({ children: [new PageBreak()] }))
  }

  children.push(
    p("Delivery Pack Included", {
      color: RED,
      bold: true,
      size: 32,
      after: 180,
      before: 120,
    }),
    p("• Platform workflow report", { color: BLACK, size: 24, after: 80 }),
    p("• Role-based training SOP (Talent, Client, Control)", { color: BLACK, size: 24, after: 80 }),
    p("• Clickable QA checklist by route", { color: BLACK, size: 24, after: 80 }),
    p("• Onboarding deck document with screenshots", { color: BLACK, size: 24, after: 140 })
  )

  const doc = new Document({
    sections: [{ properties: {}, children }],
  })

  const buf = await Packer.toBuffer(doc)
  const file = path.join(outputDir, "Changeworker-Project-Owner-Onboarding-Deck.docx")
  fs.writeFileSync(file, buf)
  return file
}

async function main() {
  const outputs = []
  outputs.push(await generateWorkflowDocx())
  outputs.push(await generateSopDocx())
  outputs.push(await generateQaChecklistXlsx())
  outputs.push(await generateOnboardingDeckDocx())

  console.log("Generated deliverables:")
  for (const out of outputs) console.log(`- ${out}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
