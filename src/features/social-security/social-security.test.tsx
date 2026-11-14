import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SOCIAL_SECURITY_FAMILY } from '@/lib/social-security'
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

describe('social security number generator page', () => {
  it('starts with the Portuguese NISS', async () => {
    const { user } = await renderPage(
      '/social-security-number-generator',
      'Social Security Number Generator'
    )

    expect(screen.getByText('Social security')).toBeVisible()
    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveTextContent('Portugal')
    await user.click(screen.getByRole('button', { name: 'Generate' }))

    const [number] = shownNumbers()
    expect(number).toMatch(/^1\d{10}$/)
    expect(SOCIAL_SECURITY_FAMILY.validate(number, 'PT').status).toBe('valid')
  })

  it('generates the kind of number the URL asks for, in its written form', async () => {
    await renderPage(
      '/social-security-number-generator?country=FR&qty=3&format=1',
      'Social Security Number Generator'
    )

    const numbers = shownNumbers()
    expect(numbers).toHaveLength(3)
    for (const number of numbers) {
      expect(number).toMatch(/^[12] \d{2} \d{2} \d{2} \d{3} \d{3} \d{2}$/)
      expect(SOCIAL_SECURITY_FAMILY.validate(number, 'FR').status).toBe('valid')
    }
  })

  it('lists every supported number with its source', async () => {
    await renderPage('/social-security-number-generator', 'Social Security Number Generator')
    const table = screen.getByRole('table')
    expect(within(table).getAllByRole('row')).toHaveLength(
      SOCIAL_SECURITY_FAMILY.countries.length + 1
    )
    expect(within(table).getByRole('link', { name: 'stdnum.fr.nir' })).toBeVisible()
    expect(within(table).getByRole('link', { name: 'validators_pt' })).toBeVisible()
  })
})

describe('NISS generator page', () => {
  it('is preset to Portuguese social security numbers and explains the check digit', async () => {
    const { user } = await renderPage('/niss-generator', 'NISS Generator')

    expect(screen.getByRole('heading', { name: 'How is a NISS validated?' })).toBeVisible()
    await user.click(screen.getByRole('button', { name: 'Generate' }))
    expect(shownNumbers()[0]).toMatch(/^1\d{10}$/)
  })
})

describe('social security number validator page', () => {
  async function validate(number: string) {
    const { user } = await renderPage(
      '/social-security-number-validator',
      'Social Security Number Validator'
    )
    await user.type(screen.getByRole('textbox', { name: 'Number' }), number)
    await user.click(screen.getByRole('button', { name: 'Validate' }))
  }

  it('accepts a NISS with the right check digit', async () => {
    await validate('112 345 678 92')
    expect(screen.getByText('Valid social security number')).toBeVisible()
  })

  it('reports a wrong check digit', async () => {
    await validate('11234567893')
    expect(screen.getByText('Invalid check digit')).toBeVisible()
  })

  it('asks for a number when the field is empty', async () => {
    const { user } = await renderPage(
      '/social-security-number-validator',
      'Social Security Number Validator'
    )
    await user.click(screen.getByRole('button', { name: 'Validate' }))
    expect(screen.getByText('Enter a social security number')).toBeVisible()
  })
})
