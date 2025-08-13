'use client'
import { Spotlight, SpotlightRef } from '@/components'
import { Magnifier } from '@/components/icon/magnifier'
import Link from 'next/link'
import { useRef } from 'react'

export default function Home() {
  const spotlightRef = useRef<SpotlightRef>(null)
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background layers for subtle Apple-like gradients */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-gradient-to-b from-white to-zinc-100 dark:from-[#0b0b0b] dark:to-black" />
      <div className="pointer-events-none absolute -top-40 right-1/2 h-[60rem] w-[60rem] -translate-x-1/2 rounded-full bg-gradient-radial from-sky-400/15 to-transparent blur-3xl dark:from-sky-600/20" />
      <div className="pointer-events-none absolute -bottom-32 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-gradient-conic from-fuchsia-400/10 via-purple-400/10 to-transparent blur-3xl dark:from-fuchsia-600/15 dark:via-purple-600/15" />

      {/* Top glassy navigation */}
      <nav className="fixed top-3 inset-x-0 z-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/60 p-2 backdrop-blur-xl shadow-lg dark:border-white/10 dark:bg-zinc-900/40">
            <div className="flex items-center gap-2 px-2">
              <div className="size-6 rounded-full bg-black/80 dark:bg-white" />
              <span className="select-none text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">dreifaldt</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-3">
              <a
                href="https://www.linkedin.com/in/erik-dreifaldt-293a0795/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-full px-3 py-1 text-sm text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white sm:block"
              >
                LinkedIn
              </a>
              <a
                href="https://github.com/eridr"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden rounded-full px-3 py-1 text-sm text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white sm:block"
              >
                Github
              </a>
              <button
                onClick={() => spotlightRef.current?.open()}
                aria-label="Open search"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-white/40 text-zinc-900 shadow-sm backdrop-blur-xl hover:bg-white/60 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-900/80"
              >
                <Magnifier />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spotlight command palette */}
      <Spotlight ref={spotlightRef}>
        <div className="space-y-2 p-2 text-sm text-zinc-700 dark:text-zinc-200">
          <p>Hello! Spotlight is coming soon.</p>
        </div>
      </Spotlight>

      {/* Hero section */}
      <section className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 pt-20 text-center sm:pt-24">
        <div className="mx-auto w-full max-w-3xl">
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/50 px-3 py-1 text-xs font-medium text-zinc-700 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-200">
            <span className="inline-block size-2 rounded-full bg-sky-700" />
            Now building with TypeScript
          </div>
          <h1 className="text-balance text-5xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
            Design. Build. Ship.
          </h1>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
            I craft fast, accessible web experiences with modern TypeScript, React, and Next.js.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="mailto:erik@dreifaldt.com"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black px-5 py-3 text-sm font-medium text-white shadow-lg shadow-black/20 transition hover:scale-[1.02] hover:shadow-black/30 active:scale-[0.99] dark:bg-white dark:text-black"
            >
              Contact
            </a>
            <a
              href="https://www.linkedin.com/in/erik-dreifaldt-293a0795/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/60 px-5 py-3 text-sm font-medium text-zinc-900 shadow-sm backdrop-blur-xl transition hover:bg-white/80 active:scale-[0.99] dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-900/80"
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Glass feature cards */}
        <div className="mt-16 grid w-full gap-4 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3">
          <a
            href="https://www.linkedin.com/in/erik-dreifaldt-293a0795/"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/50 p-6 shadow-xl backdrop-blur-2xl transition hover:-translate-y-0.5 hover:bg-white/70 dark:border-white/10 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/70"
          >
            <div className="absolute -right-10 -top-10 size-24 rounded-full bg-sky-400/20 blur-2xl" />
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">LinkedIn</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Visit my professional profile.</p>
            <span className="mt-4 inline-block text-sm font-medium text-sky-700 transition group-hover:translate-x-0.5 dark:text-sky-400">
              View profile →
            </span>
          </a>

          <a
            href="https://github.com/eridr"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/50 p-6 shadow-xl backdrop-blur-2xl transition hover:-translate-y-0.5 hover:bg-white/70 dark:border-white/10 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/70"
          >
            <div className="absolute -right-10 -top-10 size-24 rounded-full bg-zinc-400/25 blur-2xl" />
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">GitHub</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">Explore my projects and repositories.</p>
            <span className="mt-4 inline-block text-sm font-medium text-emerald-700 transition group-hover:translate-x-0.5 dark:text-emerald-400">
              View repos →
            </span>
          </a>

          <Link
            href="/robocaller"
            className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/50 p-6 shadow-xl backdrop-blur-2xl transition hover:-translate-y-0.5 hover:bg-white/70 dark:border-white/10 dark:bg-zinc-900/50 dark:hover:bg-zinc-900/70"
          >
            <div className="absolute -right-10 -top-10 size-24 rounded-full bg-indigo-400/20 blur-2xl" />
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Robocaller</h3>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">AI call center.</p>
            <span className="mt-4 inline-block text-sm font-medium text-indigo-700 transition group-hover:translate-x-0.5 dark:text-indigo-400">
              Learn more →
            </span>
          </Link>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="relative z-10 border-t border-black/5 bg-white/40 py-10 text-center text-xs text-zinc-500 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40 dark:text-zinc-400">
        © {new Date().getFullYear()} dreifaldt.com — Built with Next.js & Tailwind CSS
      </footer>
    </main>
  )
}
