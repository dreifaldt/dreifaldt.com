'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Container } from '../layout/Container'

const words = ['technology', 'experiences', 'solutions']

export function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <section className="flex min-h-screen items-center bg-white py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
          {/* Text content */}
          <div>
            <h1 className="mb-8 text-display-lg font-semibold leading-tight tracking-tight text-text-primary">
              I build{' '}
              <span className="relative inline-block">
                <AnimatePresence mode="wait">
                  <motion.em
                    animate={{ opacity: 1, y: 0 }}
                    className="italic text-accent-orange"
                    exit={{ opacity: 0, y: -20 }}
                    initial={{ opacity: 0, y: 20 }}
                    key={words[currentIndex]}
                    transition={{ duration: 0.5 }}
                  >
                    {words[currentIndex]}
                  </motion.em>
                </AnimatePresence>
              </span>
            </h1>
            <p className="text-xl leading-relaxed text-text-secondary">
              Dreifaldt Consulting partners with organizations to create innovative solutions that drive meaningful
              change and lasting impact.
            </p>
          </div>

          {/* Video element */}
          <div className="relative">
            <div className="aspect-square overflow-hidden rounded-3xl border border-warm-gray bg-cream shadow-lg">
              <video autoPlay className="h-full w-full object-cover" loop muted playsInline preload="metadata">
                <source src="/kite_launch.mp4" type="video/mp4" />
                <div className="flex h-full items-center justify-center text-text-secondary">
                  Your browser does not support the video tag.
                </div>
              </video>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
