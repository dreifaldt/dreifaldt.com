'use client'

import { ChangeEvent, FormEvent, Suspense, useState } from 'react'
import Loading from './loading'
import { Input, Message } from '@/components'

export default function BotPage() {
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState<string[]>(['', ''])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleSubmit = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setMessages((prevValue) => [...prevValue, value])
    setValue('')
  }

  const text =
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptates, voluptatem, iusto, quibusdam quia voluptatum.'

  return (
    <div className="container flex flex-col justify-end h-screen">
      {messages.map((message, index) => (
        <Message key={index} index={index} text={text} />
      ))}
      <Input value={value} onChange={handleInputChange} onSubmit={handleSubmit} />
      <Suspense fallback={<Loading />}></Suspense>
    </div>
  )
}
