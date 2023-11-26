// 'use client'
import { api } from '@/api/apiClient'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ThreadMessage } from 'openai/resources/beta/threads/messages/messages'
import { Thread } from 'openai/resources/beta/threads/threads'

// const queryClient = useQueryClient();
const useGetThread = () => {
  return useQuery({
    queryFn: api.createThread,
    queryKey: ['thread'],
  })
}
const useCreateMessage = () => {
  return useMutation<ThreadMessage, unknown, { thread: Thread; content: string }>({
    mutationFn: ({ thread, content }) => api.addMessageToThread(thread, content),
  })
}

export const assistantQuery = {
  useCreateMessage,
  useGetThread,
}
