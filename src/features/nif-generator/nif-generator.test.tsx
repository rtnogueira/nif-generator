import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { downloadXlsxColumn } from '@/lib/export-xlsx'
import { isValidNif } from '@/lib/nif'
import { getTaxIdType, validateTaxNumber } from '@/lib/tax-id'
import { validateVatNumber } from '@/lib/vat'
import { createAppRouter } from '@/router'

vi.mock('@/lib/export-xlsx', () => ({ downloadXlsxColumn: vi.fn(() => Promise.resolve()) }))

async function renderApp(url = '/') {
  const user = userEvent.setup()
  const router = createAppRouter(createMemoryHistory({ initialEntries: [url] }))
  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { name: 'Tax Number Generator' })
  return user
}

async function renderAppWithRouter(url = '/') {
  const user = userEvent.setup()
  const router = createAppRouter(createMemoryHistory({ initialEntries: [url] }))
  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { name: 'Tax Number Generator' })
  return { user, router }
}

/** Captures text downloads: the file name and content of each `downloadTextFile`. */
function captureDownloads() {
  const downloads: { name: string; blob: Blob }[] = []
  const blobs = new Map<string, Blob>()
  URL.createObjectURL = vi.fn((blob: Blob) => {
    const url = `blob:${blobs.size}`
    blobs.set(url, blob)
    return url
  })
  URL.revokeObjectURL = vi.fn()
  vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
    this: HTMLAnchorElement
  ) {
    downloads.push({ name: this.download, blob: blobs.get(this.href) as Blob })
  })
  return downloads
}

const resultRows = (pattern = /^Copy \d{9}$/) => screen.getAllByRole('button', { name: pattern })
const generatedNifs = (pattern?: RegExp) =>
  resultRows(pattern).map(button => (button.getAttribute('aria-label') ?? '').slice(5))

