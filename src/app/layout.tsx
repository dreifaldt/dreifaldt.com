'use client'

// These styles apply to every route in the application
import './globals.css'

import { ReactNode } from 'react'
import { Provider } from '@/utils/provider'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head></head>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
