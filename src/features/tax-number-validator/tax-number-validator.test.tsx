import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createAppRouter } from '@/router'

async function renderValidator() {
  const user = userEvent.setup()
  const router = createAppRouter(createMemoryHistory({ initialEntries: ['/tax-number-validator'] }))
  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1, name: 'Tax Number Validator' })
  return user
}

describe('Tax number validator page', () => {
  it('is reachable from the Tools menu and sets the page title', async () => {
    const user = userEvent.setup()
    const router = createAppRouter(createMemoryHistory({ initialEntries: ['/'] }))
    render(<RouterProvider router={router} />)

    await user.click(await screen.findByRole('button', { name: 'Tools' }))
    await user.click(await screen.findByRole('link', { name: /Tax number validator/ }))

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Tax Number Validator' })
    ).toBeVisible()
    expect(document.title).toBe('Tax Number Validator (EU VAT & NIF) | rtnogueira')
  })

  it('detects the country from the prefix', async () => {
    const user = await renderValidator()

    await user.type(screen.getByLabelText('Number'), 'de 123 456 789{Enter}')

    expect(screen.getByText('Valid format')).toBeInTheDocument()
    expect(screen.getByText('DE123456789')).toBeInTheDocument()
  })

  it('verifies the Portuguese check digit for the selected country', async () => {
    const user = await renderValidator()

    await user.click(screen.getByRole('combobox', { name: 'Country' }))
    await user.click(await screen.findByRole('option', { name: /Portugal/ }))
    expect(screen.getByText(/^Expected:/)).toHaveTextContent('Expected: PT999999999')

    const number = screen.getByLabelText('Number')
    await user.type(number, '123456789{Enter}')
    expect(screen.getByText('Valid tax number')).toBeInTheDocument()

    await user.clear(number)
    await user.type(number, '123456788{Enter}')
    expect(screen.getByText('Invalid check digit')).toBeInTheDocument()
  })

  it('explains the expected format when it does not match', async () => {
    const user = await renderValidator()

    await user.type(screen.getByLabelText('Number'), 'ATU1234{Enter}')

    expect(screen.getByText('Invalid format')).toBeInTheDocument()
    expect(
      screen.getByText(/does not match the official structure for Austria/)
    ).toBeInTheDocument()
  })

  it('asks for a prefix when the country cannot be detected', async () => {
    const user = await renderValidator()

    await user.type(screen.getByLabelText('Number'), '123456789{Enter}')

    expect(screen.getByText('Country not recognised')).toBeInTheDocument()
  })

  it('lists every supported country in the formats table', async () => {
    await renderValidator()

    expect(screen.getByRole('heading', { name: 'Supported formats' })).toBeVisible()
    expect(screen.getAllByRole('row')).toHaveLength(30)
  })
})
