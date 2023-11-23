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
