import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { trackEvent } from '@/lib/analytics'
import { createAppRouter } from '@/router'

vi.mock('@/lib/analytics', () => ({
  initAnalytics: vi.fn(),
  trackPageView: vi.fn(),
  trackEvent: vi.fn(),
}))
vi.mock('@/lib/export-xlsx', () => ({
  downloadXlsxColumn: vi.fn(() => Promise.resolve()),
  downloadXlsxTable: vi.fn(() => Promise.resolve()),
}))

async function renderPage(url: string, heading: string) {
  const user = userEvent.setup()
  const router = createAppRouter(createMemoryHistory({ initialEntries: [url] }))
  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1, name: heading })
  return user
}

/** Everything recorded so far, as text, to check that no generated or typed value is in it. */
const recorded = () => JSON.stringify(vi.mocked(trackEvent).mock.calls)

describe('usage events', () => {
  it('record what was generated, copied and exported, without the numbers', async () => {
    const user = await renderPage('/iban-generator', 'IBAN Generator')

    await user.click(screen.getByRole('button', { name: 'Generate' }))
    expect(trackEvent).toHaveBeenLastCalledWith('generate_numbers', {
      tool: 'iban',
      country: 'PT',
      number_type: 'iban',
      quantity: 1,
      validity: 'valid',
      formatted: false,
      with_prefix: false,
    })

    await user.click(screen.getByRole('button', { name: 'Copy all' }))
    expect(trackEvent).toHaveBeenLastCalledWith('copy_results', {
      tool: 'iban',
      scope: 'all',
      format: 'lines',
    })

    const copyOne = screen.getByRole('button', { name: /^Copy PT50/ })
    const iban = (copyOne.getAttribute('aria-label') ?? '').slice(5)
    await user.click(copyOne)
    expect(trackEvent).toHaveBeenLastCalledWith('copy_results', {
      tool: 'iban',
      scope: 'single',
      format: 'value',
    })

    await user.click(screen.getByRole('button', { name: 'Export' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Excel (.xlsx)' }))
    expect(trackEvent).toHaveBeenLastCalledWith('export_results', { tool: 'iban', format: 'xlsx' })

    expect(recorded()).not.toContain(iban)
  })

  it('record the outcome of a validation, never the number', async () => {
    const user = await renderPage('/tax-id-validator', 'Tax ID Validator')

    await user.type(screen.getByRole('textbox', { name: 'Number' }), 'PT501964843')
    await user.click(screen.getByRole('button', { name: 'Validate' }))

    expect(trackEvent).toHaveBeenLastCalledWith('validate_number', {
      tool: 'tax',
      country: 'auto',
      result: 'valid',
    })
    expect(recorded()).not.toContain('501964843')
  })

  it('record the columns of a generated table', async () => {
    const user = await renderPage(
      '/test-data-generator?country=PT&rows=3&cols=first-name,bank-iban',
      'Test Data Generator'
    )
    await screen.findByRole('table')
    // Opening a page with options is a page view, not an action.
    expect(trackEvent).not.toHaveBeenCalled()

    await user.click(screen.getByRole('button', { name: 'Generate' }))
    expect(trackEvent).toHaveBeenLastCalledWith('generate_table', {
      tool: 'test-data',
      country: 'PT',
      rows: 3,
      column_count: 2,
      columns: 'first-name,bank-iban',
      formatted: false,
    })
  })
})
