'use server'

import { api } from '@/api/apiClient'
import { Run } from 'openai/resources/beta/threads/runs/runs.mjs'
import { Thread } from 'openai/resources/beta/threads/threads.mjs'

export async function sendRunAndGetMessage(question: string, thread: Thread) {
  'use server'

  async function pollingRunStatus(thread: Thread, run: Run) {
    const response = await api.checkRunStatus(thread, run)

    if (response.status === 'completed') {
      const response = await api.getResponse(thread)

      return response
    } else if (response.status === 'requires_action') {
    } else if (response.status === 'in_progress') {
      pollingRunStatus(thread, run)
    } else if (response.status === 'queued') {
      pollingRunStatus(thread, run)
    } else {
      return
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
