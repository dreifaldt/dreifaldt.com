'use client'
import { getHttpsLinks } from '@/utils/text'
import { FC } from 'react'

interface MessageProps {
  text: string
  sender: string
}

export const Message: FC<MessageProps> = ({ text, sender }) => {
  const newText = `${text} https://surfers.se/kitesurfing/kites/cabrinha-kites/cabrinha-kite-moto-x-2023 `
  const links = getHttpsLinks(newText) || []

  return (
    <div className={`flex flex-col gap-4 py-4 px-4`}>
      <p className="font-bold text-sm text-gray-700">{sender}</p>
      <p>{text}</p>
      {links.map((link, index) => (
        <a key={index} href="#" style={{ display: 'block', fontSize: 'small' }}>
          {link}
        </a>
      ))}
    </div>
  )
}
