import { FC, FormEvent } from 'react'
import { Arrow } from '../icon/arrow'

interface IconButtonProps {
  disabled: boolean
}

export const IconButton: FC<IconButtonProps> = ({ disabled }) => {
  const bgColor = disabled ? 'bg-slate-200' : 'bg-slate-300'
  const iconColor = disabled ? '#696969' : '#000'
  return (
    <button className={`flex w-8 h-8 rounded-md items-center justify-center shadow-md ${bgColor}`} disabled={disabled}>
      <Arrow color={iconColor} />
    </button>
  )
}
