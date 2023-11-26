'use server'

import { api } from '@/api/apiClient'
import { ThreadMessage } from 'openai/resources/beta/threads/index.mjs'
import { Run } from 'openai/resources/beta/threads/runs/runs.mjs'
import { Thread } from 'openai/resources/beta/threads/threads.mjs'

export async function sendRunAndGetMessage(question: string, thread: Thread) {
  'use server'

  async function pollingRunStatus(thread: Thread, run: Run): Promise<ThreadMessage[]> {
    const response = await api.checkRunStatus(thread, run)

    if (response.status === 'completed') {
      const response = await api.getResponse(thread)

      return response
    } else if (response.status === 'requires_action') {
      return [{ content: [{ text: { value: 'requires_action' } }], role: 'assistant' }] as ThreadMessage[]
    } else if (response.status === 'in_progress') {
      return await pollingRunStatus(thread, run)
    } else if (response.status === 'queued') {
      return await pollingRunStatus(thread, run)
    } else {
      return [{ content: [{ text: { value: 'Should never happen' } }], role: 'assistant' }] as ThreadMessage[]
    }
  }

  await api.addMessageToThread(thread, question)

  const run = await api.runAssistant(thread)
  const reponse = await pollingRunStatus(thread, run)

  return reponse
}

export async function createThread() {
  'use server'

  return await api.createThread()
}
