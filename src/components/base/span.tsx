import { FC, PropsWithChildren } from 'react'

interface Props extends PropsWithChildren {
  className?: string
}

export const Span: FC<Props> = ({ className, children }) => {
  return <span className={`col-span-6 ${className}`}>{children}</span>
}
