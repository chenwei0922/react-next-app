
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'

describe('Home Page', () => {
  it('renders main heading', () => {
    render(<Page />)
    const heading = screen.getByText(/Go About/i)
    expect(heading).toBeInTheDocument()
  })
})
