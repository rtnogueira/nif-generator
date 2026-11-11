import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { render, screen, within } from '@testing-library/react'
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
    expect(document.title).toBe('Tax Number Validator (EU VAT, NIF & more) | rtnogueira')
  })

  it('detects the country from the prefix and verifies the check digit', async () => {
    const user = await renderValidator()
    const number = screen.getByLabelText('Number')

    await user.type(number, 'de 113 866 163{Enter}')
    expect(screen.getByText('Valid tax number')).toBeInTheDocument()
    expect(screen.getByText('DE113866163')).toBeInTheDocument()

    await user.clear(number)
    await user.type(number, 'DE113866164{Enter}')
    expect(screen.getByText('Invalid check digit')).toBeInTheDocument()
    expect(screen.getByText(/not a valid USt-IdNr\./)).toBeInTheDocument()
  })

  it('says when only the format could be checked', async () => {
    const user = await renderValidator()

    await user.type(screen.getByLabelText('Number'), 'CZ1234567890{Enter}')

    expect(screen.getByText('Valid format')).toBeInTheDocument()
    expect(screen.getByText(/check digit is not verified/)).toBeInTheDocument()
  })

  it('validates numbers from countries outside VIES', async () => {
    const user = await renderValidator()

    await user.click(screen.getByRole('combobox', { name: 'Country' }))
    await user.click(await screen.findByRole('option', { name: /Brazil/ }))
    expect(screen.getByText(/^Expected:/)).toHaveTextContent(
      'Expected: CPF 99999999999 or CNPJ 99999999999999'
    )

    await user.type(screen.getByLabelText('Number'), '390.533.447-05{Enter}')
    expect(screen.getByText('Valid tax number')).toBeInTheDocument()
    expect(screen.getByText('39053344705')).toBeInTheDocument()
    expect(screen.getByText(/^CPF · Cadastro/)).toBeInTheDocument()
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
    const vies = screen.getByRole('table', { name: 'EU VAT formats' })
    expect(within(vies).getAllByRole('row')).toHaveLength(30)
    const others = screen.getByRole('table', { name: 'Other countries' })
    expect(within(others).getAllByRole('row')).toHaveLength(19)
  })
})
