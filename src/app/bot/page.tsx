'use client'

import { ChangeEvent, FormEvent, Suspense, useState } from 'react'
import Loading from './loading'

export default function BotPage() {
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState<string[]>([])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessages((prevValue) => [...prevValue, value])
    setValue('')
  }

  return (
    <div className="content-center">
      <h1 className="text-3xl font-bold underline">&lt; Vendy &gt;</h1>
      <Suspense fallback={<Loading />}></Suspense>
    </div>
  )
}
