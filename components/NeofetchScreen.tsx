'use client'

import { useEffect } from 'react'
import { profile } from '@/lib/profile'

type Props = {
  asciiArt: string
  onEnterInteractive: () => void
}

export default function NeofetchScreen({ asciiArt, onEnterInteractive }: Props) {
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
    <div className="min-h-screen bg-[#0d0d0d] text-[#e0e0e0] font-mono flex items-center justify-center p-4 sm:p-8">
      <div className="flex flex-col sm:flex-row gap-8 items-start">

        {/* ASCII art — hidden on mobile */}
        <pre className="hidden sm:block text-[#8b87ff] text-xs leading-tight select-none shrink-0">
          {asciiArt}
        </pre>

        {/* Info */}
        <div className="min-w-0 flex-1">
          <div className="text-[#8b87ff] font-bold text-base sm:text-lg">
            hubert-xu.com
          </div>
          <div className="text-[#555] mb-4">{'─'.repeat(30)}</div>

          <InfoLine label="Exp" value={profile.experience} />
          <InfoLine label="School" value={profile.school} />
          <InfoLine label="Hobbies" value={profile.hobbies.join(', ')} />
          <div className="mt-4" />
          <LinkLine label="GitHub" href={profile.links.github} display="/isolumi" />
          <LinkLine label="LinkedIn" href={profile.links.linkedin} display="/~hx" />
          <LinkLine label="Email" href={`mailto:${profile.links.email}`} display="contact" />
          <LinkLine label="Resume" href="/Hubert_Xu_Resume.pdf" display="click here" />
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
    <div className="flex mb-1">
      <span className="text-[#87e3ff] min-w-22 shrink-0">{label}</span>
      <span className="text-[#555] mr-2">:</span>
      <span className="text-[#e0e0e0] flex-1 min-w-0 wrap-break-word">{value}</span>
    </div>
  )
}

function LinkLine({ label, href, display }: { label: string; href: string; display: string }) {
  return (
    <div className="flex mb-1">
      <span className="text-[#87e3ff] min-w-22 shrink-0">{label}</span>
      <span className="text-[#555] mr-2">:</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-[#e0e0e0] hover:text-[#00bcd4] transition-colors min-w-0 break-all"
      >
        {display}
      </a>
    </div>
  )
}
