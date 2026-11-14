/**
 * The columns of a generated table of test data: what each one is called and how its value is
 * made from the person of the row.
 */
import { ageOn, formatBirthDate, type Person } from '@/lib/person'

export const COLUMN_GROUPS = [{ id: 'person', label: 'Person' }] as const

export type ColumnGroupId = (typeof COLUMN_GROUPS)[number]['id']

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
  value: (person: Person) => string
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

/** The columns available for a country, in the order they are shown. */
export function datasetColumns(_countryCode: string): readonly DatasetColumn[] {
  return PERSON_COLUMNS
}
