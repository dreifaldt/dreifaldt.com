import { FC, PropsWithChildren } from 'react'

export const Grid: FC<PropsWithChildren> = ({ children }) => {
  return <div className="`flex flex-col gap-4 px-4 md:grid md:grid-cols-12 justify-center items-center">{children}</div>
}
