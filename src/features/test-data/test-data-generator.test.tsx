import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { isValidIban } from '@/lib/iban'
import { createAppRouter } from '@/router'

async function renderPage(url = '/test-data-generator') {
  const user = userEvent.setup()
  const router = createAppRouter(createMemoryHistory({ initialEntries: [url] }))
  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1, name: 'Test Data Generator' })
  return { user, router }
}

const headers = () =>
  within(screen.getByRole('table', { name: '' }))
    .getAllByRole('columnheader')
    .map(header => header.textContent)

describe('test data generator page', () => {
  it('offers the person and the numbers of the country, in groups', async () => {
    await renderPage()

    for (const group of [
      'Person columns',
      'Tax number columns',
      'Identity number columns',
      'Social security columns',
      'Banking columns',
    ]) {
      expect(screen.getByRole('group', { name: group })).toBeVisible()
    }
    for (const column of ['NIF', 'Cartão de Cidadão', 'NISS', 'IBAN']) {
      expect(screen.getByLabelText(column)).toBeChecked()
    }
  })

  it('generates one person per row with their numbers', async () => {
    const { user, router } = await renderPage()

    await user.click(screen.getByRole('button', { name: 'Generate' }))
    const table = await screen.findByRole('table')
    expect(within(table).getAllByRole('row')).toHaveLength(11)
    expect(headers().slice(-5)).toEqual(['NIF', 'Cartão de Cidadão', 'NISS', 'IBAN', 'Actions'])
    expect(router.state.location.search).toMatchObject({ country: 'PT' })
  })

  it('changes the number columns with the country', async () => {
    const { user } = await renderPage()

    await user.click(screen.getByRole('combobox', { name: 'Country' }))
    await user.click(await screen.findByRole('option', { name: /Sweden/ }))

    expect(screen.queryByLabelText('NISS')).not.toBeInTheDocument()
    expect(screen.getByLabelText('Personnummer')).toBeChecked()
    expect(screen.getByLabelText('IBAN')).toBeChecked()
    // The person columns that were selected stay selected.
    expect(screen.getByLabelText('First name')).toBeChecked()
  })

  it('reads the columns and the written form from the page address', async () => {
    await renderPage('/test-data-generator?country=PT&rows=4&cols=last-name,bank-iban&format=1')

    const table = await screen.findByRole('table')
    const rows = within(table).getAllByRole('row').slice(1)
    expect(rows).toHaveLength(4)
    expect(headers()).toEqual(['#', 'Last name', 'IBAN', 'Actions'])
    for (const row of rows) {
      const iban = within(row).getAllByRole('cell')[2].textContent
      expect(iban).toMatch(/^PT50( \d{4}){5} \d$/)
      expect(isValidIban(iban)).toBe(true)
    }
    expect(screen.getByLabelText('Formatted numbers')).toBeChecked()
  })
})
