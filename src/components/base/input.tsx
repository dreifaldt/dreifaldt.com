import { ChangeEvent, FC, FormEvent, MutableRefObject } from 'react'
import { IconButton } from './button'

interface InputProps {
  value: string
  isLoading: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  name: string
}

export const Input: FC<InputProps> = ({ value, isLoading, onChange, name }) => {
  return (
    <div
      className={
        'flex rounded-xl border-2 border-gray-300 items-center py-2 px-4 mx-4 my-4 shadow-inner shadow-slate-200 mt-auto max-w-lg'
      }
    >
      {isLoading && (
        <div className="flexbox animate-spin">
          <div className="triple-spinner" />
        </div>
      )}
      <input
        id="quest"
        disabled={isLoading}
        name={name}
        type="text"
        placeholder="Skriv ditt meddelande..."
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 focus:outline-none bg-transparent text-slate-600"
        onKeyDown={(e) => {
          if (e.key === 'Escape') onChange({ target: { value: '' } } as ChangeEvent<HTMLInputElement>)
        }}
        data-1p-ignore
      />
      <IconButton disabled={isLoading || !value} />
    </div>
  )
}
