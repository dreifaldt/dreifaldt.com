import { FC, PropsWithChildren } from 'react'

export const Span: FC<PropsWithChildren> = ({ children }) => {
  return <span className="col-span-6">{children}</span>
}
