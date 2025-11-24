import { Container } from '../layout/Container'

export function About() {
  return (
    <section className="bg-white py-24">
      <Container>
        <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
          {/* Text content */}
          <div>
            <h2 className="mb-8 text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
              Building the <em className="italic text-accent-orange">future</em> together
            </h2>
            <p className="mb-6 text-xl leading-relaxed text-text-secondary">
              At Dreifaldt Consulting, we believe technology should empower people and organizations to achieve their
              greatest potential.
            </p>
            <p className="text-lg leading-relaxed text-text-secondary">
              Our team combines deep technical expertise with a human-centered approach to solve complex challenges and
              create solutions that make a real difference.
            </p>
          </div>

          {/* Visual element */}
          <div className="relative">
            <div className="flex aspect-[4/3] items-center justify-center rounded-3xl bg-gradient-to-br from-cream to-cream-dark">
              <div className="grid grid-cols-3 gap-4 p-8">
                <div className="h-16 rounded-lg bg-accent-orange/20"></div>
                <div className="h-16 rounded-lg bg-accent-orange/30"></div>
                <div className="h-16 rounded-lg bg-accent-orange/20"></div>
                <div className="h-16 rounded-lg bg-accent-orange/30"></div>
                <div className="h-16 rounded-lg bg-accent-orange/20"></div>
                <div className="h-16 rounded-lg bg-accent-orange/30"></div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
