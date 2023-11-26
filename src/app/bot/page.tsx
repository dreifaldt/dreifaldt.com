
import { Form } from '@/components/form'
import { useMixpanel } from '@/hooks/useMixpanel'


export default function Bot() {


  // const thread: Thread = {
  //   created_at: 1337,
  //   id: 'DUMMY_TEST_THREAD',
  //   metadata: null,
  //   object: 'thread',
  // }

  //  useMixpanel(thread)


  return (
    // <Suspense fallback={<Loading />}>
      <main>
        <h1>bot page</h1>
        <Form />  


      </main>
    // </Suspense>
  )
}
