import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InputBar from '../InputBar'

describe('InputBar', () => {
  it('renders the prompt character', () => {
    render(<InputBar value="" onChange={jest.fn()} onSubmit={jest.fn()} />)
    expect(screen.getByText('>')).toBeInTheDocument()
  })

  it('displays current input value', () => {
    render(<InputBar value="/about" onChange={jest.fn()} onSubmit={jest.fn()} />)
    expect(screen.getByRole('textbox')).toHaveValue('/about')
  })

  it('calls onSubmit when Enter is pressed', async () => {
    const onSubmit = jest.fn()
    render(<InputBar value="hello" onChange={jest.fn()} onSubmit={onSubmit} />)
    fireEvent.keyDown(screen.getByRole('textbox'), { key: 'Enter' })
    expect(onSubmit).toHaveBeenCalledTimes(1)
  })

  it('calls onChange when typing', async () => {
    const onChange = jest.fn()
    render(<InputBar value="" onChange={onChange} onSubmit={jest.fn()} />)
    await userEvent.type(screen.getByRole('textbox'), 'a')
    expect(onChange).toHaveBeenCalled()
  })
})
