'use client'
import { PropsWithChildren, forwardRef, useImperativeHandle, useRef } from 'react'
import { Close } from '../icon/close'
import { Magnifier } from '../icon/magnifier'

export type DrawerRef = {
  open: () => void
}

export const Drawer = forwardRef<DrawerRef, PropsWithChildren>(({ children }, ref) => {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useImperativeHandle(ref, () => ({
    open: () => dialogRef.current?.showModal(),
  }))

  return (
    <dialog ref={dialogRef} className="bg-blue-950 container max-h-full h-full py-14 px-12" id="drawer">
      <button onClick={() => dialogRef.current?.close()} className={`absolute right-6 top-4`}>
        <Close />
      </button>
      <form className="flex flex-grow">
        <button type="submit" disabled aria-label="Sök" aria-hidden="true" tabIndex={-1}>
          <Magnifier size={2.5} />
        </button>
        {/* Add your drawer content here */}
        <input
          type="text"
          placeholder="Search"
          className="text-white text-xl font-mono font-bold focus:outline-none bg-transparent w-full"
          autoCorrect="off"
          autoFocus
          data-1p-ignore
          role="search"
        />
      </form>

      <h2>Sökresultat</h2>
      <p>This is the top drawer component.</p>
      {children}
    </dialog>
  )
})

Drawer.displayName = 'Drawer'
