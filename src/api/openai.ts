import OpenAi from 'openai'
import { OPENAI_TOKEN } from '@/utils/env'
import { Thread } from 'openai/resources/beta/threads/threads'
import { MessageCreateParams, ThreadMessage } from 'openai/resources/beta/threads/messages/messages'
import { Run } from 'openai/resources/beta/threads/runs/runs'
import mixpanel from 'mixpanel-browser'

const openai = new OpenAi({
  apiKey: OPENAI_TOKEN,
  dangerouslyAllowBrowser: true,
  organization: 'org-ZR444RVRXOTctJDoUIJtw0vW',
})

const createThread = async (): Promise<Thread> => {
  const thread = await openai.beta.threads.create()

  // Set this to a unique identifier for the user performing the event.
  mixpanel.identify(thread.id)
  // Track an event. It can be anything, but in this example, we're tracking a Sign Up event.
  mixpanel.track('THREAD_CREATED', thread)

  return thread
}

const addMessageToThread = (thread: Thread, content: MessageCreateParams['content']): Promise<ThreadMessage> =>
  openai.beta.threads.messages.create(thread.id, {
    content,
    role: 'user',
  })

const runAssistant = (thread: Thread): Promise<Run> =>
  openai.beta.threads.runs.create(thread.id, {
    assistant_id: 'asst_X6WJHOogJWl9IQxR4ZxxnzdB',
    instructions: 'Please address the user as Jane Doe. The user has a premium account.',
  })

const checkRunStatus = (thread: Thread, run: Run): Promise<Run> => openai.beta.threads.runs.retrieve(thread.id, run.id)

const getResponse = (thread: Thread) => openai.beta.threads.messages.list(thread.id)

export const openAi = { addMessageToThread, checkRunStatus, createThread, getResponse, runAssistant }
