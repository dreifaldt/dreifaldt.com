'use client'

import { ChangeEvent, FormEvent, Suspense, useEffect, useState } from 'react'
import Loading from './loading'
import { Input, Message } from '@/components'
import mixpanel from 'mixpanel-browser'
import { MIXPANEL_TOKEN } from '@/utils/env'
import { openAi } from '@/api/apiClient'

export default function BotPage() {
  const [value, setValue] = useState('')
  const [messages, setMessages] = useState<string[]>([
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptates, voluptatem, iusto, quibusdam quia voluptatum.',
    'Hello!',
  ])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  const handleSubmit = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setMessages((prevValue) => [...prevValue, value])
    setValue('')
  }
  useEffect(() => {
    try {
      console.log('init mixpanel')
      mixpanel.init(MIXPANEL_TOKEN, {
        debug: false,
        track_pageview: false,
        persistence: 'localStorage',
        ignore_dnt: true,
      })

      // Set this to a unique identifier for the user performing the event.
      // mixpanel.identify('USER_ID')

      // Track an event. It can be anything, but in this example, we're tracking a Sign Up event.
      //mixpanel.track('INIT_CHAT')
    } catch (error) {
      console.log({ error })
    }
  }, [])

  return (
    <div
      className="container flex flex-col justify-end h-screen"
      onClick={async () => {
        const chatCompletion = await openAi.chat.completions.create({
          messages: [{ role: 'user', content: 'Say this is a test' }],
          model: 'gpt-3.5-turbo',
        })
        console.log({ chatCompletion })
      }}
    >
      {messages.map((message, index) => (
        <Message key={index} sender={index % 2 ? 'User' : 'Snygg-Per'} text={message} />
      ))}
      <Input value={value} onChange={handleInputChange} onSubmit={handleSubmit} />
      <Suspense fallback={<Loading />}></Suspense>
    </div>
  )
}
