'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import MessageList from './MessageList'
import InputBar from './InputBar'
import CommandPalette from './CommandPalette'
import { getCommand } from '@/lib/commands'
import type { Message } from '@/lib/types'

type Props = {
  onExitInteractive: () => void
}

let idCounter = 0
function nextId() { return String(++idCounter) }

export default function TUIScreen({ onExitInteractive }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nextId(),
      role: 'system',
      content: 'Welcome to lumicode. Type /help to see available commands.',
    },
  ])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Esc key exits interactive mode
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onExitInteractive()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onExitInteractive])

  const appendMessage = useCallback((msg: Omit<Message, 'id'>) => {
    setMessages(prev => [...prev, { ...msg, id: nextId() }])
  }, [])

  const handleSubmit = useCallback(async () => {
    const trimmed = input.trim()
    if (!trimmed) return

    setInput('')

    // User message
    appendMessage({ role: 'user', content: trimmed })

    // Slash command
    if (trimmed.startsWith('/')) {
      const commandName = trimmed.slice(1).split(' ')[0]
      const command = getCommand(commandName)

      if (!command) {
        appendMessage({ role: 'system', content: `Unknown command: ${trimmed}. Type /help for a list of commands.` })
        return
      }

      const output = command.handler()

      if (output.type === 'clear') {
        setMessages([])
        return
      }

      appendMessage({
        role: 'command',
        content: output.content ?? '',
        items: output.items,
      })
      return
    }

    // Natural language → Gemini
    setIsStreaming(true)
    const streamingId = nextId()
    setMessages(prev => [...prev, { id: streamingId, role: 'assistant', content: '', isStreaming: true }])

    try {
      // Build conversation history from messages state
      const chatHistory = messages
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(m => ({ role: m.role, content: m.content }))
      // Add the current user message
      chatHistory.push({ role: 'user', content: trimmed })

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: chatHistory,
        }),
      })

      if (!res.body) throw new Error('No response body')
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        accumulated += decoder.decode(value, { stream: true })
        setMessages(prev =>
          prev.map(m => m.id === streamingId
            ? { ...m, content: accumulated }
            : m
          )
        )
      }

      // Mark done
      setMessages(prev =>
        prev.map(m => m.id === streamingId ? { ...m, isStreaming: false } : m)
      )
    } catch {
      setMessages(prev =>
        prev.map(m => m.id === streamingId
          ? { ...m, content: 'Error reaching AI. Please try again.', isStreaming: false }
          : m
        )
      )
    } finally {
      setIsStreaming(false)
    }
  }, [input, appendMessage])

  const handleCommandSelect = (commandName: string) => {
    setInput(`/${commandName}`)
  }

  // Show command palette when input starts with /
  const showPalette = input.startsWith('/') && !isStreaming
  const paletteQuery = showPalette ? input.slice(1) : ''

  return (
    <div className="min-h-screen bg-[#0d0d0d] font-mono flex items-center justify-center p-4">
      <div className="w-full max-w-3xl h-[80vh] flex flex-col border border-[#2a2a2a] rounded">

        {/* Header */}
        <div className="flex items-center px-4 py-2 border-b border-[#2a2a2a]">
          <span className="text-[#00bcd4] font-bold">lumicode</span>
          <span className="ml-auto text-[#555] text-xs">esc to go back</span>
        </div>

        {/* Messages */}
        <MessageList messages={messages} />
        <div ref={bottomRef} />

        {/* Input area (relative for palette positioning) */}
        <div className="relative">
          {showPalette && (
            <CommandPalette query={paletteQuery} onSelect={handleCommandSelect} />
          )}
          <InputBar
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            disabled={isStreaming}
          />
        </div>
      </div>
    </div>
  )
}
