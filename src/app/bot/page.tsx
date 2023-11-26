
import { Form } from '@/components/form'
import { useMixpanel } from '@/hooks/useMixpanel'


export default function Bot() {
  // const thread: Thread = {
  //   created_at: 1337,
  //   id: 'DUMMY_TEST_THREAD',
  //   metadata: null,
  //   object: 'thread',
  // }

  // const { data: thread } = queries.useGetThread()

  // useMixpanel(thread)


  return (
    // <Suspense fallback={<Loading />}>
      <main>
        <h1>bot page</h1>
        {/* <div className="flex flex-col justify-end h-screen bg-gray-100 w-full"> */}
          {/* {conversation.map((message, index) => {
            const sender = message.role === 'assistant' ? 'Snygg-Per' : 'User'
            return <Message key={index} sender={sender} text={message.text} />
          })}

          <Input value={question} onChange={onChange} onSubmit={onSubmit} isLoading={isLoading} /> */}
        {/* </div> */}
      </main>
    // </Suspense>
  )
}
