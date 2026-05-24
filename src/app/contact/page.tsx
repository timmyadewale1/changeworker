"use client"

import { useState } from "react"
import { FiCheckCircle, FiMail, FiMapPin, FiMessageSquare, FiSend } from "react-icons/fi"
import { PublicPage } from "@/components/marketing/PublicPage"

const reasons = [
  "I’m an organization looking to hire",
  "I’m a freelancer looking for work",
  "I need help with my account",
  "Partnership or collaboration",
  "Press or media enquiry",
  "Something else",
]

const channels = [
  {
    label: "Email",
    value: "hello@changeworker.ng",
    desc: "Best for general questions, demos, and platform enquiries.",
  },
  {
    label: "Support",
    value: "support@changeworker.ng",
    desc: "Best for account issues or questions that need follow-up.",
  },
  {
    label: "Location",
    value: "Nigeria",
    desc: "The platform is focused on Nigerian talent and organizations today.",
  },
]

const quickFaq = [
  {
    q: "How quickly will I get a response?",
    a: "Email is still the best route for most questions. Use the form below and include enough context so the team can point you in the right direction quickly.",
  },
  {
    q: "Can I request a demo?",
    a: "Yes. Choose the organization or partnership option in the form and mention that you want a demo.",
  },
  {
    q: "Can I register interest from outside Nigeria?",
    a: "Yes. Use the form below and tell us where you’re writing from and what you’d like to use changeworker for.",
  },
]

const CONTACT_IMAGE = "https://images.pexels.com/photos/3182766/pexels-photo-3182766.jpeg?auto=compress&cs=tinysrgb&w=1200"

export default function ContactPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [reason, setReason] = useState(reasons[0])
  const [message, setMessage] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (!name.trim() || !email.trim() || !message.trim()) return
    setSubmitted(true)
  }

  return (
    <PublicPage>
      <div className="bg-white text-[#111]">
        <section className="relative overflow-hidden border-b border-orange-100 bg-[linear-gradient(180deg,#fffdfa_0%,#ffffff_100%)]">
          <div className="mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-28 lg:grid-cols-[1.05fr_.95fr] lg:px-12">
            <div>
              <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-2 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[#F97316]">
                Contact
              </span>
              <h1 className="font-body text-5xl font-black leading-[0.97] tracking-tight text-[#111] lg:text-7xl">
                A simple place
                <br />
                to ask, clarify,
                <br />
                <span className="text-[#F97316]">or reach out.</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                Whether you want to hire, join as talent, request a demo, or ask a support question, this page should make the next step obvious.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 sm:grid-rows-[220px_220px]">
              <div className="overflow-hidden rounded-[2rem] sm:col-span-2">
                <img src={CONTACT_IMAGE} alt="Support and collaboration team" className="h-full w-full object-cover" />
              </div>
              {channels.slice(0, 2).map((channel) => (
                <div key={channel.label} className="rounded-[2rem] border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[#F97316]">{channel.label}</div>
                  <div className="mt-2 font-body text-lg font-black text-[#111]">{channel.value}</div>
                  <div className="mt-1 text-sm leading-6 text-gray-500">{channel.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-18 lg:px-12">
          <div className="mb-10">
            <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-4 py-2 font-mono-ui text-[11px] uppercase tracking-[0.18em] text-[#F97316]">
              Send a note
            </span>
            <h2 className="mt-5 font-body text-4xl font-black tracking-tight text-[#111] lg:text-5xl">
              Tell us what you need, and keep it specific.
            </h2>
            <p className="mt-4 max-w-3xl text-[15px] leading-8 text-gray-600">
              We kept the form simple on purpose. The more context you include, the easier it is to respond usefully.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
            <div className="rounded-[1.8rem] border border-gray-200 bg-white p-7 shadow-sm md:p-8">
              {!submitted ? (
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#111]">Your name</label>
                    <input
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 text-sm outline-none"
                      placeholder="Enter your name"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#111]">Email</label>
                    <input
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 text-sm outline-none"
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#111]">Reason</label>
                    <select
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      className="h-12 w-full rounded-2xl border border-gray-200 bg-[#fafafa] px-4 text-sm outline-none"
                    >
                      {reasons.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#111]">Message</label>
                    <textarea
                      value={message}
                      onChange={(event) => setMessage(event.target.value)}
                      rows={6}
                      className="w-full rounded-[1.4rem] border border-gray-200 bg-[#fafafa] px-4 py-4 text-sm outline-none"
                      placeholder="Tell us what you’re trying to do, what’s unclear, or what kind of help you need."
                    />
                  </div>
                  <button onClick={handleSubmit} className="inline-flex items-center gap-2 rounded-xl bg-[#F97316] px-6 py-3 font-body text-sm font-bold text-white shadow-[0_12px_28px_rgba(249,115,22,.28)] transition hover:bg-[#EA580C]">
                    Send message <FiSend size={16} />
                  </button>
                </div>
              ) : (
                <div className="rounded-[1.5rem] border border-orange-200 bg-orange-50 p-8">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#F97316]">
                    <FiCheckCircle size={24} />
                  </div>
                  <h3 className="mt-5 font-body text-3xl font-black tracking-tight text-[#111]">Message drafted</h3>
                  <p className="mt-3 text-[15px] leading-8 text-gray-600">
                    This contact flow is ready for the lighter redesign. If you want it connected to a live support pipeline next, we can wire it the same way the in-app support flow works.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-body text-sm font-bold text-[#111] transition hover:border-orange-200 hover:bg-orange-50"
                  >
                    Send another message
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-5">
              <div className="rounded-[1.8rem] border border-gray-200 bg-white p-7 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#F97316]">
                    <FiMail size={20} />
                  </div>
                  <div>
                    <div className="font-body text-xl font-black text-[#111]">Best contact routes</div>
                    <div className="text-sm text-gray-500">Use the right path for the right question</div>
                  </div>
                </div>
                <div className="mt-5 space-y-4">
                  <div className="rounded-[1.2rem] border border-gray-200 bg-[#fafafa] p-4 text-sm leading-7 text-gray-600">
                    <strong className="text-[#111]">General:</strong> hello@changeworker.ng
                  </div>
                  <div className="rounded-[1.2rem] border border-gray-200 bg-[#fafafa] p-4 text-sm leading-7 text-gray-600">
                    <strong className="text-[#111]">Support:</strong> support@changeworker.ng
                  </div>
                  <div className="rounded-[1.2rem] border border-gray-200 bg-[#fafafa] p-4 text-sm leading-7 text-gray-600">
                    <strong className="text-[#111]">Region:</strong> currently Nigeria-focused
                  </div>
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-gray-200 bg-white p-7 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-[#F97316]">
                    <FiMessageSquare size={20} />
                  </div>
                  <div>
                    <div className="font-body text-xl font-black text-[#111]">Quick answers</div>
                    <div className="text-sm text-gray-500">A few common questions</div>
                  </div>
                </div>
                <div className="mt-5 space-y-4">
                  {quickFaq.map((item) => (
                    <div key={item.q} className="rounded-[1.2rem] border border-gray-200 bg-[#fafafa] p-4">
                      <div className="font-body text-base font-black text-[#111]">{item.q}</div>
                      <div className="mt-2 text-sm leading-7 text-gray-600">{item.a}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[1.8rem] border border-gray-200 bg-[#111] p-7 text-white shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-orange-300">
                    <FiMapPin size={20} />
                  </div>
                  <div className="font-body text-xl font-black">Where we operate</div>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/70">
                  changeworker is currently focused on Nigeria. If you want to use the platform from another market, tell us where you are and what use case you have in mind.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PublicPage>
  )
}
