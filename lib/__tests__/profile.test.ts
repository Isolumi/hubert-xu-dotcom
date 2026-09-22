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

  it('matches the current resume', () => {
    expect(profile.links.email).toBe('hubertx98@gmail.com')
    expect(profile.skills).toEqual(expect.arrayContaining(['C++', 'Rust', 'CUDA', 'Triton', 'K8s']))
    expect(profile.resumeHighlights.experience).toEqual(
      expect.arrayContaining([
        expect.stringContaining('Amazon'),
        expect.stringContaining('77%'),
        expect.stringContaining('MedMe Health'),
        expect.stringContaining('43%'),
        expect.stringContaining('4,000+'),
      ]),
    )
    expect(profile.projects.map(project => project.name)).toEqual([
      'npm (Open Source Contributor)',
      'MiniLLM',
    ])
  })
})
