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

const createThread = async (): Promise<Thread> => {
  const thread = await openai.beta.threads.create()
  console.log({ thread })

  return thread
}

const addMessageToThread = (thread: Thread, content: string): Promise<ThreadMessage> =>
  openai.beta.threads.messages.create(thread.id, {
    content,
    role: 'user',
  })

const runAssistant = async (thread: Thread): Promise<Run> => {
  const run = await openai.beta.threads.runs.create(thread.id, {
    assistant_id: 'asst_X6WJHOogJWl9IQxR4ZxxnzdB',
  })

  return run
}

const checkRunStatus = async (thread: Thread, run: Run): Promise<Run> => {
  const runStatus = openai.beta.threads.runs.retrieve(thread.id, run.id)

  return runStatus
}

const getResponse = async (thread: Thread) => {
  const list = await openai.beta.threads.messages.list(thread.id)
  console.log({ list })

  return list.data
}

export const openAi = { addMessageToThread, checkRunStatus, createThread, getResponse, runAssistant }
