'use client'

import { ChangeEvent, FormEvent, Suspense, useState } from 'react'
import { Input, Message } from '@/components'
import Loading from './loading'
import { useMixpanel } from '@/hooks/useMixpanel'

export default function BotPage() {
  useMixpanel()
  const conversation = [{ role: 'user', text: 'Hej!' }]
  const [message, setMessage] = useState('')

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }

  const handleSubmit = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault()

    setMessage('')
  }

  return (
    <div className="container flex flex-col justify-end h-screen">
      {conversation.map((message, index) => {
        const sender = message?.role === 'assistant' ? 'Snygg-Per' : 'User'
        const messageText = message?.text || ''
        return <Message key={index} sender={sender} text={messageText} />
      })}
      <Input value={message} onChange={handleInputChange} onSubmit={handleSubmit} />
      <Suspense fallback={<Loading />}></Suspense>
      {/* <button onClick={() => refetch()}>Refetch</button> */}
    </div>
  )
}
