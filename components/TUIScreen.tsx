'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import MessageList from './MessageList'
import InputBar from './InputBar'
import CommandPalette from './CommandPalette'
import { ALL_COMMANDS, getCommand } from '@/lib/commands'
import type { Message } from '@/lib/types'

type Props = {
  onExitInteractive: () => void
}

let idCounter = 0
function nextId() { return String(++idCounter) }

type TerminalStatus = 'ready' | 'thinking' | 'streaming'

export default function TUIScreen({ onExitInteractive }: Props) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: nextId(),
      role: 'system',
      content: 'Welcome to lumicode. Type /help to see available commands.',
    },
  ])
  const [input, setInput] = useState('')
  const [terminalStatus, setTerminalStatus] = useState<TerminalStatus>('ready')
  const [paletteIndex, setPaletteIndex] = useState(0)
  const historyRef = useRef<string[]>([])
  const historyIndexRef = useRef(0)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView?.({ block: 'end' })
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

  const paletteCommands = useMemo(() => (
    input.startsWith('/')
      ? ALL_COMMANDS.filter(command => command.name.startsWith(input.slice(1).toLowerCase()))
      : []
  ), [input])
  const showPalette = terminalStatus === 'ready' && input.startsWith('/') && paletteCommands.length > 0

  const handleSubmit = useCallback(async () => {
    const selectedCommand = showPalette ? paletteCommands[paletteIndex] : undefined
    const trimmed = selectedCommand ? `/${selectedCommand.name}` : input.trim()
    if (!trimmed) return

    setInput('')
    setPaletteIndex(0)
    historyRef.current.push(trimmed)
    historyIndexRef.current = historyRef.current.length

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

      appendMessage({ role: 'command', content: output.content ?? '', items: output.items })
      return
    }

    // Natural language → Gemini
    setTerminalStatus('thinking')
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

      if (!res.ok || !res.body) throw new Error('No response body')
      setTerminalStatus('streaming')
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
      setTerminalStatus('ready')
    }
  }, [appendMessage, input, messages, paletteCommands, paletteIndex, showPalette])

  const handleCommandSelect = (commandName: string) => {
    setInput(`/${commandName}`)
    setPaletteIndex(0)
  }

  const handleInputChange = (value: string) => {
    setInput(value)
    setPaletteIndex(0)
    historyIndexRef.current = historyRef.current.length
  }

  const handleNavigate = (direction: -1 | 1) => {
    if (showPalette) {
      setPaletteIndex(current => {
        const next = current + direction
        return (next + paletteCommands.length) % paletteCommands.length
      })
      return
    }

    const history = historyRef.current
    if (history.length === 0) return
    const next = Math.min(history.length, Math.max(0, historyIndexRef.current + direction))
    historyIndexRef.current = next
    setInput(next === history.length ? '' : history[next])
  }

  const handleComplete = () => {
    const command = paletteCommands[paletteIndex]
    if (!command) return
    setInput(`/${command.name}`)
    setPaletteIndex(0)
  }

  const handleClear = () => {
    setMessages([])
    setInput('')
    setPaletteIndex(0)
  }

  const paletteQuery = showPalette ? input.slice(1) : ''
  const isBusy = terminalStatus !== 'ready'

  return (
    <div className="min-h-[100svh] bg-[#050605] text-[#e8ece9] font-mono flex p-0 sm:p-4">
      <section aria-label="Lumicode terminal" className="w-full max-w-6xl mx-auto min-h-[100svh] sm:min-h-0 sm:h-[calc(100svh-2rem)] flex flex-col border-y sm:border border-white/12 sm:rounded-xl bg-[#080a09]/95 shadow-[0_40px_100px_rgba(0,0,0,0.55)] backdrop-blur-xl overflow-hidden">

        {/* Header */}
        <header className="flex items-center gap-3 px-4 py-3 border-b border-white/12 bg-[#060807]">
          <span className="text-[#87b9ff] font-semibold">lumicode</span>
          <span className="hidden sm:inline text-[#4f5a54] text-xs">profile agent</span>
          <span role="status" aria-live="polite" className="ml-auto inline-flex items-center gap-1.5 text-[#8b9690] text-xs">
            <i className={`w-1.5 h-1.5 rounded-full ${isBusy ? 'bg-[#87b9ff] animate-pulse' : 'bg-[#70c998]'}`} />
            {terminalStatus}
          </span>
          <span className="text-[#59635e] text-xs"><kbd>esc</kbd> return</span>
        </header>

        {/* Messages */}
        <MessageList messages={messages} />
        <div ref={bottomRef} />

        {/* Input area (relative for palette positioning) */}
        <div className="relative">
          {showPalette && (
            <CommandPalette
              query={paletteQuery}
              onSelect={handleCommandSelect}
              activeIndex={paletteIndex}
              onActiveChange={setPaletteIndex}
            />
          )}
          <InputBar
            value={input}
            onChange={handleInputChange}
            onSubmit={handleSubmit}
            onNavigate={handleNavigate}
            onComplete={handleComplete}
            onClear={handleClear}
            disabled={isBusy}
          />
        </div>
      </section>
    </div>
  )
}
