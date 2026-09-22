'use client'

import { useState, useCallback } from 'react'
import ProfileScreen from '@/components/ProfileScreen'
import TUIScreen from '@/components/TUIScreen'

type Mode = 'profile' | 'interactive'

export default function HomeClient() {
  const [mode, setMode] = useState<Mode>('profile')

  const enterInteractive = useCallback(() => setMode('interactive'), [])
  const exitInteractive = useCallback(() => setMode('profile'), [])

  return (
    <main>
      {mode === 'profile' ? (
        <ProfileScreen onEnterInteractive={enterInteractive} />
      ) : (
        <TUIScreen onExitInteractive={exitInteractive} />
      )}
    </main>
  )
}
