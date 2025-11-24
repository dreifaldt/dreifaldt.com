'use client'
import {
  PropsWithChildren,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useRouter } from 'next/navigation'
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
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  type Command = {
    id: string
    label: string
    hint?: string
    url: string
    external?: boolean
    keywords?: string[]
  }

  const commands: Command[] = useMemo(
    () => [
      {
        hint: 'Go to start page',
        id: 'home',
        keywords: ['home', 'start', 'index', 'dreifaldt', 'site'],
        label: 'Home',
        url: '/'
      },
      {
        external: true,
        hint: 'Open LinkedIn profile',
        id: 'linkedin',
        keywords: ['linkedin', 'profile', 'network'],
        label: 'LinkedIn',
        url: 'https://www.linkedin.com/in/erik-dreifaldt-293a0795/'
      },
      {
        external: true,
        hint: 'Compose an email',
        id: 'mail',
        keywords: ['mail', 'email', 'contact'],
        label: 'Mail',
        url: 'mailto:erik@dreifaldt.com'
      },
      {
        external: true,
        hint: 'View GitHub profile',
        id: 'github',
        keywords: ['github', 'code', 'repo', 'projects'],
        label: 'GitHub',
        url: 'https://github.com/eridr'
      },
    ],
    []
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return commands
    return commands.filter((c) =>
      [c.label, ...(c.keywords ?? [])].some((t) => t.toLowerCase().includes(q))
    )
  }, [commands, query])

  const resetState = useCallback(() => {
    setQuery('')
    setActiveIndex(0)
  }, [])

  const open = () => {
    if (!dialogRef.current) return
    if (typeof dialogRef.current.showModal === 'function') {
      dialogRef.current.showModal()
    } else {
      // Fallback for environments without showModal
      dialogRef.current.setAttribute('open', 'true')
    }
    // Focus the input on next frame so it's ready for typing
    requestAnimationFrame(() => {
      resetState()
      inputRef.current?.focus()
    })
  }

  const close = () => dialogRef.current?.close()

  useImperativeHandle(ref, () => ({ close, open }))

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
  }, [open])

  // Support programmatic open/close via custom events
  useEffect(() => {
    const onOpen = () => open()
    const onClose = () => close()
    window.addEventListener('open-spotlight', onOpen as EventListener)
    window.addEventListener('close-spotlight', onClose as EventListener)
    return () => {
      window.removeEventListener('open-spotlight', onOpen as EventListener)
      window.removeEventListener('close-spotlight', onClose as EventListener)
    }
  }, [open])

  const execute = useCallback(
    (cmd: Command) => {
      if (!cmd) return
      if (cmd.external) {
        // Use window.open for external links and mailto
        window.open(cmd.url, '_blank', 'noopener,noreferrer')
      } else {
        router.push(cmd.url)
      }
      close()
    },
    [router]
  )

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, Math.max(0, filtered.length - 1)))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        const target = filtered[activeIndex]
        if (target) execute(target)
      }
    },
    [activeIndex, execute, filtered]
  )

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
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setActiveIndex(0)
            }}
            onKeyDown={onInputKeyDown}
          />
          <kbd className="hidden select-none rounded-md border border-white/20 bg-white/60 px-1.5 py-0.5 text-[10px] font-medium text-zinc-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-300 sm:block">
            ⌘K
          </kbd>
        </form>

        {/* Results */}
        <div className="mt-2 max-h-[50vh] overflow-auto rounded-xl border border-white/20 bg-white/60 p-2 text-sm text-zinc-700 backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-200">
          <ul role="listbox" aria-label="Search results" className="divide-y divide-white/10">
            {filtered.length === 0 && (
              <li className="px-3 py-2 text-zinc-500">No results</li>
            )}
            {filtered.map((cmd, idx) => (
              <li key={cmd.id} role="option" aria-selected={idx === activeIndex}>
                <button
                  type="button"
                  onClick={() => execute(cmd)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className={
                    'flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left transition ' +
                    (idx === activeIndex
                      ? 'bg-white/70 text-zinc-900 shadow-sm dark:bg-zinc-800/70 dark:text-zinc-100'
                      : 'hover:bg-white/50 dark:hover:bg-zinc-800/40')
                  }
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="inline-flex size-6 items-center justify-center rounded-md border border-white/20 bg-white/70 text-[11px] font-semibold text-zinc-700 dark:border-white/10 dark:bg-zinc-900/60 dark:text-zinc-200">
                      {cmd.label.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <div className="truncate font-medium">{cmd.label}</div>
                      {cmd.hint && <div className="truncate text-[11px] text-zinc-500 dark:text-zinc-400">{cmd.hint}</div>}
                    </div>
                  </div>
                  <div className="shrink-0 text-[11px] text-zinc-500 dark:text-zinc-400">{cmd.external ? '↗' : '↪'}</div>
                </button>
              </li>
            ))}
          </ul>
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
