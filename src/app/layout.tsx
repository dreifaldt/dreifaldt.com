'use client'
import { ReactNode } from 'react'
// These styles apply to every route in the application
import './globals.css'
import { Provider } from '@/utils/provider'

// Create a client

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
