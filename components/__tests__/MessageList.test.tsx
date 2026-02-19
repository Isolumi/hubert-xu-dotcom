import { render, screen } from '@testing-library/react'
import MessageList from '../MessageList'
import type { Message } from '@/lib/types'

const messages: Message[] = [
  { id: '1', role: 'user', content: '/about' },
  { id: '2', role: 'command', content: "Hi, I'm Hubert." },
  { id: '3', role: 'assistant', content: 'Streaming response', isStreaming: true },
]

describe('MessageList', () => {
  it('renders user messages', () => {
    render(<MessageList messages={messages} />)
    expect(screen.getByText('/about')).toBeInTheDocument()
  })

  it('renders command output', () => {
    render(<MessageList messages={messages} />)
    expect(screen.getByText("Hi, I'm Hubert.")).toBeInTheDocument()
  })

  it('renders streaming indicator on streaming messages', () => {
    render(<MessageList messages={messages} />)
    expect(screen.getByTestId('streaming-cursor')).toBeInTheDocument()
  })
})
