import { fireEvent, render, screen, within } from '@testing-library/react'
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

  it('renders the short profile without the old site header', () => {
    render(<ProfileScreen onEnterInteractive={mockOnEnterInteractive} />)

    expect(screen.getByRole('heading', { name: 'Hubert Xu' })).toBeInTheDocument()
    expect(screen.queryByText('hubert-xu.com')).not.toBeInTheDocument()
    expect(screen.queryByText('Toronto')).not.toBeInTheDocument()
    expect(screen.queryByText('Software engineer · University of Toronto')).not.toBeInTheDocument()
  })

  it('places the profile links directly below the name', () => {
    render(<ProfileScreen onEnterInteractive={mockOnEnterInteractive} />)

    const identity = screen.getByRole('heading', { name: 'Hubert Xu' }).parentElement
    expect(identity).not.toBeNull()
    expect(within(identity!).getByRole('navigation', { name: 'Profile links' })).toBeInTheDocument()
  })

  it('renders real company logos and interactive detail rows', () => {
    render(<ProfileScreen onEnterInteractive={mockOnEnterInteractive} />)

    expect(screen.getByText('Amazon')).toBeInTheDocument()
    expect(screen.getByText('MedMe')).toBeInTheDocument()
    expect(screen.getByText('UofTHacks')).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'Amazon logo' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'MedMe logo' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: 'UofTHacks logo' })).toBeInTheDocument()
    expect(screen.getByText('University of Toronto')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Show education details' })).toBeInTheDocument()
  })

  it('pairs each company with its role in the experience fan', () => {
    render(<ProfileScreen onEnterInteractive={mockOnEnterInteractive} />)

    const amazonCard = screen.getByText('Amazon').parentElement
    const medMeCard = screen.getByText('MedMe').parentElement
    const uofthacksCard = screen.getByText('UofTHacks').parentElement

    expect(amazonCard).not.toBeNull()
    expect(medMeCard).not.toBeNull()
    expect(uofthacksCard).not.toBeNull()
    expect(within(amazonCard!).getByText('SDE')).toBeInTheDocument()
    expect(within(medMeCard!).getByText('SWE')).toBeInTheDocument()
    expect(within(uofthacksCard!).getByText('President')).toBeInTheDocument()
  })

  it('makes each lowercase hobby its own text animation target', () => {
    render(<ProfileScreen onEnterInteractive={mockOnEnterInteractive} />)

    const basketball = screen.getByRole('button', { name: 'Animate basketball' })
    const building = screen.getByRole('button', { name: 'Animate building' })
    const dillyDallying = screen.getByRole('button', { name: 'Animate dilly-dallying' })

    expect(basketball).toHaveTextContent('basketball')
    expect(building).toHaveTextContent('building')
    expect(dillyDallying).toHaveTextContent('dilly-dallying')
    expect(screen.queryByRole('button', { name: 'Animate hobbies' })).not.toBeInTheDocument()
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
      'mailto:hubertx98@gmail.com',
    )
  })

  it('enters lumicode from the button or keyboard', () => {
    render(<ProfileScreen onEnterInteractive={mockOnEnterInteractive} />)

    expect(screen.getByText('Want to learn more?')).toBeInTheDocument()
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
