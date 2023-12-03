'use client'
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages.mjs'
import { Thread } from 'openai/resources/beta/threads/threads.mjs'
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { Input, Message } from '..'
import { useMixpanel } from '@/hooks/useMixpanel'
import { createThread, sendRunAndGetMessage } from './action'
import { isMessageContentText } from '@/utils/assistant/types'

export const Form: FC = () => {
  const [thread, setThread] = useState<Thread | undefined>(undefined)

  useMixpanel(thread)
  const [conversation, setConversation] = useState<{ role: ThreadMessage['role']; text: string }[]>([])

  useEffect(() => {
    const savedHistory = localStorage.getItem('history')
    if (!savedHistory) return

    const parsedHistory = savedHistory && JSON.parse(savedHistory)
    console.log({ parsedHistory })
    if (parsedHistory.conversation && parsedHistory.thread) {
      setConversation(parsedHistory.conversation)
      setThread(parsedHistory.thread)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify({ conversation, thread }))
  }, [conversation, thread])

  const [storedQuestion, setQuestion] = useState('')
  const [isLoading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement | null>(null)

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value)
  }

  const action = async (data: FormData) => {
    try {
      if (isLoading) {
        alert('Vänta lite, vi laddar!')
      }
      setLoading(true)
      // optimisticly add question to conversation
      setConversation((prev) => [...prev, { role: 'user', text: question }])
      // reset question
      setQuestion('')

      let usedThread = thread
      if (!usedThread) {
        // maybe create thread
        usedThread = await createThread()
        setThread(usedThread)
      }
      const question = data.get('question') as string

      if (!question || !thread) return

      const response = await sendRunAndGetMessage(question, usedThread)

      if (!response) {
        alert(JSON.stringify(response))
        return
      }

      const parsedConversation = response
        .map((message: ThreadMessage) => {
          const text = isMessageContentText(message.content[0]) ? message.content[0].text.value : 'Missing text value'
          return { role: message.role, text }
        })
        .reverse()

      // set conversation from gpt
      setConversation(parsedConversation)
    } catch (error) {
      console.log({ error })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col bg-gray-100 w-ful min-h-screen">
      {conversation.map((message, index) => {
        const sender = message.role === 'assistant' ? 'Snygg-Per' : 'User'
        return <Message key={index} sender={sender} text={message.text} />
      })}

      <form action={action} ref={formRef} className="mt-auto">
        <Input value={storedQuestion} onChange={onChange} name={'question'} />
      </form>
    </div>
  )
}
