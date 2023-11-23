import { openAi } from '@/api/apiClient'
import { ThreadMessagesPage } from 'openai/resources/beta/threads/messages/messages'
import { Run } from 'openai/resources/beta/threads/runs/runs'
import { Thread } from 'openai/resources/beta/threads/threads'
import { AssistantProps, MessageProps, RunProps } from './types'

const sendMessage = async ({ threadId, content }: MessageProps) => {
  const message = await openAi.beta.threads.messages.create(threadId, {
    content,
    role: 'user',
  })

  return message
}

const createThread = async (): Promise<Thread> => {
  const thread = await openAi.beta.threads.create({})

  return thread
}

const runAssistant = async ({ threadId }: AssistantProps): Promise<Run> => {
  const run = await openAi.beta.threads.runs.create(threadId, {
    assistant_id: 'asst_X6WJHOogJWl9IQxR4ZxxnzdB',
  })

  return run
}

const runStatus = async ({ threadId, runId }: RunProps): Promise<Run> => {
  const run = await openAi.beta.threads.runs.retrieve(threadId, runId)

  return run
}

const getResponse = async ({ threadId }: AssistantProps): Promise<ThreadMessagesPage> => {
  const messages = await openAi.beta.threads.messages.list(threadId)

  return messages
}

export const assistant = {
  createThread,
  getResponse,
  runAssistant,
  runStatus,
  sendMessage,
}
