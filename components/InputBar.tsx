'use client'

import { useEffect, useRef } from 'react'

type Props = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

export default function InputBar({ value, onChange, onSubmit, disabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!disabled) inputRef.current?.focus()
  }, [disabled])

  return (
    <div className="flex items-center gap-2 px-4 py-3 border-t border-white/12">
      <span className="text-[#87b9ff] select-none">&gt;</span>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => {
          if (e.key === 'Enter' && !disabled) {
            onSubmit()
          }
        }}
        disabled={disabled}
        autoFocus
        autoComplete="off"
        spellCheck={false}
        className="flex-1 bg-transparent text-[#e8ece9] outline-none caret-[#87b9ff] placeholder:text-[#68716c] disabled:cursor-wait"
        placeholder={disabled ? '' : 'type a command or ask me anything...'}
      />
    </div>
  )
}
