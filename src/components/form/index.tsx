'use client'
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages.mjs'
import { Thread } from 'openai/resources/beta/threads/threads.mjs'
import { ChangeEvent, FC, useEffect, useRef, useState } from 'react'
import { Input, Message } from '..'
import { trackError, trackMessage, useMixpanel } from '@/hooks/useMixpanel'
import { actionAddMessage, actionSubmitRunTools, actionCreateThread, actionPollingRunStatus } from './action'
import { isMessageContentText } from '@/utils/assistant/types'
import { removeBrackets } from '@/utils/text'

export const Form: FC = () => {
  const [thread, setThread] = useState<Thread | undefined>(undefined)

  useMixpanel(thread)
  const [conversation, setConversation] = useState<{ role: ThreadMessage['role']; text: string }[]>([])
  const [name, setName] = useState('User')

  useEffect(() => {
    const savedHistory = localStorage.getItem('history')
    if (!savedHistory) return

    const parsedHistory = savedHistory && JSON.parse(savedHistory)
    console.log({ parsedHistory })
    if (parsedHistory.conversation && parsedHistory.thread) {
      setConversation(parsedHistory.conversation)
      setThread(parsedHistory.thread)
      setName(parsedHistory.name)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('history', JSON.stringify({ conversation, name, thread }))
  }, [conversation, thread, name])

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
      // track question
      trackMessage(data.get('question') as string)
      // reset question
      setQuestion('')

      let usedThread = thread
      if (!usedThread) {
        // maybe create thread
        usedThread = await actionCreateThread()
        setThread(usedThread)
      }
      const question = data.get('question') as string

      if (!question) return

      const response = await actionAddMessage(question, usedThread)

      if (!response) {
        alert(JSON.stringify(response))
        return
      }

      if (Array.isArray(response)) {
        const parsedConversation = response
          .map((message: ThreadMessage) => {
            const text = isMessageContentText(message.content[0])
              ? removeBrackets(message.content[0].text.value)
              : 'Missing text value'

            return { role: message.role, text }
          })
          .reverse()

        // log last received message
        trackMessage(parsedConversation[parsedConversation.length - 1].text)

        // set conversation from gpt
        setConversation(parsedConversation)
      } else if (response.required_action?.type === 'submit_tool_outputs') {
        const nameToolCall = response.required_action.submit_tool_outputs.tool_calls.find(
          (tool) => tool.function.name === 'handle_user_name'
        )

        const toolCalls = response.required_action.submit_tool_outputs.tool_calls.map((toolCall) => ({
          output: 'done',
          tool_call_id: toolCall.id,
        }))

        if (nameToolCall) {
          setName(JSON.parse(nameToolCall.function.arguments)?.name || 'User')
        }

        await actionSubmitRunTools(usedThread, response, toolCalls)
        await actionPollingRunStatus(usedThread, response)
      }
    } catch (error) {
      console.log({ error })
      trackError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col bg-gray-100 w-ful min-h-screen">
      {conversation.map((message, index) => {
        const sender = message.role === 'assistant' ? 'Kite-surfarens Guide' : name

        return <Message key={index} sender={sender} text={message.text} />
      })}

      <form action={action} ref={formRef} className="mt-auto">
        <Input value={storedQuestion} onChange={onChange} name={'question'} />
      </form>
    </div>
  )
}
