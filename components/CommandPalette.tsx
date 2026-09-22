'use client'

import { ALL_COMMANDS } from '@/lib/commands'

type Props = {
  query: string // the text after '/'
  onSelect: (commandName: string) => void
  activeIndex?: number
  onActiveChange?: (index: number) => void
}

export default function CommandPalette({
  query,
  onSelect,
  activeIndex = 0,
  onActiveChange,
}: Props) {
  const filtered = ALL_COMMANDS.filter(cmd =>
    cmd.name.startsWith(query.toLowerCase())
  )

  if (filtered.length === 0) return null

  return (
    <div
      role="listbox"
      aria-label="Command suggestions"
      className="absolute bottom-full left-0 right-0 mb-2 mx-4 bg-[#0d110f] border border-white/12 rounded-lg overflow-hidden shadow-2xl"
    >
      {filtered.map((cmd, index) => (
        <button
          key={cmd.name}
          role="option"
          aria-selected={index === activeIndex}
          onClick={() => onSelect(cmd.name)}
          onMouseEnter={() => onActiveChange?.(index)}
          className={`w-full flex items-center gap-3 px-3 py-2 text-left outline-none transition-colors ${index === activeIndex ? 'bg-[#172131]' : 'hover:bg-white/5'}`}
        >
          <span className="text-[#87b9ff] font-mono text-sm">/{cmd.name}</span>
          <span className="text-[#818a85] text-sm">{cmd.description}</span>
        </button>
      ))}
    </div>
  )
}
