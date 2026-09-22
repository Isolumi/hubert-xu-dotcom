import { fireEvent, render, screen } from '@testing-library/react'
import TUIScreen from '../TUIScreen'

describe('TUIScreen', () => {
  it('shows a real terminal prompt and ready status', () => {
    render(<TUIScreen onExitInteractive={jest.fn()} />)

    expect(screen.getByText('hubert@lumicode:~')).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent('ready')
  })

  it('runs local commands immediately and recalls them from history', () => {
    render(<TUIScreen onExitInteractive={jest.fn()} />)
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: '/about' } })
    fireEvent.keyDown(input, { key: 'Enter' })

    expect(screen.getByText(/Hello! I'm Hubert/)).toBeInTheDocument()
    expect(input).not.toBeDisabled()

    fireEvent.keyDown(input, { key: 'ArrowUp' })
    expect(input).toHaveValue('/about')
  })

  it('completes slash commands with Tab', () => {
    render(<TUIScreen onExitInteractive={jest.fn()} />)
    const input = screen.getByRole('textbox')

    fireEvent.change(input, { target: { value: '/re' } })
    fireEvent.keyDown(input, { key: 'Tab' })

    expect(input).toHaveValue('/resume')
  })

  it('clears terminal output with Control+L', () => {
    render(<TUIScreen onExitInteractive={jest.fn()} />)
    const input = screen.getByRole('textbox')

    expect(screen.getByText(/Welcome to lumicode/)).toBeInTheDocument()
    fireEvent.keyDown(input, { key: 'l', ctrlKey: true })

    expect(screen.queryByText(/Welcome to lumicode/)).not.toBeInTheDocument()
    expect(input).toHaveFocus()
  })
})
