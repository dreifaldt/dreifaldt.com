import { FC, PropsWithChildren } from 'react'

interface DrawerProps {
  isOpen: boolean
}

export const Drawer: FC<PropsWithChildren<DrawerProps>> = ({ isOpen, children }) => {
  return (
    <div
      className={`fixed inset-0 z-50 bg-gradient-to-b to-slate-900 from-zinc-700 shadow-md transition-transform duration-300 ease-in-out transform ${
        isOpen ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="container mx-auto px-4 py-6">
        <button className="absolute top-2 right-2 text-5xl text-gray-500 hover:text-red-200" aria-label="Close drawer">
          &times;
        </button>
        {/* Add your drawer content here */}
        <h2 className="text-xl font-mono font-bold">Search</h2>
        <p>This is the top drawer component.</p>
        {children}
      </div>
    </div>
  )
}
