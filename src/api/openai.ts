import OpenAi from 'openai'
import { OPENAI_TOKEN } from '@/utils/env'
import { Thread } from 'openai/resources/beta/threads/threads'
import { MessageCreateParams, ThreadMessage } from 'openai/resources/beta/threads/messages/messages'
import { Run } from 'openai/resources/beta/threads/runs/runs'
import mixpanel from 'mixpanel-browser'
import { log } from 'console'

const openai = new OpenAi({
  apiKey: OPENAI_TOKEN,
  dangerouslyAllowBrowser: true,
  organization: 'org-ZR444RVRXOTctJDoUIJtw0vW',
})

const createThread = async (): Promise<Thread> => {
  const thread = await openai.beta.threads.create()

  const asd = fetch('https://api.openai.com/v1/engines/davinci/completions')
  log(asd)

  // Set this to a unique identifier for the user performing the event.
  mixpanel.identify(thread.id)
  // Track an event. It can be anything, but in this example, we're tracking a Sign Up event.
  mixpanel.track('THREAD_CREATED', thread)

  return thread
}

const addMessageToThread = async (thread: Thread, content: MessageCreateParams['content']): Promise<ThreadMessage> => {
  const message = await openai.beta.threads.messages.create(thread.id, {
    content,
    role: 'user',
  })

  return message
}

const runAssistant = async (thread: Thread): Promise<Run> => {
  return await openai.beta.threads.runs.create(thread.id, {
    assistant_id: 'asst_X6WJHOogJWl9IQxR4ZxxnzdB',
    instructions: 'Please address the user as Jane Doe. The user has a premium account.',
  })
}

export const openAi = { addMessageToThread, createThread, runAssistant }
