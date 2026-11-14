import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { downloadXlsxTable } from '@/lib/export-xlsx'
import { createAppRouter } from '@/router'

vi.mock('@/lib/export-xlsx', () => ({
  downloadXlsxColumn: vi.fn(() => Promise.resolve()),
  downloadXlsxTable: vi.fn(() => Promise.resolve()),
}))

async function renderPage(url = '/person-generator') {
  const user = userEvent.setup()
  const router = createAppRouter(createMemoryHistory({ initialEntries: [url] }))
  render(<RouterProvider router={router} />)
  await screen.findByRole('heading', { level: 1, name: 'Person Generator' })
  return { user, router }
}

const dataRows = async () => {
  const table = await screen.findByRole('table')
  return within(table).getAllByRole('row').slice(1)
}
const headers = () =>
  within(screen.getByRole('table'))
    .getAllByRole('columnheader')
    .map(header => header.textContent)

describe('person generator page', () => {
  it('starts empty, with Portugal and the usual columns selected', async () => {
    await renderPage()

    expect(screen.getByText('People & test data')).toBeVisible()
    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveTextContent('Portugal')
    expect(screen.getByText('No rows yet')).toBeVisible()
    expect(screen.getByLabelText('First name')).toBeChecked()
    expect(screen.getByLabelText('Region')).not.toBeChecked()
  })

  it('generates a table and keeps the options in the page address', async () => {
    const { user, router } = await renderPage()

    await user.click(screen.getByRole('button', { name: 'Generate' }))
    expect(await dataRows()).toHaveLength(10)
    expect(headers()).toEqual([
      '#',
      'First name',
      'Last name',
      'Sex',
      'Birth date',
      'Street',
      'Postal code',
      'City',
      'Actions',
    ])
    expect(router.state.location.search).toMatchObject({ country: 'PT' })
  })

  it('reads the country, rows, columns, sex and ages from the page address', async () => {
    await renderPage(
      '/person-generator?country=ES&rows=3&cols=first-name,sex,age&sex=male&min=40&max=41'
    )

    const rows = await dataRows()
    expect(rows).toHaveLength(3)
    expect(headers()).toEqual(['#', 'First name', 'Sex', 'Age', 'Actions'])
    for (const row of rows) {
      const cells = within(row).getAllByRole('cell')
      expect(cells[2]).toHaveTextContent('male')
      expect(['40', '41']).toContain(cells[3].textContent)
    }
    expect(screen.getByRole('combobox', { name: 'Country' })).toHaveTextContent('Spain')
  })

  it('needs at least one column', async () => {
    const { user } = await renderPage('/person-generator?country=PT&cols=city')

    await dataRows()
    await user.click(screen.getByLabelText('City'))
    expect(screen.getByRole('button', { name: 'Generate' })).toBeDisabled()
    expect(screen.getByText('Select at least one column.')).toBeVisible()
  })

  it('copies the table as tab-separated values, with a header row', async () => {
    const { user } = await renderPage('/person-generator?country=PT&rows=2&cols=first-name,city')

    await dataRows()
    await user.click(screen.getByRole('button', { name: 'Copy all' }))
    const lines = (await navigator.clipboard.readText()).split('\n')
    expect(lines).toHaveLength(3)
    expect(lines[0]).toBe('First name\tCity')
  })

  it('exports the table to Excel', async () => {
    const { user } = await renderPage('/person-generator?country=PT&rows=2&cols=first-name,city')

    await dataRows()
    await user.click(screen.getByRole('button', { name: 'Export' }))
    await user.click(await screen.findByRole('menuitem', { name: 'Excel (.xlsx)' }))
    expect(downloadXlsxTable).toHaveBeenCalledWith(
      ['First name', 'City'],
      expect.arrayContaining([expect.any(Array)]),
      'people-pt'
    )
  })
})
