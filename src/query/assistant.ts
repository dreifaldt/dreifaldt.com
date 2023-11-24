import { assistant } from '@/utils/assistant'
import { AssistantProps, RunProps } from '@/utils/assistant/types'
import { useQuery } from '@tanstack/react-query'

export const useRunStatus = ({ threadId, runId }: RunProps) => {
  return useQuery({
    enabled: !!runId && !!threadId,
    queryFn: async () => {
      const reponse = await assistant.getRunStatus({ runId, threadId })
      return reponse
    },
    queryKey: ['runStatus'],
    refetchInterval: 5000,
  })
}

export const useResponseList = ({ threadId }: AssistantProps) => {
  return useQuery({
    enabled: !!threadId,
    queryFn: async () => {
      const response = await assistant.getResponse({ threadId })
      return response.data
    },
    queryKey: ['responseList'],
  })
}

export const assistantQuery = {
  useResponseList,
  useRunStatus,
}
