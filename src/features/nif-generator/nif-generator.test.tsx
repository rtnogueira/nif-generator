import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { downloadXlsxColumn } from '@/lib/export-xlsx'
import { isValidNif } from '@/lib/nif'
import { createAppRouter } from '@/router'

vi.mock('@/lib/export-xlsx', () => ({ downloadXlsxColumn: vi.fn(() => Promise.resolve()) }))

async function renderApp() {
  const user = userEvent.setup()
  const router = createAppRouter(createMemoryHistory({ initialEntries: ['/'] }))
  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { name: 'Tax Number Generator' })
  return user
}

const resultRows = () => screen.getAllByRole('button', { name: /^Copy \d{9}$/ })
const generatedNifs = () =>
  resultRows().map(button => (button.getAttribute('aria-label') ?? '').slice(5))

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

    expect(screen.getByText('No NIFs yet')).toBeInTheDocument()
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

  it('exports the generated NIFs to nif-list.xlsx', async () => {
    const user = await renderApp()
    await user.click(screen.getByRole('button', { name: 'Generate' }))
    const nifs = generatedNifs()

    await user.click(screen.getByRole('button', { name: 'Export .xlsx' }))
    expect(downloadXlsxColumn).toHaveBeenCalledWith('NIF', nifs, 'nif-list')
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
