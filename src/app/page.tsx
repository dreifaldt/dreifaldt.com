'use client'
import { Drawer, DrawerRef } from '@/components'
import { Magnifier } from '@/components/icon/magnifier'
import Link from 'next/link'
import { useRef } from 'react'

export default function Home() {
  const drawerRef = useRef<DrawerRef>(null)
  return (
    <main>
      <Drawer ref={drawerRef}>
        <p>Hello!</p>
      </Drawer>
      <div className="flex min-h-screen flex-col items-center justify-between lg:p-24">
        <div className="w-full font-mono text-sm lg:flex">
          <a
            className="pointer-events-none flex w-full gap-2 lg:pointer-events-auto"
            href="mailto:erik@dreifaldt.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
              Contact:&nbsp;
              <code className="font-mono font-bold">erik@dreifaldt.com</code>
            </p>
          </a>
        </div>
        <button onClick={() => drawerRef.current?.open()} className="absolute right-6 top-4">
          <Magnifier />
        </button>

        <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px] z-[-1] flex-col gap-4">
          <h1 className="font-mono font-bold text-3xl">dreifaldt.com</h1>
          <p className="self-start">Typescript everything</p>
        </div>

        <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
          <a
            href="https://www.linkedin.com/in/erik-dreifaldt-293a0795/"
            target="_blank"
            rel="noopener noreferrer"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              LinkedIn{' '}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                -&gt;
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>View LinkedIn profile.</p>
          </a>

        </div>
      </div>
    </main>
  )
}
