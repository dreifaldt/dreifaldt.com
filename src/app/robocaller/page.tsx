import type { Metadata } from 'next'
import Link from 'next/link'
export const metadata: Metadata = {
  description:
    'Robocaller is an AI-powered call center that answers, qualifies, and books meetings 24/7. Reduce missed calls, qualify leads instantly, and automate scheduling.',
  title: 'Robocaller — AI Call Center'
}

export default function RobocallerPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-white to-zinc-100 dark:from-[#0b0b0b] dark:to-black" />
      <div className="pointer-events-none absolute -top-40 right-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full bg-gradient-radial from-indigo-400/15 to-transparent blur-3xl dark:from-indigo-600/20" />

      {/* Top bar */}
      <nav className="sticky top-3 inset-x-0 z-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/60 p-2 backdrop-blur-xl shadow-lg dark:border-white/10 dark:bg-zinc-900/40">
            <Link href="/" className="flex items-center gap-2 px-2">
              <div className="size-6 rounded-full bg-black/80 dark:bg-white" />
              <span className="select-none text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">dreifaldt</span>
            </Link>
            <a
              href="#contact"
              className="rounded-full border border-white/20 bg-black px-3 py-1 text-xs font-medium text-white shadow-sm dark:bg-white dark:text-black"
            >
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <span className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/50 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-200">
            <span className="inline-block size-2 rounded-full bg-indigo-700" />
            New — AI agents that never miss a call
          </span>
          <h1 className="text-balance text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
            Robocaller
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
            Turn every missed call into a booked meeting. Robocaller answers in seconds, qualifies with natural conversation,
            and schedules directly on your calendar.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black px-5 py-3 text-sm font-medium text-white shadow-lg shadow-black/20 transition hover:scale-[1.02] hover:shadow-black/30 active:scale-[0.99] dark:bg-white dark:text-black"
            >
              Book a demo
            </a>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/60 px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur-xl transition hover:bg-white/80 active:scale-[0.99] dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-900/80"
            >
              Back to home
            </Link>
          </div>
        </div>

        {/* Value props */}
        <div className="mt-16 grid w-full gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          {[
            {
              desc: 'Answer every inbound call in seconds, even after hours and on weekends.',
              title: 'Never miss a lead'
            },
            {
              desc: 'Ask the right questions, capture intent, and score leads consistently.',
              title: 'Qualify automatically'
            },
            {
              desc: 'Offer times, handle objections, and book directly to your calendar.',
              title: 'Instant scheduling'
            },
          ].map((card) => (
            <div
              key={card.title}
              className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/50 p-6 shadow-xl backdrop-blur-2xl transition hover:-translate-y-0.5 hover:bg-white/70 dark:border-white/10 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/70"
            >
              <div className="absolute -right-10 -top-10 size-24 rounded-full bg-indigo-400/20 blur-2xl" />
              <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">{card.title}</h3>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto mt-20 max-w-6xl px-6 lg:mt-28">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">How Robocaller works</h2>
            <ol className="mt-4 space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
              <li>
                1. Your customer calls your business number.
              </li>
              <li>
                2. Robocaller answers with your brand voice and asks qualifying questions.
              </li>
              <li>
                3. It captures details and offers times from your connected calendar.
              </li>
              <li>
                4. The meeting is booked and a summary is sent to your CRM and inbox.
              </li>
            </ol>
          </div>

          <div className="rounded-3xl border border-white/20 bg-white/50 p-6 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:bg-zinc-900/50">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Built-in integrations</h3>
            <ul className="mt-3 grid grid-cols-2 gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <li>Google Calendar</li>
              <li>Microsoft 365</li>
              <li>HubSpot</li>
              <li>Salesforce</li>
            </ul>
            <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
              Looking for a specific integration? Ask when you book a demo.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="contact" className="mx-auto my-24 max-w-6xl px-6">
        <div className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/70 to-white/40 p-8 shadow-xl backdrop-blur-2xl dark:border-white/10 dark:from-zinc-900/60 dark:to-zinc-900/40">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Ready to turn calls into customers?</h2>
              <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">
                Tell me about your use case and I0ll reach out to set up a quick demo.
              </p>
            </div>
            <div className="flex items-center md:justify-end">
              <a
                href="mailto:erik@dreifaldt.com?subject=Robocaller%20demo"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black px-5 py-3 text-sm font-medium text-white shadow-lg shadow-black/20 transition hover:scale-[1.02] hover:shadow-black/30 active:scale-[0.99] dark:bg-white dark:text-black"
              >
                Contact Erik
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-black/5 bg-white/40 py-10 text-center text-xs text-zinc-500 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-400">
        © {new Date().getFullYear()} dreifaldt.com — Robocaller
      </footer>
    </main>
  )
}
