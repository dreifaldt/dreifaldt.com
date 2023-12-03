import { FC } from 'react'
import Markdown from 'react-markdown'

interface MessageProps {
  text: string
  sender: string
}

export const Message: FC<MessageProps> = ({ text, sender }) => {
  return (
    <div className={`flex flex-col gap-4 py-4 px-4`}>
      <p className="font-bold text-sm text-gray-700">{sender}</p>
      <Markdown className="text-blue-950">{text}</Markdown>
    </div>
  )
}
