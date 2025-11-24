'use client'

import { useState } from 'react'

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 border-b border-warm-gray bg-white">
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button
            className="cursor-pointer text-xl font-semibold text-text-primary transition-colors hover:text-text-secondary"
            onClick={() => window.scrollTo({ behavior: 'smooth', top: 0 })}
          >
            Dreifaldt Consulting
          </button>

          {/* Desktop Navigation */}
          <div className="hidden items-center space-x-8 md:flex">
            <a
              className="text-base text-text-secondary transition-colors hover:text-text-primary"
              href="#about"
            >
              About
            </a>
            <a
              className="text-base text-text-secondary transition-colors hover:text-text-primary"
              href="#jobs"
            >
              Jobs
            </a>
            <a
              className="text-base text-text-secondary transition-colors hover:text-text-primary"
              href="#contact"
            >
              Contact
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            aria-label="Toggle mobile menu"
            className="p-2 text-text-secondary hover:text-text-primary focus:outline-none md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="border-t border-warm-gray py-4 md:hidden">
            <div className="flex flex-col space-y-3">
              <a
                className="rounded-lg px-4 py-2 text-base text-text-secondary transition-colors hover:bg-cream hover:text-text-primary"
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                className="rounded-lg px-4 py-2 text-base text-text-secondary transition-colors hover:bg-cream hover:text-text-primary"
                href="#jobs"
                onClick={() => setMobileMenuOpen(false)}
              >
                Jobs
              </a>
              <a
                className="rounded-lg px-4 py-2 text-base text-text-secondary transition-colors hover:bg-cream hover:text-text-primary"
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
