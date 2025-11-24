import { Container } from '../layout/Container'
import { FeatureCard } from '../ui/FeatureCard'

export function Values() {
  return (
    <section className="bg-cream py-24" id="about">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            About <em className="italic text-accent-orange">Me</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <FeatureCard
            description="We push boundaries and explore new possibilities to create cutting-edge solutions."
            icon={
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-orange/10">
                <svg className="h-8 w-8 text-accent-orange" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
              </div>
            }
            title="Innovation"
          />

          <FeatureCard
            description="We work closely with our clients to understand their needs and exceed expectations."
            icon={
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-orange/10">
                <svg className="h-8 w-8 text-accent-orange" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            }
            title="Partnership"
          />

          <FeatureCard
            description="We deliver high-quality solutions that drive meaningful results and lasting impact."
            icon={
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent-orange/10">
                <svg className="h-8 w-8 text-accent-orange" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            }
            title="Excellence"
          />
        </div>
      </Container>
    </section>
  )
}
