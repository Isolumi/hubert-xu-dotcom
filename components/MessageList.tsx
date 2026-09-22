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
        <span className="text-[#87b9ff]">&gt;</span>
        <span className="text-[#e8ece9]">{message.content}</span>
      </div>
    )
  }

  if (message.items) {
    return (
      <div className="pl-4 flex flex-col gap-1">
        {message.items.map((item, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-[#87b9ff] w-24 shrink-0">{item.label}</span>
            <span className="text-[#68716c]">—</span>
            {item.url ? (
              <a href={item.url} target="_blank" rel="noopener noreferrer"
                className="text-[#e8ece9] hover:text-[#87b9ff] focus-visible:text-[#87b9ff] outline-none underline underline-offset-2">
                {item.value}
              </a>
            ) : (
              <span className="text-[#e8ece9]">{item.value}</span>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="pl-4 text-[#e8ece9] leading-relaxed">
      {message.content}
      {message.isStreaming && (
        <span data-testid="streaming-cursor"
          className="inline-block w-2 h-4 bg-[#87b9ff] ml-1 animate-pulse" />
      )}
    </div>
  )
}
