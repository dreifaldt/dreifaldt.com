import { ChangeEvent, FC, FormEvent } from 'react'
import { IconButton } from './button'
import '../../styles/spinner.css'

interface InputProps {
  value: string
  isLoading?: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: FormEvent<HTMLButtonElement | HTMLInputElement>) => void
}

export const Input: FC<InputProps> = ({ value, isLoading, onChange, onSubmit }) => {
  return (
    <>
      <div
        className={
          'flex rounded-xl border-2 border-gray-300 items-center py-2 px-4 mx-4 my-4 shadow-inner shadow-slate-200 mt-auto'
        }
      >
        {!isLoading && (
          <div className="flexbox">
            <div className="triple-spinner" />
          </div>
        )}
        <input
          type="text"
          placeholder="Skriv ditt meddelande..."
          value={value}
          onChange={onChange}
          className="w-full px-3 py-2 focus:outline-none bg-transparent"
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit(e)
            if (e.key === 'Escape') onChange({ target: { value: '' } } as ChangeEvent<HTMLInputElement>)
          }}
        />
        <IconButton onClick={onSubmit} active={Boolean(value)} />
      </div>
    </>
  )
}
