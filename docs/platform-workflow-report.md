# Changeworker Platform Workflow Report

Prepared for client handover  
Date: June 29, 2026

This document explains, step by step, how the platform works from the first page a visitor sees to full operations for Talent, Client, and Control (Admin) users. It is written in simple terms and follows the real product flow.

---

## 1. Platform Overview (Simple Summary)

Changeworker is a marketplace for social-impact work. It connects organizations (clients) that need support with professionals (talents) who can deliver that work.  

The platform has four major zones:

1. Public pages (landing page and information pages)
2. Talent experience (find and execute work)
3. Client experience (post and manage gigs)
4. Control/Admin experience (oversight, risk, support, and operations)

The core trust model is:

- clients post gigs
- talent submits proposals
- client accepts and work moves into a workspace
- payment and delivery are tracked in the workspace
- disputes can be raised and resolved with clear payout/refund outcomes

---

## 2. Starting Point: Landing Page and Public Pages

### 2.1 Landing page (`/`)

When users first arrive, they see the homepage with:

- value proposition (what the platform is and who it serves)
- pathways to `Hire Talent` or `Find Work`
- category discovery and search
- trust signals (verification, escrow/workspace flow, impact alignment)
- links to sign up and login

The homepage is designed to quickly direct users into the right side of the platform:

- Talents usually continue toward `Find Work` or `Sign Up`
- Clients usually continue toward `Hire Talent` or `Sign Up`

### 2.2 Public information pages

Users can read:

- About
- How it works
- FAQ
- Contact
- Blog
- Terms
- Privacy

These pages explain the brand, policies, support channels, and legal commitments before users create accounts.

---

## 3. Account Entry Flow (Shared Before Role-Specific Use)

### 3.1 Sign up (`/signup`)

A new user creates an account using:

- email/password, or
- Google sign-in

After account creation:

- a user record is created
- onboarding is marked as incomplete initially
- verification flow is triggered for email-password signups

### 3.2 Verify email (`/verify-email`, `/auth/action`)

For email/password signup, users verify their email through the link sent to them.  
After successful verification, they proceed into onboarding.

### 3.3 Login (`/login`)

At login:

- user signs in with email/password or Google
- verified-email checks apply for email/password users
- session is established
- user is redirected:
  - to onboarding if profile setup is not complete
  - to dashboard if onboarding is already complete

### 3.4 Onboarding (`/onboarding`)

This is where a user chooses account type and basic profile data.

The user selects:

- `Talent` or `Client`

Then fills core details:

- name, location, SDG focus
- role-specific fields

On save:

- `users/{uid}` is updated with role and onboarding completion
- `publicProfiles/{uid}` is created/updated for marketplace discovery
- user is redirected to `/dashboard`

---

## 4. Talent Side: Full Step-by-Step Flow

This section describes a typical talent journey from setup to payout.

### 4.1 Talent dashboard (`/dashboard`)

After onboarding as Talent, the user lands on a role-aware dashboard showing:

- recommended/open opportunities
- proposal activity
- messages
- workspace activity
- wallet summary
- recent cross-app activity

The dashboard acts as command center and links to all talent sub-pages.

### 4.2 Find work (`/dashboard/find-work`)

Talent can:

- browse available gigs
- filter/search opportunities
- open gig details for full context

### 4.3 Gig details and apply (`/dashboard/find-work/[id]`)

On a gig detail page, talent sees:

- gig description and scope
- budget model (hourly/fixed)
- skills needed
- SDG tags
- optional client reference materials

From here, talent can:

- save gig
- apply by submitting proposal
- edit proposal later if it has not yet been viewed by client

Proposal submission includes:

- cover letter
- optional proposed rate and duration
- optional attachments

The proposal is written into gig and user indexes so it can be tracked from both sides.

### 4.4 Proposal tracking (`/dashboard/proposals`, `/dashboard/proposals/[gigId]`)

Talent sees all proposal statuses:

- submitted
- shortlisted
- accepted
- rejected
- withdrawn (where applicable)

If accepted, talent can continue into message/workspace flow for delivery.

### 4.5 Messaging (`/dashboard/messages`, `/dashboard/messages/[threadId]`)

Talent and client communicate in thread-based chat.

Capabilities include:

