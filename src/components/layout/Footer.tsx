import { Container } from './Container'

export function Footer() {
  return (
    <footer className="border-t border-warm-gray bg-cream">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {/* Company */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-primary">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-text-secondary transition-colors hover:text-text-primary"
                  href="#about"
                >
                  About
                </a>
              </li>
              <li>
                <a
                  className="text-text-secondary transition-colors hover:text-text-primary"
                  href="#jobs"
                >
                  Jobs
                </a>
              </li>
              <li>
                <a
                  className="text-text-secondary transition-colors hover:text-text-primary"
                  href="#contact"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Resources (placeholder for future) */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-primary">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <span className="text-text-secondary">Coming soon</span>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-text-primary">
              Connect
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  className="text-text-secondary transition-colors hover:text-text-primary"
                  href="https://www.linkedin.com/in/erikdreifaldt"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  className="text-text-secondary transition-colors hover:text-text-primary"
                  href="https://github.com/erikdreifalt"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  className="text-text-secondary transition-colors hover:text-text-primary"
                  href="mailto:erik@dreifaldt.com"
                >
                  Email
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-warm-gray pt-8">
          <p className="text-center text-sm text-text-secondary">
            © {new Date().getFullYear()} Dreifaldt Consulting. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  )
}
