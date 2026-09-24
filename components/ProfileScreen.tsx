'use client'

import Image from 'next/image'
import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react'
import GameOfLife from '@/components/GameOfLife'
import OrbCharacter from '@/components/OrbCharacter'
import { profile } from '@/lib/profile'
import styles from './ProfileScreen.module.css'

type Props = {
  onEnterInteractive: () => void
}

const CELL_SIZES = { small: 8, normal: 12, large: 18 } as const
const SPEEDS = { slow: 900, normal: 520, fast: 220 } as const
const GLOWS = { low: 0.55, normal: 1, bright: 1.5 } as const

export default function ProfileScreen({ onEnterInteractive }: Props) {
  const [cellSize, setCellSize] = useState<keyof typeof CELL_SIZES>('normal')
  const [speed, setSpeed] = useState<keyof typeof SPEEDS>('normal')
  const [glow, setGlow] = useState<keyof typeof GLOWS>('normal')
  const [refresh, setRefresh] = useState(0)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target
      if (target instanceof Element && target.closest('a, button, input, textarea')) return
      if (event.key === '/' || event.key === 'Enter') onEnterInteractive()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onEnterInteractive])

  useEffect(() => {
    const query = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!query) return
    const update = () => setReducedMotion(query.matches)
    update()
    query.addEventListener('change', update)
    return () => query.removeEventListener('change', update)
  }, [])

  useEffect(() => {
    if (!settingsOpen) return

    const closeOnOutside = (event: PointerEvent) => {
      if (!settingsRef.current?.contains(event.target as Node)) setSettingsOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSettingsOpen(false)
    }

    window.addEventListener('pointerdown', closeOnOutside)
    window.addEventListener('keydown', closeOnEscape)
    return () => {
      window.removeEventListener('pointerdown', closeOnOutside)
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [settingsOpen])

  return (
    <section className={styles.screen} aria-labelledby="profile-name">
      <GameOfLife
        cellSize={CELL_SIZES[cellSize]}
        stepDelay={SPEEDS[speed]}
        glowStrength={GLOWS[glow]}
        refresh={refresh}
      />

      <div className={styles.profile}>
        <OrbCharacter />

        <div className={styles.bio}>
          <div className={styles.identity}>
            <h1 id="profile-name">{profile.name}</h1>
            <nav className={styles.links} aria-label="Profile links">
              <a href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a>
              <a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
              <a href="/Hubert_Xu_Resume.pdf" target="_blank" rel="noreferrer">Résumé</a>
              <a href={`mailto:${profile.links.email}`}>Email</a>
            </nav>
          </div>

          <dl className={styles.details}>
            <div className={styles.row}>
              <dt>Experience</dt>
              <dd>
                <button
                  type="button"
                  className={styles.companyFan}
                  aria-label={`Show experience: ${profile.companies
                    .map(company => `${company.name}, ${company.role}`)
                    .join('; ')}`}
                >
                  {profile.companies.map(company => (
                    <span className={styles.companyBadge} key={company.name}>
                      <Image
                        className={styles.companyLogo}
                        src={company.logo}
                        alt={`${company.name} logo`}
                        width={22}
                        height={22}
                      />
                      <span className={styles.companyCopy}>
                        <span className={styles.companyName}>{company.name}</span>
                        <span className={styles.companyRole}>{company.role}</span>
                      </span>
                    </span>
                  ))}
                </button>
              </dd>
            </div>

            <div className={styles.row}>
              <dt>School</dt>
              <dd>
                <button type="button" className={styles.schoolReveal} aria-label="Show education details">
                  <span className={styles.schoolLogo} aria-hidden="true">
                    <Image src="/logos/uoft.svg" alt="" width={429} height={159} />
                  </span>
                  <span className={styles.schoolName}>{profile.school}</span>
                  <span className={styles.schoolDetail}>Computer Science · 2027</span>
                </button>
              </dd>
            </div>

            <div className={styles.row}>
              <dt>Hobbies</dt>
              <dd>
                <span className={styles.hobbyList}>
                  {profile.hobbies.map((hobby, hobbyIndex) => (
                    <Fragment key={hobby}>
                      {hobbyIndex > 0 && <span className={styles.hobbySeparator} aria-hidden="true">·</span>}
                      <button
                        type="button"
                        className={styles.hobbyWord}
                        data-hobby={hobby}
                        aria-label={`Animate ${hobby}`}
                      >
                        {Array.from(hobby).map((character, characterIndex) => (
                          <span
                            className={styles.hobbyGlyph}
                            key={`${character}-${characterIndex}`}
                            style={{ '--character-index': characterIndex } as CSSProperties}
                          >
                            {character}
                          </span>
                        ))}
                      </button>
                    </Fragment>
                  ))}
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div ref={settingsRef} className={styles.lifeSettings}>
        {settingsOpen && (
          <div id="life-settings" className={styles.lifePanel} role="group" aria-label="Game of Life settings">
            <div className={styles.lifePanelTitle}>game of life</div>

            <fieldset className={styles.lifeSettingRow}>
              <legend>cell size</legend>
              <div className={styles.lifeChoices}>
                {(['small', 'normal', 'large'] as const).map(option => (
                  <button key={option} type="button" aria-pressed={cellSize === option} onClick={() => setCellSize(option)}>
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className={styles.lifeSettingRow}>
              <legend>speed</legend>
              <div className={styles.lifeChoices}>
                {(['slow', 'normal', 'fast'] as const).map(option => (
                  <button key={option} type="button" aria-pressed={speed === option} disabled={reducedMotion} onClick={() => setSpeed(option)}>
                    {option}
                  </button>
                ))}
              </div>
              {reducedMotion && <p className={styles.lifeMotionNote}>motion is off in your device settings</p>}
            </fieldset>

            <fieldset className={styles.lifeSettingRow}>
              <legend>glow</legend>
              <div className={styles.lifeChoices}>
                {(['low', 'normal', 'bright'] as const).map(option => (
                  <button key={option} type="button" aria-pressed={glow === option} onClick={() => setGlow(option)}>
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>

            <button className={styles.lifeNewPattern} type="button" onClick={() => setRefresh(value => value + 1)}>
              new pattern
            </button>
          </div>
        )}
        <button
          type="button"
          className={styles.lifeSettingsTrigger}
          aria-label="Background settings"
          aria-controls="life-settings"
          aria-expanded={settingsOpen}
          onClick={() => setSettingsOpen(open => !open)}
        >
          <span className={styles.lifeGridIcon} aria-hidden="true">
            {Array.from({ length: 9 }, (_, index) => <span key={index} />)}
          </span>
        </button>
      </div>

      <footer className={styles.footer}>
        <span className={styles.footerPrompt}>Want to learn more?</span>
        <button type="button" className={styles.enterButton} onClick={onEnterInteractive}>
          <kbd>/</kbd>
          <span>Enter lumicode</span>
        </button>
      </footer>
    </section>
  )
}
