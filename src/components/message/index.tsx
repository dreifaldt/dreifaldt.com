import { FC } from 'react'
import { Wave } from '../icon/wave'

interface MessageProps {
  text: string
  index: number
}

export const Message: FC<MessageProps> = ({ text, index }) => {
  const bgColor = index % 2 === 0 ? 'bg-gray-100' : 'bg-blue-50 bg-opacity-50'
  return (
    <div className={`flex gap-4 py-4 px-4 ${bgColor}`}>
      <div className="w-10 h-10 overflow-hidden border-4 border-blue-900 rounded-full bg-blue-100 justify-center items-center">
        <Wave size={40} />
      </div>
      <p className="text-base text-blue-950 font-bold">{text}</p>
    </div>
  )
}
