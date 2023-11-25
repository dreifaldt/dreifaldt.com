import { ReactNode } from 'react'
// These styles apply to every route in the application
import '@/styles/global.css'
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
