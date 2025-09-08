'use client'
import { SpotlightRef } from '@/components'
import { Magnifier } from '@/components/icon/magnifier'
import { useRef } from 'react'

export default function Home() {
  const spotlightRef = useRef<SpotlightRef>(null)
  return (
    <main className="relative min-h-screen overflow-hidden pb-4">
      {/* Minimal background */}
      <div className="pointer-events-none absolute inset-0 -z-20 bg-white dark:bg-black" />

      {/* Top glassy navigation */}
      <nav className="fixed top-3 inset-x-0 z-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-between rounded-2xl border border-white/20 bg-white/60 p-2 backdrop-blur-xl shadow-lg dark:border-white/10 dark:bg-zinc-900/40">
            <div className="flex items-center gap-2 px-2">
              <div className="size-6 rounded-full bg-black/80 dark:bg-white" />
              <span className="select-none text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">dreifaldt</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-zinc-500 dark:text-zinc-400 sm:block">
                ⌘K to search
              </span>
              <button
                onClick={() => window.dispatchEvent(new Event('open-spotlight'))}
                aria-label="Open search"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/40 text-zinc-900 shadow-sm backdrop-blur-xl hover:bg-white/60 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:bg-zinc-900/80"
              >
                <Magnifier />
              </button>
            </div>
          </div>
        </div>
      </nav>

  {/* Spotlight is rendered globally in layout */}

      {/* Notion embed section */}
      <section className="relative mx-auto max-w-6xl px-6 pt-20 pb-8 sm:pt-24 sm:pb-12">
        <div className="h-[calc(100vh-10rem)] sm:h-[calc(100vh-12rem)] w-full overflow-hidden rounded-2xl border border-white/20 bg-white/40 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/40">
          <iframe
            src="https://little-revolve-a76.notion.site/Erik-Dreifaldt-25aa4c02779080228c1ad6134c23514b"
            className="h-full w-full"
            title="Erik Dreifaldt's Notion Workspace"
          />
        </div>
      </section>

      {/* Footer matching navbar design */}
      <footer className="fixed bottom-3 inset-x-0 z-50">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-center rounded-2xl border border-white/20 bg-white/60 p-2 backdrop-blur-xl shadow-lg dark:border-white/10 dark:bg-zinc-900/40">
            <span className="select-none text-xs text-zinc-500 dark:text-zinc-400">
              © {new Date().getFullYear()} dreifaldt.com — Built with Next.js
            </span>
          </div>
        </div>
      </footer>
    </main>
  )
}
