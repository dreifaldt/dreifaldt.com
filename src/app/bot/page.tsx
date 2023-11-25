'use client'

import { ChangeEvent, FormEvent, Suspense, useState } from 'react'
import { Input, Message } from '@/components'
import Loading from './loading'
import { useMixpanel } from '@/hooks/useMixpanel'
import { queries } from '@/queries'
import { api } from '@/api/apiClient'
import { Run } from 'openai/resources/beta/threads/runs/runs'
import { Thread } from 'openai/resources/beta/threads/threads'
import { ThreadMessage, ThreadMessagesPage } from 'openai/resources/beta/threads/messages/messages'
import { isMessageContentText } from '@/utils/assistant/types'

export default function BotPage() {
  useMixpanel()

  const [conversation, setConversation] = useState<{ role: ThreadMessage['role']; text: string }[]>([])

  const [question, setQuestion] = useState('')
  const [isLoading, setLoading] = useState(false)

  const { data: thread } = queries.useGetThread()

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

  const onSubmit = async (event: FormEvent<HTMLButtonElement | HTMLInputElement>) => {
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
    <div className="container flex flex-col justify-end h-screen bg-yellow-50 w-full bg-opacity-10">
      {conversation.map((message, index) => {
        const sender = message.role === 'assistant' ? 'Snygg-Per' : 'User'
        return <Message key={index} sender={sender} text={message.text} />
      })}

      <Input value={question} onChange={onChange} onSubmit={onSubmit} isLoading={isLoading} />

      <Suspense fallback={<Loading />}></Suspense>
    </div>
  )
}
