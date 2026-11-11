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
  await screen.findByRole('heading', { name: 'Tax ID Generator' })
  return user
}

async function renderAppWithRouter(url = '/') {
  const user = userEvent.setup()
  const router = createAppRouter(createMemoryHistory({ initialEntries: [url] }))
  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { name: 'Tax ID Generator' })
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
    expect(await screen.findByRole('link', { name: /Tax ID generator/ })).toHaveAttribute(
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

  it('searches the country list by name or code', async () => {
    const user = await renderApp()

    await user.click(screen.getByRole('combobox', { name: 'Country' }))
    const search = await screen.findByRole('combobox', { name: 'Search countries' })
    await user.type(search, 'port')
    expect(screen.getByRole('option', { name: /Portugal/ })).toBeInTheDocument()
    expect(screen.queryByRole('option', { name: /Brazil/ })).not.toBeInTheDocument()

    await user.clear(search)
    await user.type(search, 'xyz')
    expect(screen.getByText('No country found.')).toBeInTheDocument()

    await user.clear(search)
    await user.type(search, 'de')
    expect(screen.getByRole('option', { name: /Germany/ })).toBeInTheDocument()
    await user.type(search, 'utsch')
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
  })

  it('selects the highlighted country with Enter without generating', async () => {
    const user = await renderApp()

    await user.click(screen.getByRole('combobox', { name: 'Country' }))
    await user.type(
      await screen.findByRole('combobox', { name: 'Search countries' }),
      'brazil{Enter}'
    )

    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveTextContent('Brazil')
    expect(screen.queryByRole('option')).not.toBeInTheDocument()
    expect(screen.queryAllByRole('button', { name: /^Copy \d{11}$/ })).toHaveLength(0)
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

  it('links to GitHub issue forms with the current page and options', async () => {
    const user = await renderApp()
    await user.click(screen.getByRole('button', { name: 'Generate' }))
    const footer = screen.getByRole('contentinfo')

    const bug = new URL(
      within(footer).getByRole('link', { name: 'Report a bug' }).getAttribute('href') ?? ''
    )
    expect(bug.origin + bug.pathname).toBe('https://github.com/rtnogueira/nif-generator/issues/new')
    expect(bug.searchParams.get('template')).toBe('bug_report.yml')
    expect(bug.searchParams.get('page')).toBe(`${window.location.origin}/?country=PT&type=2&qty=1`)

    const feature = new URL(
      within(footer).getByRole('link', { name: 'Suggest a feature' }).getAttribute('href') ?? ''
    )
    expect(feature.searchParams.get('template')).toBe('feature_request.yml')
  })

  it('offers bug reports and feature requests in the top bar', async () => {
    const user = await renderApp('/?country=BR&type=cpf&qty=2')

    const nav = screen.getByRole('navigation', { name: 'Main' })
    await user.click(within(nav).getByRole('button', { name: 'Feedback' }))
    const bug = await within(nav).findByRole('link', { name: /Report a bug/ })
    const url = new URL(bug.getAttribute('href') ?? '')
    expect(url.searchParams.get('template')).toBe('bug_report.yml')
    expect(url.searchParams.get('page')).toBe(
      `${window.location.origin}/?country=BR&type=cpf&qty=2`
    )
    expect(within(nav).getByRole('link', { name: /Suggest a feature/ })).toHaveAttribute(
      'href',
      expect.stringContaining('template=feature_request.yml')
    )
  })

  it('has a burger menu with the tools and feedback links', async () => {
    const user = await renderApp()

    await user.click(screen.getByRole('button', { name: 'Open menu' }))
    const items = await screen.findAllByRole('menuitem')
    expect(items.map(item => item.textContent)).toEqual([
      'Tax ID generator',
      'Tax ID validator',
      'Report a bug',
      'Suggest a feature',
    ])

    await user.click(screen.getByRole('menuitem', { name: 'Tax ID validator' }))
    expect(await screen.findByRole('heading', { level: 1, name: 'Tax ID Validator' })).toBeVisible()
  })

  it('explains tax numbers in general, not only Portuguese NIFs', async () => {
    await renderApp()
    const headings = screen.getAllByRole('heading', { level: 2 }).map(h => h.textContent)

    expect(headings).toEqual([
      'What is a tax ID?',
      'How do check digits work?',
      'Supported countries',
      'Portuguese NIF types',
      'Frequently asked questions',
      'Related tools',
    ])
    expect(screen.getByRole('link', { name: 'tax ID validator' })).toHaveAttribute(
      'href',
      '/tax-id-validator'
    )
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

describe('Generator landing pages', () => {
  async function renderPage(url: string, heading: string) {
    const user = userEvent.setup()
    const router = createAppRouter(createMemoryHistory({ initialEntries: [url] }))
    render(<RouterProvider router={router} />)
    await screen.findByRole('heading', { level: 1, name: heading })
    return { user, router }
  }

  it('presets the CPF page to formatted Brazilian CPFs and keeps its own address', async () => {
    const { user, router } = await renderPage('/cpf-generator', 'CPF Generator')

    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveTextContent('Brazil')
    expect(screen.getByRole('combobox', { name: 'Type' })).toHaveTextContent('CPF')
    expect(screen.getByLabelText('Formatted')).toBeChecked()
    expect(document.title).toBe('CPF Generator: valid Brazilian CPF & CNPJ numbers | rtnogueira')

    await user.click(screen.getByRole('button', { name: 'Generate' }))
    const [button] = resultRows(/^Copy \d{3}\.\d{3}\.\d{3}-\d{2}$/)
    const cpf = (button.getAttribute('aria-label') ?? '').slice(5)
    expect(validateTaxNumber(cpf, 'BR')).toMatchObject({ status: 'valid' })
    expect(router.state.location.pathname).toBe('/cpf-generator')
    expect(router.state.location.searchStr).toBe('?country=BR&type=cpf&qty=1&format=1')
  })

  it('presets the VAT page to German VAT numbers with the prefix', async () => {
    await renderPage('/vat-number-generator', 'VAT Number Generator')

    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveTextContent('Germany')
    expect(screen.getByLabelText('Include the DE prefix')).toBeChecked()
  })

  it('lets options in the URL override the preset', async () => {
    await renderPage('/nif-generator?country=BR&type=cnpj&qty=2', 'NIF Generator')

    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveTextContent('Brazil')
    expect(resultRows(/^Copy \d{14}$/)).toHaveLength(2)
  })

  it('links to the other tools but not to itself', async () => {
    await renderPage('/nif-generator', 'NIF Generator')
    const related = screen.getByRole('navigation', { name: 'Related tools' })

    expect(
      within(related)
        .getAllByRole('link')
        .map(link => link.getAttribute('href'))
    ).toEqual(['/', '/vat-number-generator', '/cpf-generator', '/tax-id-validator'])
  })

  it('updates the description and canonical URL on navigation', async () => {
    document.head.innerHTML =
      '<meta name="description" content=""><link rel="canonical" href="">' +
      '<meta property="og:url" content=""><meta property="og:title" content="">'
    const { user } = await renderPage('/', 'Tax ID Generator')

    const related = screen.getByRole('navigation', { name: 'Related tools' })
    await user.click(within(related).getByRole('link', { name: /VAT number generator/ }))
    await screen.findByRole('heading', { level: 1, name: 'VAT Number Generator' })

    expect(document.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://rtnogueira.com/vat-number-generator'
    )
    expect(document.querySelector('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://rtnogueira.com/vat-number-generator'
    )
    expect(document.querySelector('meta[property="og:title"]')).toHaveAttribute(
      'content',
      document.title
    )
    expect(document.querySelector('meta[name="description"]')?.getAttribute('content')).toMatch(
      /^Generate random, valid EU VAT numbers/
    )
  })

  it('redirects the former validator address', async () => {
    const router = createAppRouter(
      createMemoryHistory({ initialEntries: ['/tax-number-validator'] })
    )
    render(<RouterProvider router={router} />)

    await screen.findByRole('heading', { level: 1, name: 'Tax ID Validator' })
    expect(router.state.location.pathname).toBe('/tax-id-validator')
  })
})
