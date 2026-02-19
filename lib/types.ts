export type MessageRole = 'user' | 'assistant' | 'command' | 'system'

export type Message = {
  id: string
  role: MessageRole
  content: string
  items?: { label: string; value: string; url?: string }[]
  isStreaming?: boolean
}
