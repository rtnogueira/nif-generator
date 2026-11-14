/**
 * The columns of a generated table of test data: what each one is called and how its value is
 * made from the person of the row.
 */
import { IBAN_FAMILY } from '@/lib/iban'
import { IDENTITY_FAMILY } from '@/lib/identity'
import type { NumberFamily } from '@/lib/numbers/family'
import type { NumberType } from '@/lib/numbers/types'
import { ageOn, formatBirthDate, type Person } from '@/lib/person'
import { SOCIAL_SECURITY_FAMILY } from '@/lib/social-security'
import { TAX_FAMILY } from '@/lib/tax-id'

export const COLUMN_GROUPS = [
  { id: 'person', label: 'Person' },
  { id: 'tax', label: 'Tax number' },
  { id: 'identity', label: 'Identity number' },
  { id: 'social-security', label: 'Social security' },
  { id: 'banking', label: 'Banking' },
] as const

export type ColumnGroupId = (typeof COLUMN_GROUPS)[number]['id']

/** What the values of one row share. */
export interface RowContext {
  /** Write numbers in their usual form, where they have one. */
  formatted: boolean
  /** Numbers already made for this row, by `sameNumberKey`. */
  numbers: Map<string, string>
}

export interface DatasetColumn {
  /** Unique within a country; kept in the page address. */
  id: string
  group: ColumnGroupId
  /** Column header, also the key of the value in JSON exports. */
  header: string
  /** Selected when the page address does not say which columns to show. */
  selected: boolean
  /** Shown in a monospaced font, as numbers are. */
  mono?: boolean
  value: (person: Person, row: RowContext) => string
}

const PERSON_COLUMN_DEFINITIONS: readonly Omit<DatasetColumn, 'group'>[] = [
  { id: 'first-name', header: 'First name', selected: true, value: p => p.firstName },
  { id: 'last-name', header: 'Last name', selected: true, value: p => p.lastName },
  { id: 'sex', header: 'Sex', selected: true, value: p => p.sex },
  {
    id: 'birth-date',
    header: 'Birth date',
    selected: true,
    mono: true,
    value: p => formatBirthDate(p.birthDate),
  },
  { id: 'age', header: 'Age', selected: false, value: p => String(ageOn(p.birthDate)) },
  { id: 'street', header: 'Street', selected: true, value: p => p.street },
  {
    id: 'postal-code',
    header: 'Postal code',
    selected: true,
    mono: true,
    value: p => p.postalCode,
  },
  { id: 'city', header: 'City', selected: true, value: p => p.city },
  { id: 'region', header: 'Region', selected: false, value: p => p.region },
  { id: 'country', header: 'Country', selected: false, value: p => p.country },
]

const PERSON_COLUMNS: readonly DatasetColumn[] = PERSON_COLUMN_DEFINITIONS.map(column => ({
  ...column,
  group: 'person',
}))

/** The families of numbers a row can hold, with the start of their column ids. */
const NUMBER_GROUPS: readonly { group: ColumnGroupId; prefix: string; family: NumberFamily }[] = [
  { group: 'tax', prefix: 'tax', family: TAX_FAMILY },
  { group: 'identity', prefix: 'id', family: IDENTITY_FAMILY },
  { group: 'social-security', prefix: 'ss', family: SOCIAL_SECURITY_FAMILY },
  { group: 'banking', prefix: 'bank', family: IBAN_FAMILY },
]

/** Tax numbers use the VIES prefix of Greece instead of its ISO code. */
const FAMILY_COUNTRY_CODES: Partial<Record<string, Partial<Record<string, string>>>> = {
  tax: { GR: 'EL' },
}

/**
 * Kinds of number that are one and the same number in real life, so a row shows the same value in
 * both columns: a Belgian's social security number is their national register number.
 */
const SAME_NUMBER: Partial<Record<string, string>> = {
  'BE:social-security:ssn': 'BE:identity:nn',
}

/** Portugal's tax number types are NIF prefixes: a person's NIF starts with 1, 2 or 3. */
const PORTUGUESE_PERSON_NIF = '2'

function numberTypes(family: NumberFamily, countryCode: string): readonly NumberType[] {
  const code = FAMILY_COUNTRY_CODES[family.id]?.[countryCode] ?? countryCode
  const types = family.getCountry(code)?.types ?? []
  return family.id === 'tax' && countryCode === 'PT'
    ? types.filter(type => type.id === PORTUGUESE_PERSON_NIF)
    : types
}

function numberColumns(countryCode: string): DatasetColumn[] {
  const columns: DatasetColumn[] = []
  // Identity numbers first: a number that is also a tax number (the Spanish DNI, the Brazilian
  // CPF) is listed once, as an identity number.
  const taken = new Set(numberTypes(IDENTITY_FAMILY, countryCode).map(type => type.name))
  for (const { group, prefix, family } of NUMBER_GROUPS) {
    const types = numberTypes(family, countryCode).filter(
      type => group !== 'tax' || !taken.has(type.name)
    )
    types.forEach((type, index) => {
      const key = `${countryCode}:${family.id}:${type.id}`
      const sameNumberKey = SAME_NUMBER[key] ?? key
      columns.push({
        id: `${prefix}-${type.id}`,
        group,
        header: type.name,
        selected: index === 0,
        mono: true,
        value: (person, row) => {
          let number = row.numbers.get(sameNumberKey)
          if (number === undefined) {
            number = type.generate(person)
            row.numbers.set(sameNumberKey, number)
          }
          return row.formatted && type.format ? type.format(number) : number
        },
      })
    })
  }
  return columns
}

const COLUMNS_BY_COUNTRY = new Map<string, readonly DatasetColumn[]>()

/** The columns available for a country, in the order they are shown. */
export function datasetColumns(countryCode: string): readonly DatasetColumn[] {
  let columns = COLUMNS_BY_COUNTRY.get(countryCode)
  if (!columns) {
    columns = [...PERSON_COLUMNS, ...numberColumns(countryCode)]
    COLUMNS_BY_COUNTRY.set(countryCode, columns)
  }
  return columns
}

/** True when a group has numbers with a written form, which the "formatted" option changes. */
export function hasFormattedNumbers(countryCode: string, groups: readonly ColumnGroupId[]) {
  return NUMBER_GROUPS.some(
    ({ group, family }) =>
      groups.includes(group) && numberTypes(family, countryCode).some(type => type.format)
  )
}
