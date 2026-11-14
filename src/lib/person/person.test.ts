import { describe, expect, it } from 'vitest'
import {
  ageOn,
  clampAges,
  formatBirthDate,
  loadPersonGenerator,
  PERSON_LOCALES,
  type Person,
} from '.'

describe('person locales', () => {
  it('lists every country once, sorted by name', () => {
    const names = PERSON_LOCALES.map(locale => locale.name)
    expect(new Set(PERSON_LOCALES.map(locale => locale.code)).size).toBe(PERSON_LOCALES.length)
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  })

  it.each(PERSON_LOCALES)('generates people for $name', async locale => {
    const generate = await loadPersonGenerator(locale.code)
    for (let i = 0; i < 20; i++) {
      const person = generate()
      for (const key of ['firstName', 'lastName', 'street', 'postalCode', 'city'] as const) {
        expect(person[key], `${locale.code} ${key}`).toBeTruthy()
      }
      expect(person.country).toBe(locale.name)
      expect(Boolean(person.region)).toBe(locale.region)
      expect(['female', 'male']).toContain(person.sex)
    }
  })
})

describe('loadPersonGenerator', () => {
  it('rejects a country without names and addresses', async () => {
    await expect(loadPersonGenerator('XX')).rejects.toThrow()
  })

  it('keeps to the sex and age range asked for', async () => {
    const generate = await loadPersonGenerator('PT')
    const people: Person[] = Array.from({ length: 200 }, () =>
      generate({ sex: 'female', minAge: 30, maxAge: 31 })
    )
    for (const person of people) {
      expect(person.sex).toBe('female')
      expect([30, 31]).toContain(ageOn(person.birthDate))
      // A date only, at midnight UTC.
      expect(person.birthDate.toISOString()).toMatch(/T00:00:00\.000Z$/)
    }
  })

  it('writes Portuguese postal codes as 9999-999', async () => {
    const generate = await loadPersonGenerator('PT')
    expect(generate().postalCode).toMatch(/^\d{4}-\d{3}$/)
  })
})

describe('ages and dates', () => {
  it('computes the age in whole years', () => {
    const today = new Date(Date.UTC(2026, 10, 14))
    expect(ageOn(new Date(Date.UTC(2000, 10, 14)), today)).toBe(26)
    expect(ageOn(new Date(Date.UTC(2000, 10, 15)), today)).toBe(25)
    expect(formatBirthDate(new Date(Date.UTC(2000, 0, 5)))).toBe('2000-01-05')
  })

  it('keeps the age range within bounds and in order', () => {
    expect(clampAges(65, 18)).toEqual({ minAge: 18, maxAge: 65 })
    expect(clampAges(-5, 500)).toEqual({ minAge: 0, maxAge: 120 })
    expect(clampAges(Number.NaN, Number.NaN)).toEqual({ minAge: 18, maxAge: 65 })
  })
})
