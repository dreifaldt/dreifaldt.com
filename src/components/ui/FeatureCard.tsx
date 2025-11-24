import { Card } from './Card'

interface FeatureCardProps {
  description: string
  icon: React.ReactNode
  title: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="text-center transition-shadow hover:shadow-md">
      <div className="mb-4 flex justify-center">{icon}</div>
      <h3 className="mb-3 text-xl font-semibold text-text-primary">{title}</h3>
      <p className="text-text-secondary">{description}</p>
    </Card>
  )
}
