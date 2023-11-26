import { MessageContentImageFile, MessageContentText } from 'openai/resources/beta/threads/messages/messages'

export interface MessageProps {
  threadId: string
  content: string
}

export interface AssistantProps {
  threadId: string
}

export interface RunProps extends AssistantProps {
  runId: string
}

type MessageContent = MessageContentImageFile | MessageContentText

export const isMessageContentText = (content: MessageContent): content is MessageContentText => {
  return (content as MessageContentText).text !== undefined
}
