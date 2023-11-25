'use client'
import { FC } from 'react'

interface MessageProps {
  text: string
  sender: string
}

export const Message: FC<MessageProps> = ({ text, sender }) => {
  return (
    <div className={`flex flex-col gap-4 py-4 px-4`}>
      <p className="font-bold text-sm text-gray-700">{sender}</p>
      <p>{text}</p>
    </div>
  )
}
