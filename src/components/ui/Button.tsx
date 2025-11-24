import Link from 'next/link'

type ButtonBaseProps = {
  children: React.ReactNode
  className?: string
  size?: 'lg' | 'md' | 'sm'
}

type ButtonProps =
  | ({ href: string; onClick?: never; variant: 'link' } & ButtonBaseProps)
  | ({ href?: never; onClick: () => void; variant: 'primary' | 'secondary' } & ButtonBaseProps)

export function Button({ children, className = '', size = 'md', variant, ...props }: ButtonProps) {
  const sizeClasses = {
    lg: 'px-8 py-4 text-lg',
    md: 'px-6 py-3 text-base',
    sm: 'px-4 py-2 text-sm',
  }

  const variantClasses = {
    primary: 'bg-accent-orange text-white hover:bg-accent-orange-dark',
    secondary: 'border border-warm-gray bg-white text-text-primary hover:bg-cream',
  }

  const baseClasses = `rounded-full font-medium transition-colors ${sizeClasses[size]}`

  if (variant === 'link' && props.href) {
    return (
      <Link className={`${baseClasses} text-accent-orange hover:underline ${className}`} href={props.href}>
        {children}
      </Link>
    )
  }

  const buttonVariant = variant === 'primary' || variant === 'secondary' ? variant : 'primary'

  if (props.onClick) {
    return (
      <button className={`${baseClasses} ${variantClasses[buttonVariant]} ${className}`} onClick={props.onClick}>
        {children}
      </button>
    )
  }

  return null
}
