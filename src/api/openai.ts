import OpenAi from 'openai'
import { OPENAI_TOKEN } from '@/utils/env'
import { Thread } from 'openai/resources/beta/threads/threads'
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages'
import { Run } from 'openai/resources/beta/threads/runs/runs'

const openai = new OpenAi({
  apiKey: OPENAI_TOKEN,
  dangerouslyAllowBrowser: true,
  organization: 'org-ZR444RVRXOTctJDoUIJtw0vW',
})

const createThread = (): Promise<Thread> => openai.beta.threads.create()

const addMessageToThread = (thread: Thread, content: string): Promise<ThreadMessage> =>
  openai.beta.threads.messages.create(thread.id, {
    content,
    role: 'user',
  })

const runAssistant = (thread: Thread): Promise<Run> =>
  openai.beta.threads.runs.create(thread.id, {
    assistant_id: 'asst_X6WJHOogJWl9IQxR4ZxxnzdB',
  })

const checkRunStatus = (thread: Thread, run: Run): Promise<Run> => openai.beta.threads.runs.retrieve(thread.id, run.id)

const getResponse = (thread: Thread) => openai.beta.threads.messages.list(thread.id)

export const openAi = { addMessageToThread, checkRunStatus, createThread, getResponse, runAssistant }
