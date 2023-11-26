'use server'

import { api } from '@/api/apiClient'
import { isMessageContentText } from '@/utils/assistant/types'
import { ThreadMessagesPage } from 'openai/resources/beta/threads/messages/messages.mjs'
import { Run } from 'openai/resources/beta/threads/runs/runs.mjs'
import { Thread } from 'openai/resources/beta/threads/threads.mjs'

const pollingRunStatus = async (thread: Thread, run: Run) => {
  const response = await api.checkRunStatus(thread, run)

  if (response.status === 'completed') {
    const response: ThreadMessagesPage = await api.getResponse(thread)

    const parsedConversation = response.data
      .map((message) => {
        const text = isMessageContentText(message.content[0]) ? message.content[0].text.value : ''
        return { role: message.role, text }
      })
      .reverse()

    return parsedConversation
  } else if (response.status === 'requires_action') {
    alert('requires action')
  } else if (response.status === 'in_progress') {
    pollingRunStatus(thread, run)
  } else if (response.status === 'queued') {
    pollingRunStatus(thread, run)
  }
}

export async function action(question: string, thread: Thread) {
  await api.addMessageToThread(thread, question)

  const run = await api.runAssistant(thread)
  return await pollingRunStatus(thread, run)
}
