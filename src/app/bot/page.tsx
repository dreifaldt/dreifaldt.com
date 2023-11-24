'use client'

import { assistant } from '@/utils/assistant'
import { MIXPANEL_TOKEN } from '@/utils/env'
import mixpanel from 'mixpanel-browser'
import { Thread } from 'openai/resources/beta/threads/threads'
import { ChangeEvent, FormEvent, Suspense, useEffect, useState } from 'react'
import {
  MessageContentImageFile,
  MessageContentText,
  ThreadMessage,
} from 'openai/resources/beta/threads/messages/messages'
import { Input, Message } from '@/components'
import Loading from './loading'
import { query } from '@/query'
import { Run } from 'openai/resources/beta/threads/runs/runs'

type MessageContent = MessageContentImageFile | MessageContentText

function isMessageContentText(content: MessageContent): content is MessageContentText {
  return (content as MessageContentText).text !== undefined
}

export default function BotPage() {
  const [message, setMessage] = useState('')
  const [thread, setThread] = useState<Thread | null>(null)
  const [threadMessage, setThreadMessage] = useState<ThreadMessage | null>(null)
  const [run, setRun] = useState<Run | any>(null)

  // const { refetch } = query.useRunStatus({ runId: run?.id || '', threadId: thread?.id || '' })
  const { data, refetch } = query.useResponseList({ threadId: thread?.id || '' })

  const conversation =
    data
      ?.map((item) => {
        if (isMessageContentText(item.content[0])) {
          return { role: item.role, text: item.content[0].text.value }
        }
      })
      .reverse() || []

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
      {conversation.map((message, index) => {
        const sender = message?.role === 'assistant' ? 'Snygg-Per' : 'User'
        const messageText = message?.text || ''
        return <Message key={index} sender={sender} text={messageText} />
      })}
      <Input value={message} onChange={handleInputChange} onSubmit={handleSubmit} />
      <Suspense fallback={<Loading />}></Suspense>
      <button onClick={() => refetch()}>Refetch</button>
    </div>
  )
}
