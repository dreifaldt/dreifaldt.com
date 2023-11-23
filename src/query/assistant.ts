import { assistant } from '@/utils/assistant'
import { AssistantProps } from '@/utils/assistant/types'
import { useQuery } from '@tanstack/react-query'

export const useAssistantResponse = ({ threadId }: AssistantProps) => {
  return useQuery({
    enabled: !!threadId,
    queryFn: () => assistant.getResponse({ threadId }),
    queryKey: ['assistantResponse'],
  })
}
