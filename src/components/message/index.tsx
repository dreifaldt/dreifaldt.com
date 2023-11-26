'use client'
import { getHttpsLinks } from '@/utils/text'
import { FC } from 'react'

interface MessageProps {
  text: string
  sender: string
}

export const Message: FC<MessageProps> = ({ text, sender }) => {
  const links = getHttpsLinks(text) || []

  return (
    <div className={`flex flex-col gap-4 py-4 px-4`}>
      <p className="font-bold text-sm text-gray-700">{sender}</p>
      <p className="text-blue-950">{text}</p>

      {links.map((link, index) => (
        <a
          key={index}
          href={link}
          className="text-blue-500 font-bold text-xs"
          target="_blank"
          rel="noopener noreferrer"
        >
          Länk {index + 1}
        </a>
      ))}
    </div>
  )
}
