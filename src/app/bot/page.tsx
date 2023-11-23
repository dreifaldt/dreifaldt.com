'use client'

import { assistant } from '@/utils/assistant'
import { MIXPANEL_TOKEN } from '@/utils/env'
import mixpanel from 'mixpanel-browser'
import { Thread } from 'openai/resources/beta/threads/threads'
import { ChangeEvent, FormEvent, Suspense, useEffect, useState } from 'react'
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages'
import { Input, Message } from '@/components'
import Loading from './loading'
// import { query } from '@/query'
import { Run } from 'openai/resources/beta/threads/runs/runs'
import { openAi } from '@/api/apiClient'

export default function BotPage() {
  const [message, setMessage] = useState('')
  const [thread, setThread] = useState<Thread | null>(null)
  const [threadMessage, setThreadMessage] = useState<ThreadMessage | null>(null)
  const [run, setRun] = useState<Run | any>(null)

  const [messages, setMessages] = useState<string[]>([])

  // const statusQuery = query.useRunStatus({ runId: run?.id || '', threadId: thread?.id || '' })
  // const responseQuery = query.useResponseList({ threadId: thread?.id || '' })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }

  const handleSubmit = async (event: FormEvent<HTMLButtonElement>) => {
    event.preventDefault()

    let threadId = thread?.id

    if (!threadId) {
      const thread = await assistant.createThread()
      setThread(thread)
      threadId = thread.id

      // Set this to a unique identifier for the user performing the event.
      mixpanel.identify(thread.id)
      // Track an event. It can be anything, but in this example, we're tracking a Sign Up event.
      mixpanel.track('THREAD_CREATED', thread)

      alert('Created message thread!\n\nYou can now chat with Snygg-Per')

      return
    }

    const threadMessage = await assistant.createMessage({ content: message, threadId })
    setThreadMessage(threadMessage)

    const run = await assistant.createThreadRun({ threadId })
    setRun(run)

    setMessages((prevValue) => [...prevValue, message])
    setMessage('')
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
    <div className="container flex flex-col justify-end h-screen">
      {messages.map((message, index) => (
        <Message key={index} sender={index % 2 ? 'User' : 'Snygg-Per'} text={message} />
      ))}
      <Input value={message} onChange={handleInputChange} onSubmit={handleSubmit} />
      <Suspense fallback={<Loading />}></Suspense>
      <button
        onClick={async () => {
          const messages = await openAi.beta.threads.messages.list(thread?.id || '')

          console.log({ messages })
        }}
      >
        Log
      </button>
    </div>
  )
}
