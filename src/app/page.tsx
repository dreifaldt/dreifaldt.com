'use client'

import { About, Experience, Footer, Hero, Navigation, Values } from '@/components'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      <Hero />
      <Values />
      <Experience />
      <About />
      <Footer />
    </div>
  )
}
