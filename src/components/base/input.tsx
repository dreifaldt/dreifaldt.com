'use client'

import { ChangeEvent, FC, FormEvent } from 'react'
import { IconButton } from './button'

interface InputProps {
  value: string
  isLoading?: boolean
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  name: string
  onSubmit?: (event: FormEvent<HTMLButtonElement | HTMLInputElement | HTMLFormElement>) => void
}

export const Input: FC<InputProps> = ({ value, isLoading, onChange, name }) => {
  return (
    <div
      className={
        'flex rounded-xl border-2 border-gray-300 items-center py-2 px-4 mx-4 my-4 shadow-inner shadow-slate-200 mt-auto max-w-lg'
      }
    >
      {isLoading && (
        <div className="flexbox">
          <div className="triple-spinner" />
        </div>
      )}
      <input
        disabled={isLoading}
        name={name}
        type="text"
        placeholder="Skriv ditt meddelande..."
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 focus:outline-none bg-transparent text-slate-600"
        onKeyDown={(e) => {
          // if (e.key === 'Enter') onSubmit(e)
          if (e.key === 'Escape') onChange({ target: { value: '' } } as ChangeEvent<HTMLInputElement>)
        }}
      />
      {/* <IconButton onClick={onSubmit} disabled={isLoading || !value} /> */}
    </div>
  )
}
