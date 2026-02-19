'use client'

type Props = {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  disabled?: boolean
}

export default function InputBar({ value, onChange, onSubmit, disabled }: Props) {
  return (
    <div className="flex items-center gap-2 px-4 py-3 border-t border-[#2a2a2a]">
      <span className="text-[#4caf50] select-none">&gt;</span>
      <input
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
        className="flex-1 bg-transparent text-[#e0e0e0] outline-none caret-[#e0e0e0] placeholder:text-[#555]"
        placeholder={disabled ? '' : 'type a command or ask me anything...'}
      />
    </div>
  )
}
