'use client'

import { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html style={{ backgroundColor: 'black' }}>
      <head></head>
      <body>{children}</body>
    </html>
  )
}
