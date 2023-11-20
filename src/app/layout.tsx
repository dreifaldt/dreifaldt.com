import { ReactNode } from 'react'
// These styles apply to every route in the application
import './globals.css'

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head></head>
      <body>{children}</body>
      <footer></footer>
    </html>
  )
}
