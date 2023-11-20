import { ChangeEvent, FC, FormEvent } from 'react'
import { IconButton } from './button'

interface InputProps {
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLButtonElement>) => void
}

export const Input: FC<InputProps> = ({ value, onChange, onSubmit }) => {
  return (
    <div className={'flex rounded-xl border-2 border-gray-300 items-center py-2 px-4 mx-4 my-4'}>
      <input
        type="text"
        placeholder="Skriv ditt meddelande..."
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 focus:outline-none bg-transparent"
      />
      <IconButton onClick={onSubmit} active={Boolean(value)} />
    </div>
  )
}
