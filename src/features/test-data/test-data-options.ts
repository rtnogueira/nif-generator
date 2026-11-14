import {
  clampRows,
  datasetColumns,
  DEFAULT_ROWS,
  defaultColumnIds,
  type ColumnGroupId,
} from '@/lib/dataset'
import {
  clampAges,
  DEFAULT_MAX_AGE,
  DEFAULT_MIN_AGE,
  DEFAULT_PERSON_COUNTRY,
  getPersonLocale,
  SEXES,
  type SexOption,
} from '@/lib/person'

export interface TestDataOptions {
  country: string
  rows: number
  /** Ids of the selected columns. */
  columns: string[]
  sex: SexOption
  minAge: number
  maxAge: number
  /** Write numbers in their usual form, where they have one. */
  formatted: boolean
}

/** The test data pages' URL search params, e.g. `?country=PT&rows=20&cols=first-name,iban`. */
export interface TestDataSearch {
  country?: string
  rows?: string
  cols?: string
  sex?: string
  min?: string
  max?: string
  format?: string
}

const SEARCH_KEYS = ['country', 'rows', 'cols', 'sex', 'min', 'max', 'format'] as const

/** Keeps the known params, as strings; anything else in the URL is dropped. Never throws. */
export function validateTestDataSearch(search: Record<string, unknown>): TestDataSearch {
  const result: TestDataSearch = {}
  for (const key of SEARCH_KEYS) {
    const value = search[key]
    if (['string', 'number', 'boolean'].includes(typeof value) && value !== '') {
      result[key] = String(value)
    }
  }
  return result
}

/** The columns a page offers for a country: those of its groups. */
export function offeredColumns(countryCode: string, groups: readonly ColumnGroupId[]) {
  return datasetColumns(countryCode).filter(column => groups.includes(column.group))
}

/** The columns a page starts with for a country. */
export function defaultColumns(countryCode: string, groups: readonly ColumnGroupId[]): string[] {
  const offered = new Set(offeredColumns(countryCode, groups).map(column => column.id))
  return defaultColumnIds(countryCode).filter(id => offered.has(id))
}

export function defaultOptions(groups: readonly ColumnGroupId[]): TestDataOptions {
  return {
    country: DEFAULT_PERSON_COUNTRY,
    rows: DEFAULT_ROWS,
    columns: defaultColumns(DEFAULT_PERSON_COUNTRY, groups),
    sex: 'any',
    minAge: DEFAULT_MIN_AGE,
    maxAge: DEFAULT_MAX_AGE,
    formatted: false,
  }
}

const isSex = (value: unknown): value is SexOption => SEXES.includes(value as SexOption)

/**
 * The options a URL asks for, or null when it names no supported country. Unknown columns and
 * invalid values fall back to their defaults.
 */
export function optionsFromSearch(
  search: TestDataSearch,
  groups: readonly ColumnGroupId[]
): TestDataOptions | null {
  const country = search.country?.toUpperCase()
  if (!country || !getPersonLocale(country)) return null
  const offered = offeredColumns(country, groups).map(column => column.id)
  const asked = search.cols?.split(',').filter(id => offered.includes(id)) ?? []
  const ages = clampAges(
    Number.parseInt(search.min ?? '', 10),
    Number.parseInt(search.max ?? '', 10)
  )
  return {
    country,
    rows: clampRows(Number.parseInt(search.rows ?? '', 10)),
    columns: asked.length > 0 ? asked : defaultColumns(country, groups),
    sex: isSex(search.sex) ? search.sex : 'any',
    ...ages,
    formatted: search.format === '1',
  }
}

/** The URL search params for `options`, leaving out the ones at their default. */
export function searchFromOptions(options: TestDataOptions): TestDataSearch {
  return {
    country: options.country,
    rows: String(options.rows),
    cols: options.columns.join(','),
    sex: options.sex === 'any' ? undefined : options.sex,
    min: options.minAge === DEFAULT_MIN_AGE ? undefined : String(options.minAge),
    max: options.maxAge === DEFAULT_MAX_AGE ? undefined : String(options.maxAge),
    format: options.formatted ? '1' : undefined,
  }
}
