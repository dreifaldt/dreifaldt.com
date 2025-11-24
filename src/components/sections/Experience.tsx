import { Container } from '../layout/Container'

export function Experience() {
  const companies = [
    { name: 'Safello', url: 'https://www.safello.com' },
    { name: 'EsterCare', url: 'https://www.estercare.se' },
    { name: 'Ahlsell', url: 'https://www.ahlsell.se' },
    { name: 'Kronans Apotek', url: 'https://www.kronansapotek.se' },
    { name: '3', url: 'https://www.tre.se' },
  ]

  return (
    <section className="bg-cream py-24" id="jobs">
      <Container>
        <div className="mb-16 text-center">
          <h2 className="text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl">
            Past <em className="italic text-accent-orange">Experience</em>
          </h2>
          <p className="mt-4 text-lg text-text-secondary">Trusted by leading organizations</p>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          {companies.map((company) => (
            <a
              className="rounded-2xl border border-warm-gray bg-white px-8 py-4 text-lg text-text-secondary transition-all hover:shadow-md hover:text-text-primary hover:border-accent-orange"
              href={company.url}
              key={company.name}
              rel="noopener noreferrer"
              target="_blank"
            >
              {company.name}
            </a>
          ))}
        </div>
      </Container>
    </section>
  )
}