- sending text messages
- attachments (where enabled in thread flow)
- reading agreement context tied to the work relationship

This keeps all project communication in one auditable place.

### 4.6 Workspace execution (`/dashboard/workspaces`, `/dashboard/workspaces/[id]`)

Once a proposal is accepted and collaboration is active, the workspace is the main delivery environment.

Talent can:

- submit milestones (with notes and files)
- submit final work
- request payout when conditions are met

For hourly workspaces, there is additional hourly session support:

- start, pause, resume workflows
- check-in flow
- hour tracking artifacts

For fixed/hybrid project flows, milestone and final approval states control the delivery lifecycle.

### 4.7 Final work and downloadable files

After approvals, final deliverables are available for proper download (not just preview links).  
The platform stores and serves files with controlled paths so both sides can access the approved outputs.

### 4.8 Wallet and withdrawals (`/dashboard/wallet`)

Talent wallet handles:

- available balance
- pending movement
- withdrawal records
- bank account setup (for payouts)

Withdrawals are initiated through Paystack transfer flow and tracked in wallet history.

### 4.9 Notifications (`/dashboard/notifications`)

Talent receives in-app notifications for major lifecycle events, for example:

- proposal updates
- workspace actions
- payout/dispute events
- message and support-related updates

### 4.10 Dispute participation (`/dashboard/disputes/[id]`)

If a conflict occurs, talent can view the dispute case page and:

- see reason and stage
- add messages
- upload evidence
- monitor final resolution outcome

---

## 5. Client Side: Full Step-by-Step Flow

This section describes the organization/client journey from posting to completion.

### 5.1 Client dashboard (`/dashboard`)

When role is Client, the dashboard emphasizes:

- active/open gigs
- proposal inflow
- suggested talents
- messages and workspaces
- wallet/funding visibility
- recent cross-app activity

### 5.2 Find talent (`/dashboard/find-talent`)

Clients can browse talent profiles and discover suitable professionals by role/capability.

### 5.3 Post a gig (`/dashboard/post-gig`)

Gig posting is structured and detailed. Client sets:

- title
- category group and item (including `Others` path)
- work mode (remote/hybrid/on-site)
- location
- budget type (hourly or fixed)
- budget value
- number of hires needed
- duration
- experience level
- required skills
- SDG tags
- description
- optional attachments/reference materials

This creates the live gig record and index references used by proposal and matching flows.

### 5.4 Manage gigs (`/dashboard/gigs`, `/dashboard/gigs/[id]`)

Client can:

- view all posted gigs
- open each gig detail
- edit gig where needed
- continue into proposal management

### 5.5 Review proposals (`/dashboard/gigs/[id]/proposals`)

Client can:

- review all incoming proposals
- search/filter proposal list
- open each proposal fully (cover letter, rate, duration, files)
- shortlist, accept, or reject proposals

Important operational behavior:

- accepted count is tracked against `hiresNeeded`
- gig can auto-close when required hires are filled
- opening proposal marks it as viewed in tracking flow
- accepted/shortlisted talents can be moved into direct message flow

### 5.6 Messaging and agreement context

Client uses message threads to align scope and coordination.  
Agreement data and workspace context remain connected so decisions are traceable.

### 5.7 Workspace funding and delivery (`/dashboard/workspaces/[id]`)

Client manages project execution by:

- funding workspace (via wallet balance or Paystack route, based on flow)
- reviewing milestone submissions
- approving or declining milestones
- reviewing final work
- approving/declining final work
- approving payout requests when applicable

### 5.8 Client wallet (`/dashboard/wallet`)

Client wallet supports:

- wallet top-up/funding records
- escrow-related movement visibility
- transaction history

Client can keep funds in wallet and use them for workspace funding, instead of always paying directly each time.

### 5.9 Reviews

After completion points, review flows allow feedback and reputation building across participants.

### 5.10 Disputes (`/dashboard/disputes/[id]`)

If delivery/payment disagreement happens, client can:

- raise dispute from workspace flow
- add case details and evidence
- communicate in dispute thread
- track admin decision outcome

---

## 6. Control/Admin Side: Full Step-by-Step Flow

Admin route namespace is now `control` (not `admin`).

### 6.1 Control access

