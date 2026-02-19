import { render, screen, fireEvent } from '@testing-library/react'
import NeofetchScreen from '../NeofetchScreen'

const mockOnEnterInteractive = jest.fn()

describe('NeofetchScreen', () => {
  beforeEach(() => {
    mockOnEnterInteractive.mockClear()
  })

  it('renders the user name and hostname', () => {
    render(<NeofetchScreen onEnterInteractive={mockOnEnterInteractive} />)
    expect(screen.getByText(/hubertxu@lumilumi\.xyz/i)).toBeInTheDocument()
    expect(screen.getByText(/lumilumi\.xyz/i)).toBeInTheDocument()
  })

  it('renders the prompt hint', () => {
    render(<NeofetchScreen onEnterInteractive={mockOnEnterInteractive} />)
    expect(screen.getByText(/press \/ to interact/i)).toBeInTheDocument()
  })

  it('calls onEnterInteractive when / is pressed', () => {
    render(<NeofetchScreen onEnterInteractive={mockOnEnterInteractive} />)
    fireEvent.keyDown(window, { key: '/' })
    expect(mockOnEnterInteractive).toHaveBeenCalledTimes(1)
  })

  it('calls onEnterInteractive when Enter is pressed', () => {
    render(<NeofetchScreen onEnterInteractive={mockOnEnterInteractive} />)
    fireEvent.keyDown(window, { key: 'Enter' })
    expect(mockOnEnterInteractive).toHaveBeenCalledTimes(1)
  })
})
