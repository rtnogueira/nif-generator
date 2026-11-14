import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { isValidIban } from '@/lib/iban'
import { createAppRouter } from '@/router'

async function renderPage(url: string, heading: string) {
  const user = userEvent.setup()
  const router = createAppRouter(createMemoryHistory({ initialEntries: [url] }))
  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1, name: heading })
  return { user, router }
}

const copyButtons = () => screen.getAllByRole('button', { name: /^Copy [A-Z]{2}\d{2}/ })
const shownIbans = () =>
  copyButtons().map(button => (button.getAttribute('aria-label') ?? '').slice(5))

describe('IBAN generator page', () => {
  it('is listed under Banking in the Tools menu', async () => {
    const { user } = await renderPage('/', 'Tax ID Generator')

    await user.click(screen.getByRole('button', { name: 'Tools' }))
    const banking = await screen.findByRole('list', { name: 'Banking' })
    expect(within(banking).getByRole('link', { name: /IBAN generator/ })).toHaveAttribute(
      'href',
      '/iban-generator'
    )
    expect(within(banking).getByRole('link', { name: /IBAN validator/ })).toHaveAttribute(
      'href',
      '/iban-validator'
    )
  })

  it('starts with Portugal and generates valid IBANs', async () => {
    const { user, router } = await renderPage('/iban-generator', 'IBAN Generator')

    expect(screen.getByText('Banking')).toBeVisible()
    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveTextContent('Portugal')
    expect(screen.queryByLabelText(/Include the .* prefix/)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Generate' }))
    const ibans = shownIbans()
    expect(ibans).toHaveLength(1)
    expect(ibans[0]).toMatch(/^PT50\d{21}$/)
    expect(isValidIban(ibans[0])).toBe(true)
    expect(router.state.location.search).toMatchObject({ country: 'PT', type: 'iban' })
  })

  it('reads its options from the URL, with the printed form and invalid IBANs', async () => {
    await renderPage('/iban-generator?country=DE&qty=3&format=1', 'IBAN Generator')
    const ibans = shownIbans()
    expect(ibans).toHaveLength(3)
    for (const iban of ibans) {
      expect(iban).toMatch(/^DE\d{2}( \d{4}){4} \d{2}$/)
      expect(isValidIban(iban)).toBe(true)
    }
  })

  it('generates IBANs with a wrong check digit on request', async () => {
    await renderPage(
      '/iban-generator?country=ES&qty=5&validity=invalid-check-digit',
      'IBAN Generator'
    )
    expect(screen.getAllByText('Invalid check digit').length).toBeGreaterThan(1)
    const ibans = shownIbans()
    expect(ibans).toHaveLength(5)
    for (const iban of ibans) expect(isValidIban(iban)).toBe(false)
  })

  it('lists every country of the registry', async () => {
    await renderPage('/iban-generator', 'IBAN Generator')
    const table = screen.getByRole('table')
    // A header row and the 89 countries.
    expect(within(table).getAllByRole('row')).toHaveLength(90)
  })
})

describe('IBAN validator page', () => {
  async function validate(input: string, url = '/iban-validator') {
    const { user } = await renderPage(url, 'IBAN Validator')
    await user.type(screen.getByRole('textbox', { name: 'Number' }), input)
    await user.click(screen.getByRole('button', { name: 'Validate' }))
  }

  it('sets the page title and detects the country from the IBAN', async () => {
    await validate('PT50 0001 0000 1234 5678 9019 4')

    expect(document.title).toBe('IBAN Validator: check the structure and check digits | rtnogueira')
    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveTextContent(
      'Detect from prefix'
    )
    expect(screen.getByText('Valid IBAN')).toBeVisible()
    expect(screen.getByText('PT50000100001234567890194')).toBeVisible()
  })

  it('reports a wrong check digit', async () => {
    await validate('PT51 0001 0000 1234 5678 9019 4')
    expect(screen.getByText('Invalid check digit')).toBeVisible()
  })

  it('reports a wrong length', async () => {
    await validate('DE89 3704 0044 0532 0130')
    expect(screen.getByText('Invalid format')).toBeVisible()
  })

  it('reports a country that is not in the registry', async () => {
    await validate('US12 3456 7890')
    expect(screen.getByText('Country not recognised')).toBeVisible()
  })

  it('asks for an IBAN when the field is empty', async () => {
    const { user } = await renderPage('/iban-validator', 'IBAN Validator')
    await user.click(screen.getByRole('button', { name: 'Validate' }))
    expect(screen.getByText('Enter an IBAN')).toBeVisible()
  })
})
