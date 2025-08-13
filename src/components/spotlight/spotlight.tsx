'use client'
import { PropsWithChildren, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { Magnifier } from '../icon/magnifier'

export type SpotlightRef = {
  open: () => void
  close: () => void
}

type SpotlightProps = PropsWithChildren<{
  placeholder?: string
}>

export const Spotlight = forwardRef<SpotlightRef, SpotlightProps>(({ placeholder = 'Search…', children }, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const open = () => {
    if (!dialogRef.current) return
    if (typeof dialogRef.current.showModal === 'function') {
      dialogRef.current.showModal()
    } else {
      // Fallback for environments without showModal
      dialogRef.current.setAttribute('open', 'true')
    }
    // Focus the input on next frame so it's ready for typing
    requestAnimationFrame(() => inputRef.current?.focus())
  }

  const close = () => dialogRef.current?.close()

  useImperativeHandle(ref, () => ({ open, close }))

  // Global keyboard shortcut: Cmd+K / Ctrl+K to open, Esc to close
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isK = e.key.toLowerCase() === 'k'
      if ((e.metaKey || e.ctrlKey) && isK) {
        e.preventDefault()
        open()
      } else if (e.key === 'Escape') {
        close()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <dialog
      ref={dialogRef}
      aria-label="Spotlight search"
  className="bg-transparent backdrop:bg-black/40 backdrop:backdrop-blur-sm open:fixed open:inset-0 open:m-0 open:w-screen open:h-screen open:z-50 open:grid open:place-items-center open:p-4 open:animate-in open:fade-in-0 open:zoom-in-95"
    >
      <div className="mx-auto w-[92vw] max-w-xl rounded-2xl border border-white/20 bg-white/70 p-2 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/70">
        <form
          role="search"
          className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/80 px-3 py-2 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-zinc-950/60"
          onSubmit={(e) => e.preventDefault()}
        >
          <Magnifier size={1.25} />
          <input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            className="w-full bg-transparent text-sm text-zinc-900 placeholder-zinc-400 outline-none dark:text-zinc-100 dark:placeholder-zinc-500"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          <kbd className="hidden select-none rounded-md border border-white/20 bg-white/60 px-1.5 py-0.5 text-[10px] font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300 sm:block">
            ⌘K
          </kbd>
        </form>

        {/* Results / custom content */}
        <div className="mt-2 max-h-[50vh] overflow-auto rounded-xl border border-white/20 bg-white/60 p-2 text-sm text-zinc-700 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-200">
          {children ?? <p>Spotlight is coming soon.</p>}
        </div>

        <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-zinc-500 dark:text-zinc-400">
          <span>Type to search. Press Enter to confirm.</span>
          <button
            onClick={close}
            className="rounded-md border border-white/20 bg-white/60 px-2 py-0.5 text-zinc-700 hover:bg-white/80 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300 dark:hover:bg-zinc-900/80"
          >
            Esc to close
          </button>
        </div>
      </div>
    </dialog>
  )
})

Spotlight.displayName = 'Spotlight'