describe('NIF generator page', () => {
  it('links to the tax number generator from the Tools menu', async () => {
    const user = await renderApp()

    await user.click(screen.getByRole('button', { name: 'Tools' }))
    expect(await screen.findByRole('link', { name: /Tax number generator/ })).toHaveAttribute(
      'href',
      '/'
    )
  })

  it('starts empty, with the default type and quantity', async () => {
    await renderApp()

    expect(screen.getByText('No numbers yet')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveTextContent('Portugal')
    expect(screen.getByRole('combobox', { name: 'Type' })).toHaveTextContent('Pessoa singular')
    expect(screen.getByLabelText('Quantity')).toHaveValue(1)
    expect(screen.queryByRole('button', { name: /export/i })).not.toBeInTheDocument()
  })

  it('generates the requested number of valid NIFs for the selected type', async () => {
    const user = await renderApp()

    await user.click(screen.getByRole('combobox', { name: 'Type' }))
    await user.click(await screen.findByRole('option', { name: /Pessoa colectiva$/ }))
    const quantity = screen.getByLabelText('Quantity')
    await user.clear(quantity)
    await user.type(quantity, '12{Enter}')

    const nifs = generatedNifs()
    expect(nifs).toHaveLength(12)
    expect(nifs.every(nif => nif.startsWith('5') && isValidNif(nif))).toBe(true)
  })

  it('clamps the quantity between 1 and 50', async () => {
    const user = await renderApp()
    const quantity = screen.getByLabelText('Quantity')

    expect(screen.getByRole('button', { name: 'Decrease quantity' })).toBeDisabled()
    await user.clear(quantity)
    await user.type(quantity, '99')
    await user.tab()
    expect(quantity).toHaveValue(50)
    expect(screen.getByRole('button', { name: 'Increase quantity' })).toBeDisabled()
  })

  it('copies a single NIF and all NIFs to the clipboard', async () => {
    const user = await renderApp()
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
    await user.click(screen.getByRole('button', { name: 'Generate' }))
    const [first, second] = generatedNifs()

    await user.click(screen.getByRole('button', { name: `Copy ${first}` }))
    expect(await navigator.clipboard.readText()).toBe(first)
    expect(await screen.findByText(`Copied ${first}`)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Copy all' }))
    expect(await navigator.clipboard.readText()).toBe(`${first}\n${second}`)
  })

  it('only marks the button that was clicked as copied', async () => {
    const user = await renderApp()
    await user.click(screen.getByRole('button', { name: 'Generate' }))
    const [only] = generatedNifs()

    await user.click(screen.getByRole('button', { name: `Copy ${only}` }))
    expect(await navigator.clipboard.readText()).toBe(only)
    expect(
      screen.getByRole('button', { name: 'Copy all' }).querySelector('.lucide-check')
    ).toBeNull()
  })

  it('exports the generated NIFs to tax-numbers-pt.xlsx', async () => {
    const user = await renderApp()
    await user.click(screen.getByRole('button', { name: 'Generate' }))
    const nifs = generatedNifs()

    await user.click(screen.getByRole('button', { name: 'Export' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Excel (.xlsx)' }))
    expect(downloadXlsxColumn).toHaveBeenCalledWith('NIF', nifs, 'tax-numbers-pt')
  })

  it('exports CSV and JSON files and copies in other formats', async () => {
    const downloads = captureDownloads()
    const user = await renderApp()
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
    await user.click(screen.getByRole('button', { name: 'Generate' }))
    const [first, second] = generatedNifs()

    await user.click(screen.getByRole('button', { name: 'Export' }))
    await user.click(await screen.findByRole('menuitem', { name: 'CSV (.csv)' }))
    await user.click(screen.getByRole('button', { name: 'Export' }))
    await user.click(await screen.findByRole('menuitem', { name: 'JSON (.json)' }))
    expect(downloads.map(d => d.name)).toEqual(['tax-numbers-pt.csv', 'tax-numbers-pt.json'])
    expect(await downloads[0].blob.text()).toBe(`"NIF"\r\n"${first}"\r\n"${second}"\r\n`)
    expect(JSON.parse(await downloads[1].blob.text())).toEqual([first, second])

    await user.click(screen.getByRole('button', { name: 'More copy formats' }))
    await user.click(await screen.findByRole('menuitem', { name: 'JSON array' }))
    expect(JSON.parse(await navigator.clipboard.readText())).toEqual([first, second])
    await user.click(screen.getByRole('button', { name: 'More copy formats' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Comma-separated list' }))
    expect(await navigator.clipboard.readText()).toBe(`${first}, ${second}`)
  })

  it('keeps the options in the URL', async () => {
    const { user, router } = await renderAppWithRouter()
    await user.click(screen.getByRole('button', { name: 'Increase quantity' }))
    await user.click(screen.getByRole('button', { name: 'Generate' }))

    expect(router.state.location.searchStr).toBe('?country=PT&type=2&qty=2')
  })

  it('fills the form and generates from a shared URL', async () => {
    await renderApp('/?country=BR&type=cnpj&qty=3&format=1')

    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveTextContent('Brazil')
    expect(screen.getByRole('combobox', { name: 'Type' })).toHaveTextContent('CNPJ')
    expect(screen.getByLabelText('Formatted')).toBeChecked()
    const cnpjs = generatedNifs(/^Copy \d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/)
    expect(cnpjs).toHaveLength(3)
    expect(cnpjs.every(n => validateTaxNumber(n, 'BR').status === 'valid')).toBe(true)
  })

  it('ignores invalid options in the URL', async () => {
    await renderApp('/?country=XX&type=nope&qty=-4')

    expect(screen.getByText('No numbers yet')).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveTextContent('Portugal')
  })

  it('generates numbers with a wrong check digit, clearly marked', async () => {
    const downloads = captureDownloads()
    const user = await renderApp()

    await user.click(screen.getByRole('combobox', { name: 'Validity' }))
    await user.click(await screen.findByRole('option', { name: 'Invalid check digit' }))
    await user.click(screen.getByRole('button', { name: 'Generate' }))

    const [nif] = generatedNifs()
    expect(isValidNif(nif)).toBe(false)
    expect(validateTaxNumber(nif, 'PT').status).toBe('invalid-check-digit')
    expect(screen.getByText('Invalid check digit', { selector: '[data-slot=badge]' })).toBeVisible()

    await user.click(screen.getByRole('button', { name: 'Export' }))
    await user.click(await screen.findByRole('menuitem', { name: /Text/ }))
    expect(downloads[0].name).toBe('tax-numbers-pt-invalid-check-digit.txt')
  })

  it('generates VAT numbers for another country, with or without its prefix', async () => {
    const user = await renderApp()

    await user.click(screen.getByRole('combobox', { name: 'Country' }))
    await user.click(await screen.findByRole('option', { name: /Germany/ }))
    expect(screen.getByRole('combobox', { name: 'Type' })).toHaveTextContent('USt-IdNr.')
    const quantity = screen.getByLabelText('Quantity')
    await user.clear(quantity)
    await user.type(quantity, '5{Enter}')

    const numbers = generatedNifs()
    expect(numbers).toHaveLength(5)
    expect(numbers.every(n => validateVatNumber(n, 'DE').status === 'valid')).toBe(true)
    expect(screen.getAllByText('USt-IdNr.').length).toBeGreaterThan(1)

    await user.click(screen.getByLabelText('Include the DE prefix'))
    await user.click(screen.getByRole('button', { name: 'Generate' }))
    const prefixed = generatedNifs(/^Copy DE\d{9}$/)
    expect(prefixed).toHaveLength(5)
    expect(prefixed.every(n => validateVatNumber(n).status === 'valid')).toBe(true)
  })

  it('offers every number type of the selected country', async () => {
    const user = await renderApp()

    await user.click(screen.getByRole('combobox', { name: 'Country' }))
    await user.click(await screen.findByRole('option', { name: /Spain/ }))
    await user.click(screen.getByRole('combobox', { name: 'Type' }))
    const options = await screen.findAllByRole('option')
    expect(options.map(option => option.textContent?.slice(0, 3))).toEqual(['DNI', 'NIE', 'CIF'])

    await user.click(screen.getByRole('option', { name: /NIE/ }))
    await user.click(screen.getByRole('button', { name: 'Generate' }))
    const [nie] = generatedNifs(/^Copy [XYZ]\d{7}[A-Z]$/)
    expect(validateVatNumber(nie, 'ES').status).toBe('valid')
  })

  it('generates tax numbers outside VIES, without the prefix option', async () => {
    const user = await renderApp()

    await user.click(screen.getByRole('combobox', { name: 'Country' }))
    await user.click(await screen.findByRole('option', { name: /Brazil/ }))
    expect(screen.queryByLabelText(/Include the .* prefix/)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Generate' }))
    const [cpf] = generatedNifs(/^Copy \d{11}$/)
    expect(getTaxIdType('BR', 'cpf')?.isValid(cpf)).toBe(true)
  })

  it('renders the site chrome', async () => {
    await renderApp()
    const footer = screen.getByRole('contentinfo')

    expect(within(footer).getByRole('link', { name: 'rtnogueira' })).toBeInTheDocument()
    expect(within(footer).getByRole('link', { name: /buy me a coffee/i })).toBeInTheDocument()
    expect(within(footer).getByText(/For QA testing purposes only/)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /switch to (dark|light) mode/i })).toBeInTheDocument()
  })
})
