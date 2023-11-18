'use client'

import { ChangeEvent, FormEvent, Suspense, useState } from 'react'
import Loading from './loading'
import { Input } from '@/components'

export default function BotPage() {
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleSubmit = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setMessages((prevValue) => [...prevValue, value])
    setValue('')
  }

  return (
    <div className="flex flex-col flex-grow items-center justify-center h-screen">
      <h1 className="text-9xl my-auto">🤖</h1>
      <Input value={value} onChange={handleInputChange} onSubmit={handleSubmit} />
      <Suspense fallback={<Loading />}></Suspense>
    </div>
  )
}
