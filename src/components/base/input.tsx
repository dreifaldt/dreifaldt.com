import { ChangeEvent, FC, FormEvent } from 'react'
import { IconButton } from './button'

interface InputProps {
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLButtonElement>) => void
}

export const Input: FC<InputProps> = ({ value, onChange, onSubmit }) => {
  return (
    <div className="flex rounded-xl border-2 border-gray-700 items-center py-2 px-4 m-4">
      <input
        type="text"
        placeholder="Type your message..."
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 focus:outline-none bg-transparent"
      />
      <IconButton onClick={onSubmit} />
    </div>
  )
}
