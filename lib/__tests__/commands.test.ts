import { getCommand, ALL_COMMANDS } from '../commands'

describe('commands', () => {
  it('finds command by name', () => {
    const cmd = getCommand('help')
    expect(cmd).toBeDefined()
    expect(cmd?.name).toBe('help')
  })

  it('returns undefined for unknown command', () => {
    expect(getCommand('nonexistent')).toBeUndefined()
  })

  it('has all required commands', () => {
    const names = ALL_COMMANDS.map(c => c.name)
    expect(names).toContain('about')
    expect(names).toContain('projects')
    expect(names).toContain('resume')
    expect(names).toContain('contact')
    expect(names).toContain('help')
    expect(names).toContain('clear')
  })

  it('each command has name, description, and handler', () => {
    for (const cmd of ALL_COMMANDS) {
      expect(cmd.name).toBeTruthy()
      expect(cmd.description).toBeTruthy()
      expect(typeof cmd.handler).toBe('function')
    }
  })
})
