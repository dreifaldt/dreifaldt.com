'use client'
import { ThreadMessage } from "openai/resources/beta/threads/messages/messages.mjs";
import { Thread } from "openai/resources/beta/threads/threads.mjs";
import { ChangeEvent,  FC,  useRef,  useState } from "react";
import { Input, Message } from "..";
import { getConversation } from "./action";

export const Form: FC = () => {
    // const { data: thread, error } = queries.useGetThread()

    const thread: Thread = {
    created_at: 1337,
    id: 'DUMMY_TEST_THREAD',
    metadata: null,
    object: 'thread',
  }
    const [conversation, setConversation] = useState<{ role: ThreadMessage['role']; text: string }[]>([])

  const [question, setQuestion] = useState('')
  const [isLoading, setLoading] = useState(false)
    const formRef = useRef<HTMLFormElement | null>(null)

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuestion(event.target.value)
  }

  const action = async (data: FormData) => {
    if (!thread) return
    setConversation((prevValue) => [...prevValue, { role: 'user', text: question }])
     formRef.current && formRef.current.reset()
    setQuestion('')

    const result = await getConversation(data, thread)
       result &&  setConversation(result)
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