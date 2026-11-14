import { randomInt } from '@/lib/random'
import type { PersonSeed } from './types'

const DAY = 24 * 60 * 60 * 1000
/**
 * Birth dates of standalone numbers: adults who are not yet 100, born after the systems that
 * changed format in 1954 (the Czech and Slovak birth numbers) did so.
 */
const FIRST_BIRTH_DATE = Date.UTC(1955, 0, 1)
const LAST_BIRTH_DATE = Date.UTC(2005, 11, 31)

/** A random person for numbers generated on their own, outside a generated person's row. */
export function randomPersonSeed(): PersonSeed {
  const days = Math.floor((LAST_BIRTH_DATE - FIRST_BIRTH_DATE) / DAY) + 1
  return {
    birthDate: new Date(FIRST_BIRTH_DATE + randomInt(days) * DAY),
    sex: randomInt(2) === 0 ? 'female' : 'male',
  }
}

/** The parts of a birth date, in UTC, as numbers encode them. */
export function dateParts(date: Date) {
  const year = date.getUTCFullYear()
  return {
    year,
    /** Two-digit year. */
    yy: year % 100,
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  }
}

/** True when the year, month (1 to 12) and day form a date that exists. */
export function isDate(year: number, month: number, day: number): boolean {
  const date = new Date(Date.UTC(year, month - 1, day))
  // `Date.UTC` maps the years 0 to 99 to 1900 to 1999.
  if (year >= 0 && year < 100) date.setUTCFullYear(year)
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  )
}

/** A random odd (male) or even (female) number in [min, max], as many numbers encode the sex. */
export function randomWithParity(min: number, max: number, odd: boolean): number {
  for (;;) {
    const value = min + randomInt(max - min + 1)
    if ((value % 2 === 1) === odd) return value
  }
}
