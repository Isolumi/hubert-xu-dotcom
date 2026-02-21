'use client'

import { useState, useCallback } from 'react'
import NeofetchScreen from '@/components/NeofetchScreen'
import TUIScreen from '@/components/TUIScreen'

type Mode = 'neofetch' | 'interactive'

export default function HomeClient({ asciiArt }: { asciiArt: string }) {
  const [mode, setMode] = useState<Mode>('neofetch')

  const enterInteractive = useCallback(() => setMode('interactive'), [])
  const exitInteractive = useCallback(() => setMode('neofetch'), [])

  return (
    <main>
      {mode === 'neofetch' ? (
        <NeofetchScreen asciiArt={asciiArt} onEnterInteractive={enterInteractive} />
      ) : (
        <TUIScreen onExitInteractive={exitInteractive} />
      )}
    </main>
  )
}
