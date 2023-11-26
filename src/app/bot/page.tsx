'use client'

import { useMixpanel } from '@/hooks/useMixpanel'
import { queries } from '@/queries'
import Image from 'next/image'
import { Run, Thread, ThreadMessage, ThreadMessagesPage } from 'openai/resources/beta/threads/index.mjs'
import { useFormState } from 'react-dom'
import { ChangeEvent, FormEvent, Suspense, useEffect, useState } from 'react'
import { api } from '@/api/apiClient'
import { Input, Message } from '@/components'
import Loading from './loading'
import { isMessageContentText } from '@/utils/assistant/types'
import { log } from 'console'

export default function Bot() {
  // const thread: Thread = {
  //   created_at: 1337,
  //   id: 'DUMMY_TEST_THREAD',
  //   metadata: null,
  //   object: 'thread',
  // }

  const { data: thread, error } = queries.useGetThread()

  useMixpanel(thread)

  const [conversation, setConversation] = useState<{ role: ThreadMessage['role']; text: string }[]>([])

  const [question, setQuestion] = useState('')
  const [isLoading, setLoading] = useState(false)

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value)
  }

  const pollingRunStatus = async (thread: Thread, run: Run) => {
    const response = await api.checkRunStatus(thread, run)

    if (response.status === 'completed') {
      const response: ThreadMessagesPage = await api.getResponse(thread)

      const parsedConversation = response.data
        .map((message) => {
          const text = isMessageContentText(message.content[0]) ? message.content[0].text.value : ''
          return { role: message.role, text }
        })
        .reverse()

      setConversation(parsedConversation)
      return
    } else if (response.status === 'requires_action') {
      alert('requires action')
    } else if (response.status === 'in_progress') {
      pollingRunStatus(thread, run)
    } else if (response.status === 'queued') {
      pollingRunStatus(thread, run)
    }
  }

  const onSubmit = async (event: FormEvent<HTMLButtonElement | HTMLInputElement | HTMLFormElement>) => {
    event.preventDefault()

    if (!thread) return
    setLoading(true)

    await api.addMessageToThread(thread, question)

    setConversation((prevValue) => [...prevValue, { role: 'user', text: question }])
    setQuestion('')

    const run = await api.runAssistant(thread)
    await pollingRunStatus(thread, run)
    setLoading(false)
  }

  return (
    <Suspense fallback={<Loading />}>
      <main>
        {/* <h1>bot page</h1> */}
        <div className="flex flex-col justify-end h-screen bg-gray-100 w-full">
          {conversation.map((message, index) => {
            const sender = message.role === 'assistant' ? 'Snygg-Per' : 'User'
            return <Message key={index} sender={sender} text={message.text} />
          })}

          <Input value={question} onChange={onChange} onSubmit={onSubmit} isLoading={isLoading} />
        </div>
      </main>
    </Suspense>
  )
}
