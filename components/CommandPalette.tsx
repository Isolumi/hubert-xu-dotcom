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
    <div className="absolute bottom-full left-0 right-0 mb-1 mx-4 bg-[#101310] border border-white/12 rounded-lg overflow-hidden shadow-2xl">
      {filtered.map(cmd => (
        <button
          key={cmd.name}
          onClick={() => onSelect(cmd.name)}
          className="w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-[#172131] focus-visible:bg-[#172131] outline-none transition-colors"
        >
          <span className="text-[#87b9ff] font-mono text-sm">/{cmd.name}</span>
          <span className="text-[#818a85] text-sm">{cmd.description}</span>
        </button>
      ))}
    </div>
  )
}
