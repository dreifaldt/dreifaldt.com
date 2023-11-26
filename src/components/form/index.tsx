'use client'
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages.mjs'
import { Thread } from 'openai/resources/beta/threads/threads.mjs'
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { Input, Message } from '..'
import { useMixpanel } from '@/hooks/useMixpanel'
import { api } from '@/api/apiClient'
import { action } from './action'

export const Form: FC = () => {
  const [thread, setThread] = useState<Thread | undefined>(undefined)

  useMixpanel(thread)

  const [conversation, setConversation] = useState<{ role: ThreadMessage['role']; text: string }[]>([])

  const [question, setQuestion] = useState('')
  const [isLoading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement | null>(null)

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value)
  }

  useEffect(() => {
    const fetchThread = async () => {
      const thread = await api.createThread()
      setThread(thread)
    }

    fetchThread()
  }, [])

  return (
    <div className="flex flex-col justify-end h-screen bg-gray-100 w-full">
      {conversation.map((message, index) => {
        const sender = message.role === 'assistant' ? 'Snygg-Per' : 'User'
        return <Message key={index} sender={sender} text={message.text} />
      })}

      <form action={action} ref={formRef}>
        <Input value={question} onChange={onChange} name={'question'} isLoading={isLoading} />
      </form>
    </div>
  )
}
