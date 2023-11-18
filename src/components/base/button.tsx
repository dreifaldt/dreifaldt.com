import { FC, FormEvent } from 'react'
import { Arrow } from '../icon/arrow'

interface IconButtonProps {
  onClick: (event: FormEvent<HTMLButtonElement>) => void
}

export const IconButton: FC<IconButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex w-8 h-8 rounded-md bg-slate-600 items-center justify-center hover:bg-slate-100"
    >
      <Arrow />
    </button>
  )
}
