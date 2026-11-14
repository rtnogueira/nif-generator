import { describe, expect, it } from 'vitest'
import { generateNumbers } from '@/lib/numbers/family'
import { dateParts } from '@/lib/numbers/person'
import { MAX_QUANTITY } from '@/lib/numbers/quantity'
import type { PersonSeed } from '@/lib/numbers/types'
import { checkPosition, displayNumber, numberGenerator, VALIDITIES } from '@/lib/numbers/variants'
import { SOCIAL_SECURITY_COUNTRIES, SOCIAL_SECURITY_FAMILY } from '.'

/**
 * Numbers from python-stdnum's module documentation and test suite (tests/test_<country>_<number>
 * .doctest), where they were collected from public sources, written as found.
 */
const REAL_NUMBERS: Record<string, string[]> = {
  'AT vnr': ['1237 010180'],
  'BE ssn': ['85 07 30 033 28', '98 47 28 997 65', '17 07 30 033 84', '01 49 07 001 85'],
  'CA sin': ['123-456-782'],
  'FR nir': ['2 95 10 99 126 111 93', '253072B07300470', '253072A07300443'],
  'GR amka': ['01013099997', '01015734500', '01017902501', '01037200308', '01086004429'],
  'IE pps': ['6433435F', '6433435FT', '6433435FW', '6433435OA'],
  // The test number of the validators_pt module.
  'PT niss': ['11234567892'],
  'CH ahv': ['7569217076985', '756.9217.0769.85'],
  'GB nhs': ['943-476-5870'],
}

const TYPES = SOCIAL_SECURITY_COUNTRIES.flatMap(country =>
  country.types.map(type => ({ key: `${country.code} ${type.id}`, country, type }))
)
const validate = SOCIAL_SECURITY_FAMILY.validate

/** Changes one character to a different one of the same kind (digit → digit, letter → letter). */
function mutate(number: string, index: number): string {
  const char = number[index]
  const next = /\d/.test(char)
    ? String((Number(char) + 1) % 10)
    : String.fromCharCode(((char.charCodeAt(0) - 64) % 26) + 65)
  return number.slice(0, index) + next + number.slice(index + 1)
}

describe('social security number countries', () => {
  it('has real numbers to test every kind of number against', () => {
    expect(Object.keys(REAL_NUMBERS).sort()).toEqual(TYPES.map(t => t.key).sort())
  })

  it('cites the source of every algorithm: a python-stdnum module, except for the NISS', () => {
    for (const { key, type } of TYPES) {
      if (key === 'PT niss') expect(type.source?.document?.url).toMatch(/^https:/)
      else expect(type.source?.stdnum, key).toMatch(/^stdnum\.\w+\.\w+$/)
    }
  })

  it('has unique type ids within each country and a format to show', () => {
    for (const country of SOCIAL_SECURITY_COUNTRIES) {
      const ids = country.types.map(type => type.id)
      expect(new Set(ids).size, country.code).toBe(ids.length)
      for (const type of country.types) expect(type.notations?.length, country.code).toBeTruthy()
    }
  })
})

describe.each(TYPES)('$key', ({ key, country, type }) => {
  it('accepts real numbers, however they are written', () => {
    for (const number of REAL_NUMBERS[key]) {
      expect(validate(number, country.code), number).toMatchObject({
        status: 'valid',
        verified: true,
        type: { id: type.id },
      })
    }
  })

  it('rejects real numbers with a wrong check character', () => {
    for (const number of REAL_NUMBERS[key]) {
      const result = validate(number, country.code)
      if (result.status !== 'valid') throw new Error(`${number} is not valid`)
      const mutated = mutate(result.number, checkPosition(type, result.number))
      expect(type.isValid(mutated), mutated).toBe(false)
    }
  })

  it('generates valid, distinct numbers', () => {
    expect(new Set(generateNumbers(type, MAX_QUANTITY)).size).toBe(MAX_QUANTITY)
    for (let i = 0; i < 300; i++) {
      const number = type.generate()
      expect(number, number).toMatch(type.pattern)
      expect(validate(number, country.code), number).toMatchObject({ status: 'valid' })
      if (type.format) {
        expect(validate(type.format(number), country.code).status, number).toBe('valid')
      }
    }
  })

  it('generates invalid numbers on request', () => {
    const expected = {
      'invalid-check-digit': 'invalid-check-digit',
      'invalid-length': 'invalid-format',
    }
    for (const validity of VALIDITIES.filter(v => v !== 'valid')) {
      const generate = numberGenerator(validate, country.code, type, validity)
      for (let i = 0; i < 20; i++) {
        const shown = displayNumber(undefined, type, generate(), {
          validity,
          formatted: true,
          withPrefix: false,
        })
        expect(validate(shown, country.code).status, shown).toBe(expected[validity])
      }
    }
  })
})

describe('numbers that encode a person', () => {
  const PEOPLE: PersonSeed[] = [
    { birthDate: new Date(Date.UTC(1961, 1, 28)), sex: 'female' },
    { birthDate: new Date(Date.UTC(1985, 6, 30)), sex: 'male' },
    { birthDate: new Date(Date.UTC(2000, 1, 29)), sex: 'female' },
    { birthDate: new Date(Date.UTC(2005, 11, 31)), sex: 'male' },
  ]
  const two = (value: number) => String(value).padStart(2, '0')
  const type = (country: string) => {
    const [found] = SOCIAL_SECURITY_FAMILY.getCountry(country)?.types ?? []
    return found
  }

  it('are generated for the birth date and sex of the person', () => {
    for (const person of PEOPLE) {
      const { yy, month, day } = dateParts(person.birthDate)
      const male = person.sex === 'male'
      for (let i = 0; i < 25; i++) {
        // Austria: the birth date after the serial number and check digit.
        expect(type('AT').generate(person).slice(4)).toBe(two(day) + two(month) + two(yy))
        // Belgium: the birth date, then a counter that is odd for men.
        const insz = type('BE').generate(person)
        expect(insz.slice(0, 6)).toBe(two(yy) + two(month) + two(day))
        expect(Number(insz.slice(6, 9)) % 2 === 1).toBe(male)
        // France: the sex, then the year and month of birth.
        expect(type('FR').generate(person).slice(0, 5)).toBe(
          (male ? '1' : '2') + two(yy) + two(month)
        )
        // Greece: the birth date, and a tenth digit that is odd for men.
        const amka = type('GR').generate(person)
        expect(amka.slice(0, 6)).toBe(two(day) + two(month) + two(yy))
        expect(Number(amka[9]) % 2 === 1).toBe(male)
      }
    }
  })

  it('are the Austrian, Belgian, French and Greek numbers', () => {
    expect(TYPES.filter(t => t.type.encodes).map(t => t.country.code)).toEqual([
      'AT',
      'BE',
      'FR',
      'GR',
    ])
  })
})
