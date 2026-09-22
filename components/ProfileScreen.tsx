'use client'

import Image from 'next/image'
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
                  aria-label="Show experience at Amazon, MedMe, and UofTHacks"
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
                      <span className={styles.companyName}>{company.name}</span>
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
                <button type="button" className={styles.hobbyReveal} aria-label="Animate hobbies">
                  <span className={styles.hobbyLabel}>{profile.hobbies.join(' · ')}</span>
                  <span className={styles.hobbyMotion} aria-hidden="true">
                    <span className={styles.ball} />
                    <span className={styles.blocks}><i /><i /><i /></span>
                    <span className={styles.wanderDot} />
                  </span>
                </button>
              </dd>
            </div>
          </dl>
        </div>
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
