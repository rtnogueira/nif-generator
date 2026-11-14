import { describe, expect, it } from 'vitest'
import { generateNumbers } from '@/lib/numbers/family'
import { dateParts } from '@/lib/numbers/person'
import { MAX_QUANTITY } from '@/lib/numbers/quantity'
import type { PersonSeed } from '@/lib/numbers/types'
import { checkPosition, displayNumber, numberGenerator, VALIDITIES } from '@/lib/numbers/variants'
import { IDENTITY_COUNTRIES, IDENTITY_FAMILY } from '.'

/**
 * Numbers from python-stdnum's module documentation and test suite (tests/test_<country>_<number>
 * .doctest), where they were collected from public sources, written as found.
 */
const REAL_NUMBERS: Record<string, string[]> = {
  'BE nn': ['85 07 30 033 28', '17 07 30 033 84'],
  'BE eid': ['000-0011032-71', '591-1917064-58', '591-2010999-97'],
  'BR cpf': ['390.533.447-05'],
  'BG egn': ['7523169263', '8032056031', '7542011030', '7501020018', '0010100100'],
  'BG pnf': ['7111 042 925'],
  'HR oib': ['33392005961'],
  'CZ rc': ['710319/2745', '8801251680'],
  'EE ik': ['36805280109', '36205030034', '36606130166', '38002090113'],
  'FI hetu': ['131052-308T'],
  'IS kennitala': ['120174-3399', '020884-2749', '2607565169'],
  'IN aadhaar': ['234123412346'],
  'IN vid': ['2341234123412341'],
  'IL idnr': ['3933742-3'],
  'JP mynumber': ['6214 9832 0257'],
  'LT asmens': ['33309240064', '35002125431', '48504140959', '61205010081'],
  'NO fnr': ['151086 95088', '100487 45526', '10048744732', '10048745364'],
  'PE cui': ['10117410-2', '05209244-8', '05337812-4', '06009893-5'],
  'PL pesel': ['44051401359'],
  'PT cc': ['00000000 0 ZZ4', '04521224 4 ZZ 7', '054546796ZY7', '101490801ZY0'],
  'SK rc': ['710319/2745'],
  'ZA idnr': ['7503305044089', '5306060050180', '6107165087088', '6302285896084'],
  'KR rrn': ['971013-9019902', '880411-2238459', '760406-1679592', '861121-1967921'],
  'ES dni': ['54362315K'],
  'ES nie': ['X5253868R'],
  'SE personnummer': ['880320-0016', '670919-9530', '811228-9874', '8803200073'],
  'TH pin': ['3100600445635', '1 1101 00152 64 1', '1-1002-00439-84-4', '1100900359657'],
  'TR tckn': ['10010405214'],
}

const TYPES = IDENTITY_COUNTRIES.flatMap(country =>
  country.types.map(type => ({ key: `${country.code} ${type.id}`, country, type }))
)
const validate = IDENTITY_FAMILY.validate

/** Changes one character to a different one of the same kind (digit → digit, letter → letter). */
function mutate(number: string, index: number): string {
  const char = number[index]
  const next = /\d/.test(char)
    ? String((Number(char) + 1) % 10)
    : String.fromCharCode(((char.charCodeAt(0) - 64) % 26) + 65)
  return number.slice(0, index) + next + number.slice(index + 1)
}

describe('identity number countries', () => {
  it('has real numbers to test every kind of number against', () => {
    expect(Object.keys(REAL_NUMBERS).sort()).toEqual(TYPES.map(t => t.key).sort())
  })

  it('cites the python-stdnum module of every algorithm', () => {
    for (const { key, type } of TYPES)
      expect(type.source?.stdnum, key).toMatch(/^stdnum\.\w+\.\w+$/)
  })

  it('has unique type ids within each country and a format to show', () => {
    for (const country of IDENTITY_COUNTRIES) {
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
  const encoding = TYPES.filter(({ type }) => type.encodes)

  it('are the ones python-stdnum reads a birth date from', () => {
    expect(encoding.map(t => t.key)).toEqual([
      'BE nn',
      'BG egn',
      'CZ rc',
      'EE ik',
      'FI hetu',
      'IS kennitala',
      'LT asmens',
      'NO fnr',
      'PL pesel',
      'SK rc',
      'ZA idnr',
      'KR rrn',
      'SE personnummer',
    ])
  })

  it.each(encoding)('$key holds the birth date of the person', ({ country, type }) => {
    for (const person of PEOPLE) {
      const { yy, month, day } = dateParts(person.birthDate)
      const two = (value: number) => String(value).padStart(2, '0')
      for (let i = 0; i < 25; i++) {
        const number = type.generate(person)
        expect(validate(number, country.code).status, number).toBe('valid')
        const digits = number.replace(/\D/g, '')
        // Day, month and year in either order; the month may carry a century or sex offset.
        const dayFirst = ['FI', 'IS', 'NO'].includes(country.code)
        const start = ['EE', 'LT'].includes(country.code) ? 1 : 0
        const [a, b, c] = [0, 2, 4].map(at => digits.slice(start + at, start + at + 2))
        expect(dayFirst ? c : a, number).toBe(two(yy))
        // Czech and Slovak women have 50 added to the month; other offsets are multiples of 20.
        const offset = ['CZ', 'SK'].includes(country.code) ? 50 : 20
        expect(Number(b) % offset, number).toBe(month)
        expect(dayFirst ? a : c, number).toBe(two(day))
      }
    }
  })

  it('give men and women the digits python-stdnum reads their sex from', () => {
    const sexOf: Record<string, (number: string) => boolean> = {
      'BE nn': n => Number(n.slice(6, 9)) % 2 === 1,
      'CZ rc': n => Number(n.slice(2, 4)) < 50,
      'SK rc': n => Number(n.slice(2, 4)) < 50,
      'EE ik': n => Number(n[0]) % 2 === 1,
      'LT asmens': n => Number(n[0]) % 2 === 1,
      'NO fnr': n => Number(n[8]) % 2 === 1,
      'PL pesel': n => Number(n[9]) % 2 === 1,
      'ZA idnr': n => Number(n[6]) >= 5,
      'KR rrn': n => Number(n[6]) % 2 === 1,
      'SE personnummer': n => Number(n.at(-2)) % 2 === 1,
    }
    expect(Object.keys(sexOf).sort()).toEqual(
      encoding
        .filter(({ type }) => type.encodes?.includes('sex'))
        .map(t => t.key)
        .sort()
    )
    for (const { key, type } of encoding) {
      for (const person of PEOPLE) {
        const isMale = sexOf[key]
        if (isMale) expect(isMale(type.generate(person)), key).toBe(person.sex === 'male')
      }
    }
  })
})
