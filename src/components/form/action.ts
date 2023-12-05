'use server'

import { api } from '@/api/apiClient'
import { ThreadMessage } from 'openai/resources/beta/threads/index.mjs'
import { Run, RunSubmitToolOutputsParams } from 'openai/resources/beta/threads/runs/runs.mjs'
import { Thread } from 'openai/resources/beta/threads/threads.mjs'

export const actionAddMessage = async (question: string, thread: Thread) => {
  await api.addMessageToThread(thread, question)

  const run = await actionRunAssistant(thread)
  const reponse = await actionPollingRunStatus(thread, run)

  return reponse
}

export const actionRunAssistant = async (thread: Thread): Promise<Run> => {
  return await api.runAssistant(thread)
}

export const actionCreateThread = async () => {
  return await api.createThread()
}

export const actionGetRunState = async (thread: Thread, run: Run) => {
  return await api.getRunStatus(thread, run)
}

export const actionSubmitRunTools = async (
  thread: Thread,
  run: Run,
  tools: RunSubmitToolOutputsParams.ToolOutput[]
) => {
  return await api.submitToolOutputs(thread.id, run.id, tools)
}

export async function actionPollingRunStatus(thread: Thread, run: Run): Promise<ThreadMessage[] | Run> {
  const runResponse = await api.getRunStatus(thread, run)

  if (runResponse.status === 'completed') {
    return await api.getResponse(thread)
  }

  if (runResponse.status === 'requires_action') {
    return runResponse
  }

  if (runResponse.status === 'in_progress') {
    return await actionPollingRunStatus(thread, run)
  }

  if (runResponse.status === 'queued') {
    return await actionPollingRunStatus(thread, run)
  }

  if (runResponse.status === 'failed' || runResponse.status === 'cancelled') {
    console.log('Failed/Cancelled:')
    console.log(runResponse)

    return [{ content: [{ text: { value: 'Failed/Cancelled message fetch' } }], role: 'assistant' }] as ThreadMessage[]
  } else {
    console.log('Last else:')
    console.log(runResponse)

    return [{ content: [{ text: { value: 'Should never happen' } }], role: 'assistant' }] as ThreadMessage[]
  }
}
