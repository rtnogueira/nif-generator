import { getPersonLocale, loadPersonGenerator, type PersonOptions } from '@/lib/person'
import { datasetColumns, type DatasetColumn } from './columns'

export const MIN_ROWS = 1
export const MAX_ROWS = 1000
export const DEFAULT_ROWS = 10

export function clampRows(value: number): number {
  if (!Number.isFinite(value)) return DEFAULT_ROWS
  return Math.min(MAX_ROWS, Math.max(MIN_ROWS, Math.trunc(value)))
}

/** A generated table: one row per person, one value per column. */
export interface Dataset {
  country: string
  columns: readonly DatasetColumn[]
  rows: readonly (readonly string[])[]
}

/** The columns with these ids, in the order the country lists them; unknown ids are dropped. */
export function selectColumns(countryCode: string, ids: readonly string[]): DatasetColumn[] {
  return datasetColumns(countryCode).filter(column => ids.includes(column.id))
}

export function defaultColumnIds(countryCode: string): string[] {
  return datasetColumns(countryCode)
    .filter(column => column.selected)
    .map(column => column.id)
}

/**
 * Generates `count` rows for a country. Every value of a row is made from the same person, so
 * numbers that hold a birth date or sex agree with the person's.
 */
export async function buildDataset(
  countryCode: string,
  columnIds: readonly string[],
  count: number,
  options: PersonOptions
): Promise<Dataset> {
  if (!getPersonLocale(countryCode)) throw new Error(`No test data for ${countryCode}`)
  const generatePerson = await loadPersonGenerator(countryCode)
  const columns = selectColumns(countryCode, columnIds)
  const rows = Array.from({ length: clampRows(count) }, () => {
    const person = generatePerson(options)
    return columns.map(column => column.value(person))
  })
  return { country: countryCode, columns, rows }
}
