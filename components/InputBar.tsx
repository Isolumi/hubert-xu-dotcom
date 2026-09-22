'use client'

import { useEffect, useRef } from 'react'

type Props = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  onNavigate?: (direction: -1 | 1) => void
  onComplete?: () => void
  onClear?: () => void
  disabled?: boolean
}

export default function InputBar({
  value,
  onChange,
  onSubmit,
  onNavigate,
  onComplete,
  onClear,
  disabled,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!disabled) inputRef.current?.focus()
  }, [disabled])

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-t border-white/12 bg-[#060807]">
      <span className="hidden sm:inline text-[#6f7973] text-xs select-none">hubert@lumicode:~</span>
      <span className="text-[#87b9ff] select-none">&gt;</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.ctrlKey && e.key.toLowerCase() === 'l') {
            e.preventDefault()
            onClear?.()
            return
          }
          if (e.key === 'Tab') {
            e.preventDefault()
            onComplete?.()
            return
          }
          if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
            e.preventDefault()
            onNavigate?.(e.key === 'ArrowUp' ? -1 : 1)
            return
          }
          if (e.key === 'Enter' && !disabled) {
            e.preventDefault()
            onSubmit()
          }
        }}
        disabled={disabled}
        autoFocus
        autoComplete="off"
        spellCheck={false}
        className="min-w-0 flex-1 bg-transparent text-[#e8ece9] outline-none caret-[#87b9ff] placeholder:text-[#68716c] disabled:cursor-wait"
        placeholder={disabled ? 'waiting for response…' : 'ask about Hubert or type /help'}
      />
    </div>
  )
}
