import { fireEvent, render, screen } from '@testing-library/react'
import HomeClient from '../HomeClient'

jest.mock('../GameOfLife', () => function MockGameOfLife() {
  return <div data-testid="game-of-life" />
})

jest.mock('../OrbCharacter', () => function MockOrbCharacter() {
  return <div data-testid="orb-character" />
})

describe('HomeClient', () => {
  it('moves from the profile to lumicode and returns with Escape', () => {
    render(<HomeClient />)

    fireEvent.click(screen.getByRole('button', { name: /Enter lumicode/i }))
    expect(screen.getByText('Welcome to lumicode. Type /help to see available commands.')).toBeInTheDocument()

    fireEvent.keyDown(window, { key: 'Escape' })
    expect(screen.getByRole('heading', { name: 'Hubert Xu' })).toBeInTheDocument()
  })
})
