'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [navbarVisible, setNavbarVisible] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [activeWordIndex, setActiveWordIndex] = useState(0)
  const [previousWordIndex, setPreviousWordIndex] = useState(-1)
  const [scrollDirection, setScrollDirection] = useState<'down' | 'up'>('down')

  useEffect(() => {
    // Trigger navbar slide-in animation after component mounts
    const timer = setTimeout(() => {
      setNavbarVisible(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const previousScrollY = scrollY

      setScrollY(currentScrollY)

      // Determine scroll direction
      const direction = currentScrollY > previousScrollY ? 'down' : 'up'
      setScrollDirection(direction)

      // Calculate active word index based on scroll position
      // 0-500px: technology (index 0)
      // 500-1000px: experiences (index 1)
      // 1000-1500px: solutions (index 2)
      let newActiveIndex: number
      if (currentScrollY < 500) {
        newActiveIndex = 0
      } else if (currentScrollY < 1000) {
        newActiveIndex = 1
      } else if (currentScrollY < 1500) {
        newActiveIndex = 2
      } else {
        newActiveIndex = 2 // Keep showing "solutions" after 1500px
      }

      // Update previous index for animation direction
      if (newActiveIndex !== activeWordIndex) {
        setPreviousWordIndex(activeWordIndex)
        setActiveWordIndex(newActiveIndex)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollY, activeWordIndex])

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className={`fixed top-[2.625rem] left-0 right-0 z-50 transition-all duration-700 ease-out ${
        navbarVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <div className="mx-4 lg:mx-[6.5rem]">
          <div className="backdrop-blur-md bg-white/80 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/30 px-8 py-5">
            <div className="flex justify-between items-center">
              {/* Logo - matching Microsoft AI style */}
              <div className="flex items-center">
                <button
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-xl font-bold text-black tracking-tight hover:text-black/70 transition-colors cursor-pointer"
                >
                  Dreifaldt Consulting
                </button>
              </div>

              {/* Desktop Navigation - matching Microsoft AI spacing and typography */}
              <div className="hidden md:flex items-center space-x-12">
                <a href="#about" className="text-black/90 hover:text-black/70 transition-colors font-normal text-base">
                  About
                </a>
                <a href="#jobs" className="text-black/90 hover:text-black/70 transition-colors font-normal text-base">
                  Jobs
                </a>
                <a href="#contact" className="text-black/90 hover:text-black/70 transition-colors font-normal text-base">
                  Contact
                </a>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="text-black/90 hover:text-black/70 focus:outline-none p-2"
                  aria-label="Toggle mobile menu"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {mobileMenuOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )}
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div id="mobile-menu" className={`md:hidden mt-3 ${mobileMenuOpen ? 'block' : 'hidden'}`}>
            <div className="backdrop-blur-md bg-white/80 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.1)] border border-white/30 px-6 py-4 space-y-2">
              <a
                href="#about"
                className="block px-4 py-3 text-black/90 hover:text-black/70 transition-colors font-normal text-base rounded-xl hover:bg-white/40"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </a>
              <a
                href="#jobs"
                className="block px-4 py-3 text-black/90 hover:text-black/70 transition-colors font-normal text-base rounded-xl hover:bg-white/40"
                onClick={() => setMobileMenuOpen(false)}
              >
                Jobs
              </a>
              <a
                href="#contact"
                className="block px-4 py-3 text-black/90 hover:text-black/70 transition-colors font-normal text-base rounded-xl hover:bg-white/40"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </nav>


      {/* Hero Section */}
      <section className="fixed inset-0 z-10 overflow-hidden bg-white flex items-center justify-center"
               style={{ opacity: scrollY < 1500 ? 1 : Math.max(0, 1 - (scrollY - 1500) / 500) }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="max-w-2xl">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-normal tracking-tight text-black leading-none">
                We build
                <br />
                <div className="relative inline-block">
                  <em className={`italic absolute inset-0 transition-all duration-500 ease-out ${
                    activeWordIndex === 0
                      ? 'opacity-100 transform translate-y-0'
                      : previousWordIndex === 0
                        ? scrollDirection === 'down'
                          ? 'opacity-0 transform -translate-y-8'  // Slide up when scrolling down
                          : 'opacity-0 transform translate-y-8'   // Slide down when scrolling up
                        : activeWordIndex < 0
                          ? 'opacity-0 transform translate-y-8'   // Coming from below
                          : 'opacity-0 transform -translate-y-8'  // Coming from above
                  }`}>
                    technology
                  </em>
                  <em className={`italic absolute inset-0 transition-all duration-500 ease-out ${
                    activeWordIndex === 1
                      ? 'opacity-100 transform translate-y-0'
                      : previousWordIndex === 1
                        ? scrollDirection === 'down'
                          ? 'opacity-0 transform -translate-y-8'  // Slide up when scrolling down
                          : 'opacity-0 transform translate-y-8'   // Slide down when scrolling up
                        : activeWordIndex < 1
                          ? 'opacity-0 transform translate-y-8'   // Coming from below
                          : 'opacity-0 transform -translate-y-8'  // Coming from above
                  }`}>
                    experiences
                  </em>
                  <em className={`italic absolute inset-0 transition-all duration-500 ease-out ${
                    activeWordIndex === 2
                      ? 'opacity-100 transform translate-y-0'
                      : previousWordIndex === 2
                        ? scrollDirection === 'down'
                          ? 'opacity-0 transform -translate-y-8'  // Slide up when scrolling down
                          : 'opacity-0 transform translate-y-8'   // Slide down when scrolling up
                        : activeWordIndex < 2
                          ? 'opacity-0 transform translate-y-8'   // Coming from below
                          : 'opacity-0 transform -translate-y-8'  // Coming from above
                  }`}>
                    solutions
                  </em>
                  <em className="italic invisible">experiences</em>
                </div>
              </h1>
              <p className="mt-8 text-xl text-gray-600 leading-relaxed">
                Dreifaldt Consulting partners with organizations to create innovative solutions that drive meaningful change and lasting impact.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl flex items-center justify-center overflow-hidden">
                {/* Circle Shape (activeWordIndex === 0) - Blue */}
                <div className={`absolute w-64 h-64 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full transition-all duration-500 ease-out ${
                  activeWordIndex === 0
                    ? 'opacity-100 transform translate-y-0 scale-100'
                    : previousWordIndex === 0
                      ? scrollDirection === 'down'
                        ? 'opacity-0 transform -translate-y-8 scale-90'
                        : 'opacity-0 transform translate-y-8 scale-90'
                      : activeWordIndex < 0
                        ? 'opacity-0 transform translate-y-8 scale-90'
                        : 'opacity-0 transform -translate-y-8 scale-90'
                }`}></div>

                {/* Triangle Shape (activeWordIndex === 1) - Green */}
                <div className={`absolute w-64 h-64 transition-all duration-500 ease-out ${
                  activeWordIndex === 1
                    ? 'opacity-100 transform translate-y-0 scale-100'
                    : previousWordIndex === 1
                      ? scrollDirection === 'down'
                        ? 'opacity-0 transform -translate-y-8 scale-90'
                        : 'opacity-0 transform translate-y-8 scale-90'
                      : activeWordIndex < 1
                        ? 'opacity-0 transform translate-y-8 scale-90'
                        : 'opacity-0 transform -translate-y-8 scale-90'
                }`}>
                  <div
                    className="w-full h-full bg-gradient-to-br from-green-400 to-green-600"
                    style={{
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)'
                    }}
                  ></div>
                </div>

                {/* Honeycomb Shape (activeWordIndex === 2) - Yellow */}
                <div className={`absolute w-64 h-64 flex items-center justify-center transition-all duration-500 ease-out ${
                  activeWordIndex === 2
                    ? 'opacity-100 transform translate-y-0 scale-100'
                    : previousWordIndex === 2
                      ? scrollDirection === 'down'
                        ? 'opacity-0 transform -translate-y-8 scale-90'
                        : 'opacity-0 transform translate-y-8 scale-90'
                      : activeWordIndex < 2
                        ? 'opacity-0 transform translate-y-8 scale-90'
                        : 'opacity-0 transform -translate-y-8 scale-90'
                }`}>
                  <div
                    className="w-56 h-56 bg-gradient-to-br from-yellow-400 to-yellow-600"
                    style={{
                      clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Spacer for scroll height during hero transitions */}
      <div className="h-[2000px] w-full"></div>

      {/* Spacer before About section */}
      <div className="pt-[75vh]" />

      {/* Values Section */}
      <section id="about" className="pt-40 pb-24 sm:pb-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-normal tracking-tight text-black">
              About <em className="italic">Me</em>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Innovation</h3>
              <p className="text-gray-600">We push boundaries and explore new possibilities to create cutting-edge solutions.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Partnership</h3>
              <p className="text-gray-600">We work closely with our clients to understand their needs and exceed expectations.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-black mb-4">Excellence</h3>
              <p className="text-gray-600">We deliver high-quality solutions that drive meaningful results and lasting impact.</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 sm:py-32 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl sm:text-5xl font-normal tracking-tight text-black mb-8">
                Building the <em className="italic">future</em> together
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed mb-6">
                At Dreifaldt Consulting, we believe technology should empower people and organizations to achieve their greatest potential.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Our team combines deep technical expertise with a human-centered approach to solve complex challenges and create solutions that make a real difference.
              </p>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 rounded-3xl flex items-center justify-center">
                <div className="grid grid-cols-3 gap-4 p-8">
                  <div className="h-16 bg-blue-200 rounded-lg"></div>
                  <div className="h-16 bg-green-200 rounded-lg"></div>
                  <div className="h-16 bg-purple-200 rounded-lg"></div>
                  <div className="h-16 bg-indigo-200 rounded-lg"></div>
                  <div className="h-16 bg-pink-200 rounded-lg"></div>
                  <div className="h-16 bg-yellow-200 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <p className="text-gray-600">
              © {new Date().getFullYear()} Dreifaldt Consulting. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
