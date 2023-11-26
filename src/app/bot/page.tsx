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

  return (
    <div className="flex flex-col justify-end h-screen bg-gray-100 w-full">
      <Form />
    </div>
  )
}
