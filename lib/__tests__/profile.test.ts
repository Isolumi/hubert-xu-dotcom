import { profile } from '../profile'

describe('profile', () => {
  it('has required fields', () => {
    expect(profile.name).toBeTruthy()
    expect(profile.role).toBeTruthy()
    expect(profile.school).toBeTruthy()
    expect(Array.isArray(profile.skills)).toBe(true)
    expect(profile.skills.length).toBeGreaterThan(0)
    expect(profile.links.github).toBeTruthy()
    expect(profile.links.email).toBeTruthy()
    expect(Array.isArray(profile.projects)).toBe(true)
    expect(profile.bio).toBeTruthy()
  })
})
