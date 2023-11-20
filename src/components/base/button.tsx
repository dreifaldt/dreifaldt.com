import { FC, FormEvent } from 'react'
import { Arrow } from '../icon/arrow'

interface IconButtonProps {
  onClick: (event: FormEvent<HTMLButtonElement>) => void
  active?: boolean
}

export const IconButton: FC<IconButtonProps> = ({ onClick, active }) => {
  const bgColor = active ? 'bg-green-500' : 'bg-slate-200'
  return (
    <button onClick={onClick} className={`flex w-8 h-8 rounded-md items-center justify-center ${bgColor}`}>
      <Arrow />
    </button>
  )
}
