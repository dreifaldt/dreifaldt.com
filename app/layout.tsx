export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html style={{ backgroundColor: 'black' }}>
      <head></head>
      <body>{children}</body>
    </html>
  )
}
