import type { Message } from '@/lib/types'

type Props = {
  messages: Message[]
}

export default function MessageList({ messages }: Props) {
  return (
    <div className="flex flex-col gap-3 flex-1 overflow-y-auto px-4 py-4">
      {messages.map(msg => (
        <MessageItem key={msg.id} message={msg} />
      ))}
    </div>
  )
}

function MessageItem({ message }: { message: Message }) {
  if (message.role === 'user') {
    return (
      <div className="flex gap-2">
        <span className="text-[#4caf50]">&gt;</span>
        <span className="text-[#e0e0e0]">{message.content}</span>
      </div>
    )
  }

  if (message.items) {
    return (
      <div className="pl-4 flex flex-col gap-1">
        {message.items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-[#00bcd4] w-24 shrink-0">{item.label}</span>
            <span className="text-[#555]">—</span>
            {item.url ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer"
                className="text-[#e0e0e0] hover:text-[#00bcd4] underline underline-offset-2">
                {item.value}
              </a>
            ) : (
              <span className="text-[#e0e0e0]">{item.value}</span>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="pl-4 text-[#e0e0e0] leading-relaxed">
      {message.content}
      {message.isStreaming && (
        <span data-testid="streaming-cursor"
          className="inline-block w-2 h-4 bg-[#e0e0e0] ml-1 animate-pulse" />
      )}
    </div>
  )
}
