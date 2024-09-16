import { FC, PropsWithChildren } from 'react'

type SpanProps = { span: number }

export const Span: FC<PropsWithChildren<SpanProps>> = ({ span = 1, children }) => {
  return <span className={`col-span-${span}`}>{children}</span>
}