- Login: `/control/login`
- Signup (if used operationally): `/control/signup`

Only users with admin role should access operational pages.

### 6.2 Control dashboard (`/control/dashboard`)

Dashboard provides:

- headline counts (users, gigs, workspaces, disputes)
- operational queues (payout queue, withdrawal queue, support load)
- quick links to all key modules
- system wellness checks with refresh action

System wellness checks cover environment/service readiness so admin can quickly detect platform health issues.

### 6.3 Core admin modules

Admin can access:

- `/control/users` (all users, role and onboarding visibility)
- `/control/talents` and `/control/talents/[uid]`
- `/control/clients` and `/control/clients/[uid]`
- `/control/gigs` and `/control/gigs/[gigId]`
- `/control/proposals` and `/control/proposals/[gigId]/[proposalId]`
- `/control/workspaces` and `/control/workspaces/[id]`
- `/control/messages` and `/control/messages/[threadId]`
- `/control/reviews` and `/control/reviews/[reviewId]`
- `/control/transactions`
- `/control/wallets` and `/control/wallets/[uid]`
- `/control/analytics`
- `/control/notifications`
- `/control/support` and `/control/support/[threadId]`
- `/control/disputes` and `/control/disputes/[id]`

These pages provide both high-level visibility and detail drill-down to related records.

---

## 7. Dispute Resolution Process (End-to-End, Practical)

This is the exact business flow in simple terms.

### 7.1 How dispute starts

A dispute is raised from workspace flow when one party challenges delivery/payment progress.

Dispute records capture:

- who raised it
- workspace involved
- reason and detailed description
- evidence entries
- conversation thread

### 7.2 What admin reviews

From `/control/disputes` and `/control/disputes/[id]`, admin can inspect:

- workspace context (gig, client, talent)
- messages between parties
- uploaded evidence
- payment records and escrow ledger
- milestones/final work status
- agreement context (where present)

### 7.3 Admin resolution actions

Admin can resolve with one of these outcomes:

1. `release_talent`  
   Funds are released toward talent wallet flow (platform fee handling included).

2. `refund_client`  
   Funds are returned to client wallet.

3. `partial_refund`  
   Settlement is split between client refund and talent release.

4. `close_case`  
   Case is closed with no new payout movement.

### 7.4 What updates automatically after resolution

On resolution, the platform updates:

- dispute status and stage
- resolution summary/history
- workspace payment settlement status
- escrow ledger entries
- wallet transaction records (where money moves)
- participant notifications

This creates an auditable trail for both operations and finance review.

---

## 8. Notifications and Communication Model

The platform uses a unified notification approach:

- in-app notifications for ongoing product activity
- selective admin alerts for critical operations
- structured links from each alert to the relevant record page

Thread messaging and support messaging are also integrated, so users can move from alert to conversation to action quickly.

---

## 9. Security and Session Behavior (User-Friendly Summary)

The platform applies layered protections for API activity:

- authenticated session cookies
- CSRF token checks on unsafe requests
- rate limits on sensitive API paths
- role checks for control/admin operations

User sessions, request validation, and abuse controls work together to protect account, payment, and dispute operations.

---

## 10. Typical Real-World Journey (One Complete Example)

Here is a simple end-to-end scenario:

1. A client signs up, verifies account, completes onboarding, and posts a gig.
2. A talent signs up, completes onboarding, finds the gig, and submits a proposal.
3. Client reviews proposals, accepts talent, and starts communication.
4. Work moves into workspace. Client funds workspace.
5. Talent submits milestones and then final work.
6. Client approves final work and payout follows defined flow.
7. Both parties receive notifications and can leave reviews.
8. If a disagreement occurs, dispute is raised and admin resolves with one of the settlement actions.

This is the core business loop of the platform.

---

## 11. Final Notes for Client Handover

- Public pages are marketing and trust layer.
- Dashboard pages are operational layer for talent/client.
- Control pages are governance and oversight layer.
- Workspace and dispute modules are the critical trust-and-settlement backbone.
- Wallet, transaction, and notification modules support transparency and repeat usage at scale.

If needed, this report can be turned into:

- a role-based training SOP (Talent SOP, Client SOP, Admin SOP)
- a clickable QA checklist by route
- a client onboarding deck version with screenshots.

