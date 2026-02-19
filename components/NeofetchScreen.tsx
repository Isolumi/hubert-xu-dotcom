'use client'

import { useEffect } from 'react'
import { profile } from '@/lib/profile'

type Props = {
  onEnterInteractive: () => void
}

export default function NeofetchScreen({ onEnterInteractive }: Props) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === '/' || e.key === 'Enter') {
        onEnterInteractive()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onEnterInteractive])

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-[#e0e0e0] font-mono flex items-center justify-center p-8">
      <div className="flex gap-12 items-start max-w-4xl w-full">

        {/* Left: ASCII art */}
        <pre className="text-[#00bcd4] text-sm leading-tight select-none shrink-0">
          {`  ██╗     ██╗   ██╗███╗   ███╗██╗\n  ██║     ██║   ██║████╗ ████║██║\n  ██║     ██║   ██║██╔████╔██║██║\n  ██║     ██║   ██║██║╚██╔╝██║██║\n  ███████╗╚██████╔╝██║ ╚═╝ ██║██║\n  ╚══════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝`}
        </pre>

        {/* Right: info */}
        <div className="flex-1">
          <div className="text-[#00bcd4] font-bold text-lg">
            {profile.name.toLowerCase().replace(' ', '')}@{profile.hostname}
          </div>
          <div className="text-[#555] mb-4">{'─'.repeat(30)}</div>

          <InfoLine label="Role" value={profile.role} />
          <InfoLine label="School" value={profile.school} />
          <InfoLine label="Skills" value={profile.skills.join(', ')} />
          <div className="mt-4" />
          <LinkLine label="GitHub" href={profile.links.github} display="github/isolumi" />
          <LinkLine label="LinkedIn" href={profile.links.linkedin} display="linkedin/in/hubertxu" />
          <LinkLine label="Email" href={`mailto:${profile.links.email}`} display="contact" />
        </div>
      </div>

      {/* Bottom prompt */}
      <div className="absolute bottom-8 left-0 right-0 text-center text-[#555] text-sm">
        {'press / to interact'}
      </div>
    </div>
  )
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 mb-1">
      <span className="text-[#4caf50] w-16 shrink-0">{label}</span>
      <span className="text-[#555]">:</span>
      <span className="text-[#e0e0e0]">{value}</span>
    </div>
  )
}

function LinkLine({ label, href, display }: { label: string; href: string; display: string }) {
  return (
    <div className="flex gap-2 mb-1">
      <span className="text-[#4caf50] w-16 shrink-0">{label}</span>
      <span className="text-[#555]">:</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#e0e0e0] hover:text-[#00bcd4] transition-colors"
      >
        {display}
      </a>
    </div>
  )
}
