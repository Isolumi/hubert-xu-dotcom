'use client'

import { ALL_COMMANDS } from '@/lib/commands'

type Props = {
  query: string // the text after '/'
  onSelect: (commandName: string) => void
}

export default function CommandPalette({ query, onSelect }: Props) {
  const filtered = ALL_COMMANDS.filter(cmd =>
    cmd.name.startsWith(query.toLowerCase())
  )

  if (filtered.length === 0) return null

  return (
    <div className="absolute bottom-full left-0 right-0 mb-1 mx-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded overflow-hidden">
      {filtered.map(cmd => (
        <button
          key={cmd.name}
          onClick={() => onSelect(cmd.name)}
          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#2a2a2a] transition-colors"
        >
          <span className="text-[#00bcd4] font-mono text-sm">/{cmd.name}</span>
          <span className="text-[#777] text-sm">{cmd.description}</span>
        </button>
      ))}
    </div>
  )
}
