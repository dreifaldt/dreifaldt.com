import { FC } from 'react'

interface InputProps {
  value: string
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (event: React.FormEvent<HTMLButtonElement>) => void
}

export const Input: FC<InputProps> = ({ value, onChange, onSubmit }) => {
  return (
    <>
      <input
        type="text"
        placeholder="Type your message..."
        value={value}
        onChange={onChange}
        className="w-full px-3 py-2 rounded-full border focus:outline-none focus:ring focus:border-blue-300"
      />
      <button
        onClick={onSubmit}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring focus:bg-blue-600"
      >
        Send
      </button>
    </>
  )
}
