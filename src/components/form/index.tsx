'use client'
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages.mjs'
import { Thread } from 'openai/resources/beta/threads/threads.mjs'
import { ChangeEvent, FC, useRef, useState } from 'react'
import { Input, Message } from '..'
import { useMixpanel } from '@/hooks/useMixpanel'
import { createThread, sendRunAndGetMessage } from './action'
import { isMessageContentText } from '@/utils/assistant/types'

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

  const action = async (data: FormData) => {
    try {
      setLoading(true)
      // optimisticly add question to conversation
      setConversation((prev) => [...prev, { role: 'user', text: question }])

      let threadData = thread
      if (!threadData) {
        // maybe create thread
        threadData = await createThread()
        setThread(threadData)
      }
      const question = data.get('question') as string
      console.log({ question })
      console.log({ threadData })

      if (!question || !threadData) return

      const response = await sendRunAndGetMessage(question, threadData)
      if (!response) return

      const parsedConversation = response
        .map((message) => {
          const text = isMessageContentText(message.content[0]) ? message.content[0].text.value : ''
          return { role: message.role, text }
        })
        .reverse()

      // set conversation from gpt
      setConversation(parsedConversation)
    } catch (error) {
      console.log({ error })
    } finally {
      setLoading(false)
      setQuestion('')
    }
  }

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
