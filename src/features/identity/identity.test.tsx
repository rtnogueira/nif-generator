import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { IDENTITY_FAMILY } from '@/lib/identity'
import { createAppRouter } from '@/router'

async function renderPage(url: string, heading: string) {
  const user = userEvent.setup()
  const router = createAppRouter(createMemoryHistory({ initialEntries: [url] }))
  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1, name: heading })
  return { user, router }
}

const shownNumbers = () =>
  screen
    .getAllByRole('button', { name: /^Copy \S/ })
    .map(button => (button.getAttribute('aria-label') ?? '').slice(5))
    .filter(Boolean)

describe('identity number generator page', () => {
  it('starts with the Portuguese Cartão de Cidadão', async () => {
    const { user } = await renderPage('/id-number-generator', 'Identity Number Generator')

    expect(screen.getByText('Identity documents')).toBeVisible()
    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveTextContent('Portugal')
    await user.click(screen.getByRole('button', { name: 'Generate' }))

    const [number] = shownNumbers()
    expect(number).toMatch(/^\d{9}[A-Z0-9]{2}\d$/)
    expect(IDENTITY_FAMILY.validate(number, 'PT').status).toBe('valid')
  })

  it('generates the kind of number the URL asks for', async () => {
    await renderPage('/id-number-generator?country=SE&qty=4', 'Identity Number Generator')

    const numbers = shownNumbers()
    expect(numbers).toHaveLength(4)
    for (const number of numbers) {
      expect(number).toMatch(/^\d{6}-\d{4}$/)
      expect(IDENTITY_FAMILY.validate(number, 'SE').status).toBe('valid')
    }
  })

  it('lists every supported number with its source', async () => {
    await renderPage('/id-number-generator', 'Identity Number Generator')
    const table = screen.getByRole('table')
    const kinds = IDENTITY_FAMILY.countries.reduce((sum, c) => sum + c.types.length, 0)
    expect(within(table).getAllByRole('row')).toHaveLength(kinds + 1)
    expect(within(table).getByRole('link', { name: 'stdnum.pt.cc' })).toHaveAttribute(
      'href',
      'https://github.com/arthurdejong/python-stdnum/blob/master/stdnum/pt/cc.py'
    )
  })
})

describe('Cartão de Cidadão generator page', () => {
  it('is preset to formatted Portuguese document numbers', async () => {
    const { user } = await renderPage(
      '/cartao-de-cidadao-generator',
      'Cartão de Cidadão Number Generator'
    )

    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveTextContent('Portugal')
    expect(screen.getByLabelText('Formatted')).toBeChecked()
    await user.click(screen.getByRole('button', { name: 'Generate' }))
    expect(shownNumbers()[0]).toMatch(/^\d{8} \d [A-Z0-9]{2}\d$/)
  })
})

describe('identity number validator page', () => {
  async function validate(number: string) {
    const { user } = await renderPage('/id-number-validator', 'Identity Number Validator')
    await user.type(screen.getByRole('textbox', { name: 'Number' }), number)
    await user.click(screen.getByRole('button', { name: 'Validate' }))
  }

  it('starts with Portugal, as identity numbers do not name their country', async () => {
    await renderPage('/id-number-validator', 'Identity Number Validator')
    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveTextContent('Portugal')
  })

  it('accepts the example of the Cartão de Cidadão specification', async () => {
    await validate('00000000 0 ZZ4')
    expect(screen.getByText('Valid identity number')).toBeVisible()
    expect(screen.getAllByText('Número de documento do Cartão de Cidadão').length).toBeGreaterThan(
      1
    )
  })

  it('reports a wrong check digit', async () => {
    await validate('00000000 0 ZZ3')
    expect(screen.getByText('Invalid check digit')).toBeVisible()
  })

  it('reports a wrong format', async () => {
    await validate('1234')
    expect(screen.getByText('Invalid format')).toBeVisible()
  })
})
