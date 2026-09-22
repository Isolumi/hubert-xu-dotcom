import { fireEvent, render, screen } from '@testing-library/react'
import ProfileScreen from '../ProfileScreen'

const mockOnEnterInteractive = jest.fn()

jest.mock('../GameOfLife', () => function MockGameOfLife() {
  return <div data-testid="game-of-life" />
})

jest.mock('../OrbCharacter', () => function MockOrbCharacter() {
  return <div data-testid="orb-character" />
})

describe('ProfileScreen', () => {
  beforeEach(() => {
    mockOnEnterInteractive.mockClear()
  })

  it('renders the short profile and experience fan', () => {
    render(<ProfileScreen onEnterInteractive={mockOnEnterInteractive} />)

    expect(screen.getByRole('heading', { name: 'Hubert Xu' })).toBeInTheDocument()
    expect(screen.getByText('Software engineer · University of Toronto')).toBeInTheDocument()
    expect(screen.getByText('Amazon')).toBeInTheDocument()
    expect(screen.getByText('MedMe')).toBeInTheDocument()
    expect(screen.getByText('UofTHacks')).toBeInTheDocument()
    expect(screen.getByText('University of Toronto')).toBeInTheDocument()
    expect(screen.getByText('Basketball · building · dilly-dallying')).toBeInTheDocument()
  })

  it('renders the profile links', () => {
    render(<ProfileScreen onEnterInteractive={mockOnEnterInteractive} />)

    expect(screen.getByRole('link', { name: /GitHub/i })).toHaveAttribute(
      'href',
      'https://github.com/isolumi',
    )
    expect(screen.getByRole('link', { name: /LinkedIn/i })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/~hx/',
    )
    expect(screen.getByRole('link', { name: /Résumé/i })).toHaveAttribute(
      'href',
      '/Hubert_Xu_Resume.pdf',
    )
    expect(screen.getByRole('link', { name: /Email/i })).toHaveAttribute(
      'href',
      'mailto:hubert.xu@mail.utoronto.ca',
    )
  })

  it('enters lumicode from the button or keyboard', () => {
    render(<ProfileScreen onEnterInteractive={mockOnEnterInteractive} />)

    fireEvent.click(screen.getByRole('button', { name: /Enter lumicode/i }))
    fireEvent.keyDown(window, { key: '/' })
    fireEvent.keyDown(window, { key: 'Enter' })

    expect(mockOnEnterInteractive).toHaveBeenCalledTimes(3)
  })

  it('makes the company fan keyboard focusable', () => {
    render(<ProfileScreen onEnterInteractive={mockOnEnterInteractive} />)

    const fan = screen.getByRole('button', { name: /Show experience/i })
    fan.focus()

    expect(fan).toHaveFocus()
  })
})
