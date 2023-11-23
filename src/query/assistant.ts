import { assistant } from '@/utils/assistant'
import { AssistantProps, RunProps } from '@/utils/assistant/types'
import { useQuery } from '@tanstack/react-query'

export const useRunStatus = ({ threadId, runId }: RunProps) => {
  console.log('useRunStatus', { runId, threadId })

  return useQuery({
    enabled: !!runId && !!threadId,
    queryFn: () => assistant.getRunStatus({ runId, threadId }),
    queryKey: ['runStatus'],
    refetchInterval: 5000,
  })
}

export const useResponseList = ({ threadId }: AssistantProps) => {
  return useQuery({
    enabled: !!threadId,
    queryFn: () => assistant.getResponse({ threadId }),
    queryKey: ['responseList'],
  })
}

export const assistantQuery = {
  useResponseList,
  useRunStatus,
}
