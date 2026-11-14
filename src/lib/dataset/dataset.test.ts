import { describe, expect, it } from 'vitest'
import { isValidIban } from '@/lib/iban'
import { IDENTITY_FAMILY } from '@/lib/identity'
import { PERSON_LOCALES } from '@/lib/person'
import { SOCIAL_SECURITY_FAMILY } from '@/lib/social-security'
import { validateTaxNumber } from '@/lib/tax-id'
import { buildDataset, clampRows, datasetColumns, defaultColumnIds, selectColumns } from '.'

const ids = (country: string) => datasetColumns(country).map(column => column.id)

/** A dataset as one object per row, keyed by column id. */
async function records(country: string, columnIds: string[], count: number, formatted = false) {
  const dataset = await buildDataset(country, columnIds, count, {
    sex: 'any',
    minAge: 18,
    maxAge: 65,
    formatted,
  })
  return dataset.rows.map(row =>
    Object.fromEntries(dataset.columns.map((column, i) => [column.id, row[i]]))
  )
}

describe('dataset columns', () => {
  it.each(PERSON_LOCALES)('have unique ids and headers for $name', ({ code }) => {
    const columns = datasetColumns(code)
    expect(new Set(columns.map(c => c.id)).size).toBe(columns.length)
    expect(new Set(columns.map(c => c.header)).size).toBe(columns.length)
  })

  it('give Portugal a NIF, a Cartão de Cidadão number, a NISS and an IBAN', () => {
    expect(ids('PT').slice(10)).toEqual(['tax-2', 'id-cc', 'ss-niss', 'bank-iban'])
    expect(defaultColumnIds('PT')).toEqual([
      'first-name',
      'last-name',
      'sex',
      'birth-date',
      'street',
      'postal-code',
      'city',
      'tax-2',
      'id-cc',
      'ss-niss',
      'bank-iban',
    ])
  })

  it('list a number that is both an identity and a tax number once', () => {
    // The DNI and NIE are identity numbers, which leaves the CIF as the tax number.
    expect(ids('ES').slice(10)).toEqual(['tax-cif', 'id-dni', 'id-nie', 'bank-iban'])
    expect(ids('BR').slice(10)).toEqual(['tax-cnpj', 'id-cpf', 'bank-iban'])
  })

  it('only offer the numbers that exist for a country', () => {
    // No verified identity or social security number, and the US is not in the IBAN registry.
    expect(ids('US').slice(10)).toEqual([])
    expect(ids('GR').slice(10)).toEqual(['tax-vat', 'ss-amka', 'bank-iban'])
  })

  it('keep the country order of the columns and drop unknown ids', () => {
    expect(selectColumns('PT', ['bank-iban', 'nope', 'first-name']).map(c => c.id)).toEqual([
      'first-name',
      'bank-iban',
    ])
  })
})

describe('buildDataset', () => {
  it('rejects a country without names and addresses', async () => {
    await expect(
      buildDataset('XX', ['first-name'], 1, { sex: 'any', minAge: 18, maxAge: 65 })
    ).rejects.toThrow()
  })

  it('clamps the number of rows', () => {
    expect(clampRows(0)).toBe(1)
    expect(clampRows(5000)).toBe(1000)
    expect(clampRows(Number.NaN)).toBe(10)
  })

  it('generates valid Portuguese numbers in every row', async () => {
    const rows = await records('PT', ['first-name', 'tax-2', 'id-cc', 'ss-niss', 'bank-iban'], 50)
    expect(rows).toHaveLength(50)
    for (const row of rows) {
      expect(row['first-name']).toBeTruthy()
      expect(row['tax-2']).toMatch(/^2\d{8}$/)
      expect(validateTaxNumber(row['tax-2'], 'PT').status).toBe('valid')
      expect(IDENTITY_FAMILY.validate(row['id-cc'], 'PT').status).toBe('valid')
      expect(SOCIAL_SECURITY_FAMILY.validate(row['ss-niss'], 'PT').status).toBe('valid')
      expect(row['bank-iban']).toMatch(/^PT50\d{21}$/)
      expect(isValidIban(row['bank-iban'])).toBe(true)
    }
  })

  it('writes numbers in their usual form on request', async () => {
    const [row] = await records('PT', ['id-cc', 'bank-iban'], 1, true)
    expect(row['id-cc']).toMatch(/^\d{8} \d [A-Z0-9]{2}\d$/)
    expect(row['bank-iban']).toMatch(/^PT50( \d{4}){5} \d$/)
  })

  it('makes numbers that hold a birth date and sex for the person of the row', async () => {
    for (const row of await records('SE', ['sex', 'birth-date', 'id-personnummer'], 50)) {
      const [year, month, day] = row['birth-date'].split('-')
      expect(row['id-personnummer'].slice(0, 6)).toBe(year.slice(2) + month + day)
      expect(Number(row['id-personnummer'].at(-2)) % 2 === 1).toBe(row.sex === 'male')
    }
    for (const row of await records('PL', ['sex', 'birth-date', 'id-pesel'], 50)) {
      const [year, month, day] = row['birth-date'].split('-')
      expect(row['id-pesel'].slice(0, 2)).toBe(year.slice(2))
      expect(Number(row['id-pesel'].slice(2, 4)) % 20).toBe(Number(month))
      expect(row['id-pesel'].slice(4, 6)).toBe(day)
      expect(Number(row['id-pesel'][9]) % 2 === 1).toBe(row.sex === 'male')
    }
    for (const row of await records('FR', ['sex', 'birth-date', 'ss-nir'], 50)) {
      const [year, month] = row['birth-date'].split('-')
      expect(row['ss-nir'].slice(0, 5)).toBe(
        (row.sex === 'male' ? '1' : '2') + year.slice(2) + month
      )
    }
  })

  it('shows the same number where two columns are one number in real life', async () => {
    for (const row of await records('BE', ['id-nn', 'ss-ssn'], 20)) {
      expect(row['ss-ssn']).toBe(row['id-nn'])
    }
  })

  it.each(PERSON_LOCALES)('fills every column for $name, at any age', async ({ code }) => {
    const dataset = await buildDataset(code, ids(code), 30, { sex: 'any', minAge: 0, maxAge: 120 })
    expect(dataset.rows).toHaveLength(30)
    for (const row of dataset.rows) {
      row.forEach((value, i) => {
        // Greece has no regions of its own.
        if (dataset.columns[i].id !== 'region') expect(value, dataset.columns[i].id).toBeTruthy()
      })
    }
  })
})
