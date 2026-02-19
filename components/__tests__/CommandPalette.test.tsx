import { render, screen, fireEvent } from '@testing-library/react'
import CommandPalette from '../CommandPalette'
import { ALL_COMMANDS } from '@/lib/commands'

const mockOnSelect = jest.fn()

describe('CommandPalette', () => {
  beforeEach(() => mockOnSelect.mockClear())

  it('renders all commands when query is empty', () => {
    render(<CommandPalette query="" onSelect={mockOnSelect} />)
    for (const cmd of ALL_COMMANDS) {
      expect(screen.getByText(`/${cmd.name}`)).toBeInTheDocument()
    }
  })

  it('filters commands by query', () => {
    render(<CommandPalette query="ab" onSelect={mockOnSelect} />)
    expect(screen.getByText('/about')).toBeInTheDocument()
    expect(screen.queryByText('/projects')).not.toBeInTheDocument()
  })

  it('calls onSelect when a command is clicked', () => {
    render(<CommandPalette query="" onSelect={mockOnSelect} />)
    fireEvent.click(screen.getByText('/about'))
    expect(mockOnSelect).toHaveBeenCalledWith('about')
  })
})
