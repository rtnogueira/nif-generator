import type { Faker } from '@faker-js/faker'
import type { PersonSeed } from '@/lib/numbers/types'
import { getPersonLocale, type PersonLocale } from './locales'

/** A generated person. The birth date and sex are what numbers that encode them are made from. */
export interface Person extends PersonSeed {
  firstName: string
  lastName: string
  /** Street and number, written the way the country does. */
  street: string
  postalCode: string
  city: string
  /** District, state or province; empty for countries without that data. */
  region: string
  /** English name of the country. */
  country: string
}

export const SEXES = ['any', 'female', 'male'] as const
export type SexOption = (typeof SEXES)[number]

export const MIN_AGE = 0
export const MAX_AGE = 120
export const DEFAULT_MIN_AGE = 18
export const DEFAULT_MAX_AGE = 65

export interface PersonOptions {
  sex: SexOption
  /** Age in whole years today, both ends included. */
  minAge: number
  maxAge: number
}

export const DEFAULT_PERSON_OPTIONS: PersonOptions = {
  sex: 'any',
  minAge: DEFAULT_MIN_AGE,
  maxAge: DEFAULT_MAX_AGE,
}

/** The ages in range and in order, whatever was asked for. */
export function clampAges(minAge: number, maxAge: number): { minAge: number; maxAge: number } {
  const clamp = (value: number, fallback: number) =>
    Number.isFinite(value) ? Math.min(MAX_AGE, Math.max(MIN_AGE, Math.trunc(value))) : fallback
  const a = clamp(minAge, DEFAULT_MIN_AGE)
  const b = clamp(maxAge, DEFAULT_MAX_AGE)
  return { minAge: Math.min(a, b), maxAge: Math.max(a, b) }
}

/** The date of a birth date, at midnight UTC, as the numbers that encode it read it. */
function dateOnly(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
}

function generatePerson(faker: Faker, locale: PersonLocale, options: PersonOptions): Person {
  const sex =
    options.sex === 'any' ? (faker.person.sexType() === 'male' ? 'male' : 'female') : options.sex
  const { minAge, maxAge } = clampAges(options.minAge, options.maxAge)
  return {
    sex,
    birthDate: dateOnly(faker.date.birthdate({ mode: 'age', min: minAge, max: maxAge })),
    firstName: faker.person.firstName(sex),
    lastName: faker.person.lastName(sex),
    street: faker.location.streetAddress(),
    postalCode: faker.location.zipCode(),
    city: faker.location.city(),
    region: locale.region ? faker.location.state() : '',
    country: locale.name,
  }
}

/**
 * Loads the names and addresses of a country and returns a generator of people from it.
 * Rejects when the country is not supported.
 */
export async function loadPersonGenerator(
  countryCode: string
): Promise<(options?: PersonOptions) => Person> {
  const locale = getPersonLocale(countryCode)
  if (!locale) throw new Error(`No names and addresses for ${countryCode}`)
  const { faker } = await locale.load()
  return (options = DEFAULT_PERSON_OPTIONS) => generatePerson(faker, locale, options)
}

/** A birth date as yyyy-mm-dd. */
export function formatBirthDate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

/** Age in whole years on `today`. */
export function ageOn(birthDate: Date, today = new Date()): number {
  const years = today.getUTCFullYear() - birthDate.getUTCFullYear()
  const hadBirthday =
    today.getUTCMonth() > birthDate.getUTCMonth() ||
    (today.getUTCMonth() === birthDate.getUTCMonth() &&
      today.getUTCDate() >= birthDate.getUTCDate())
  return hadBirthday ? years : years - 1
}
