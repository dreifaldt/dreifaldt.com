'use client'

import { ChangeEvent, FormEvent, Suspense, useState } from 'react'
import { Input, Message } from '@/components'
import Loading from './loading'
import { useMixpanel } from '@/hooks/useMixpanel'

export default function BotPage() {
  useMixpanel()
  const conversation = [
    { role: 'user', text: 'Hej!' },
    {
      role: 'assistant',
      text: 'Hej! Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum Lorem Ipsum ',
    },
  ]
  const [message, setMessage] = useState('')

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }

  const onSubmit = async (event: FormEvent<HTMLButtonElement | HTMLInputElement>) => {
    event.preventDefault()

    // lastly clear the input field
    setMessage('')
  }

  return (
    <div className="container flex flex-col justify-end h-screen bg-yellow-50 w-full bg-opacity-10">
      {conversation.map((message, index) => {
        const sender = message?.role === 'assistant' ? 'Snygg-Per' : 'User'
        const messageText = message?.text || ''
        return <Message key={index} sender={sender} text={messageText} />
      })}

      <Input value={message} onChange={onChange} onSubmit={onSubmit} />

      <Suspense fallback={<Loading />}></Suspense>
      {/* <button onClick={() => refetch()}>Refetch</button> */}
    </div>
  )
}
