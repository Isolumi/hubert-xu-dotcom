'use client'

import { useEffect } from 'react'
import GameOfLife from '@/components/GameOfLife'
import OrbCharacter from '@/components/OrbCharacter'
import { profile } from '@/lib/profile'
import styles from './ProfileScreen.module.css'

type Props = {
  onEnterInteractive: () => void
}

export default function ProfileScreen({ onEnterInteractive }: Props) {
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target
      if (target instanceof Element && target.closest('a, button, input, textarea')) return
      if (event.key === '/' || event.key === 'Enter') onEnterInteractive()
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onEnterInteractive])

  return (
    <section className={styles.screen} aria-labelledby="profile-name">
      <GameOfLife />

      <header className={styles.siteHeader}>
        <span>{profile.hostname}</span>
        <span>Toronto</span>
      </header>

      <div className={styles.profile}>
        <OrbCharacter />

        <div className={styles.bio}>
          <h1 id="profile-name">{profile.name}</h1>
          <p className={styles.role}>{profile.role}</p>

          <dl className={styles.details}>
            <div className={styles.row}>
              <dt>Experience</dt>
              <dd>
                <button
                  type="button"
                  className={styles.companyFan}
                  aria-label="Show experience at Amazon, MedMe, and UofTHacks"
                >
                  {profile.companies.map(company => (
                    <span className={styles.companyBadge} key={company.name}>
                      <span className={styles.companyMark} aria-hidden="true">
                        {company.mark}
                      </span>
                      <span className={styles.companyName}>{company.name}</span>
                    </span>
                  ))}
                </button>
              </dd>
            </div>

            <div className={styles.row}>
              <dt>School</dt>
              <dd>{profile.school}</dd>
            </div>

            <div className={styles.row}>
              <dt>Hobbies</dt>
              <dd>{profile.hobbies.join(' · ')}</dd>
            </div>
          </dl>

          <nav className={styles.links} aria-label="Profile links">
            <a href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a>
            <a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            <a href="/Hubert_Xu_Resume.pdf" target="_blank" rel="noreferrer">Résumé</a>
            <a href={`mailto:${profile.links.email}`}>Email</a>
          </nav>
        </div>
      </div>

      <footer className={styles.footer}>
        <button type="button" className={styles.enterButton} onClick={onEnterInteractive}>
          <kbd>/</kbd>
          <span>Enter lumicode</span>
        </button>
      </footer>
    </section>
  )
}
