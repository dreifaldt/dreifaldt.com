'use client'

import { Input, Message } from '@/components'
import { assistant } from '@/utils/assistant'
import { MIXPANEL_TOKEN } from '@/utils/env'
import mixpanel from 'mixpanel-browser'
import { Run } from 'openai/resources/beta/threads/runs/runs'
import { Thread } from 'openai/resources/beta/threads/threads'
import { ChangeEvent, FormEvent, Suspense, useEffect, useState } from 'react'
import Loading from './loading'

export default function BotPage() {
  const [message, setMessage] = useState('')
  const [thread, setThread] = useState<Thread | null>(null)
  const [run, setRun] = useState<Run | null>(null)

  const [messages, setMessages] = useState<string[]>([
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptates, voluptatem, iusto, quibusdam quia voluptatum.',
    'Hello!',
  ])

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }

  const handleSubmit = (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault()
    setMessages((prevValue) => [...prevValue, message])
    setMessage('')
  }

  const createThread = async () => {
    // A Thread represents a conversation
    const thread = await assistant.createThread()
    setThread(thread)

    // Set this to a unique identifier for the user performing the event.
    mixpanel.identify(thread.id)
    // Track an event. It can be anything, but in this example, we're tracking a Sign Up event.
    mixpanel.track('THREAD_CREATED', thread)
  }

  useEffect(() => {
    try {
      console.log('INIT_MIXPANEL')
      mixpanel.init(MIXPANEL_TOKEN, {
        debug: false,
        ignore_dnt: true,
        persistence: 'localStorage',
        track_pageview: false,
      })
    } catch (error) {
      console.log({ error })
    }
  }, [])

  return (
    <div
      className="container flex flex-col justify-end h-screen"
      onClick={async () => {
        if (!thread?.id || !message) {
          await createThread()
          alert('Created message thread')
          return
        }

        assistant.sendMessage({ content: message, threadId: thread.id })
      }}
    >
      {messages.map((message, index) => (
        <Message key={index} sender={index % 2 ? 'User' : 'Snygg-Per'} text={message} />
      ))}
      <Input value={message} onChange={handleInputChange} onSubmit={handleSubmit} />
      <Suspense fallback={<Loading />}></Suspense>
    </div>
  )
}
