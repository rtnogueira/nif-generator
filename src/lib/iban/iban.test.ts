import { describe, expect, it } from 'vitest'
import { generateNumbers } from '@/lib/numbers/family'
import { MAX_QUANTITY } from '@/lib/numbers/quantity'
import { displayNumber, numberGenerator, VALIDITIES } from '@/lib/numbers/variants'
import {
  formatIban,
  hasNationalCheck,
  IBAN_COUNTRIES,
  IBAN_FAMILY,
  IBAN_REGISTRY,
  ibanCheckDigits,
  isValidIban,
} from '.'
import {
  BROKEN_IBANS,
  VALID_IBANS,
  WRONG_CHARACTER_IBANS,
  WRONG_LENGTH_IBANS,
  WRONG_NATIONAL_CHECK_IBANS,
} from './iban.fixtures'

const validate = IBAN_FAMILY.validate

describe('IBAN registry', () => {
  it('lists every country once, with a structure', () => {
    expect(IBAN_REGISTRY).toHaveLength(89)
    expect(new Set(IBAN_REGISTRY.map(c => c.code)).size).toBe(89)
    for (const { code, bban } of IBAN_REGISTRY) {
      expect(code).toMatch(/^[A-Z]{2}$/)
      expect(bban, code).toMatch(/^(\d+![nac])+$/)
    }
  })

  it('cites the source of every algorithm', () => {
    for (const country of IBAN_COUNTRIES) {
      const [{ source }] = country.types
      expect(source?.stdnum ?? source?.document, country.code).toBeTruthy()
    }
  })
})

describe('validating IBANs', () => {
  it('accepts the sample IBANs of the registry and real ones, however they are written', () => {
    for (const iban of VALID_IBANS) {
      expect(validate(iban), iban).toMatchObject({ status: 'valid', verified: true })
    }
  })

  it('has a real or sample IBAN for most countries of the registry', () => {
    const covered = new Set(VALID_IBANS.map(iban => iban.replace(/\s/g, '').slice(0, 2)))
    expect(covered.size).toBeGreaterThanOrEqual(65)
  })

  it('rejects broken check digits and mangled numbers', () => {
    for (const iban of BROKEN_IBANS) expect(isValidIban(iban), iban).toBe(false)
  })

  it('rejects a wrong length, even with valid check digits', () => {
    for (const iban of WRONG_LENGTH_IBANS) {
      expect(validate(iban).status, iban).toBe('invalid-format')
    }
  })

  it('rejects characters of the wrong kind and unknown countries', () => {
    for (const iban of WRONG_CHARACTER_IBANS) expect(isValidIban(iban), iban).toBe(false)
    expect(validate('XX431234').status).toBe('unknown-country')
    expect(validate(' ').status).toBe('empty')
  })

  it('rejects a wrong national check, even with valid IBAN check digits', () => {
    for (const iban of WRONG_NATIONAL_CHECK_IBANS) {
      expect(validate(iban).status, iban).toBe('invalid-check-digit')
    }
    // python-stdnum's tests/test_be_iban.doctest: a Belgian account does not end in 00.
    expect(isValidIban('BE54310100270097')).toBe(true)
    expect(isValidIban('BE54310100270000')).toBe(false)
  })

  it('takes the country from the IBAN, or checks it against the chosen one', () => {
    expect(validate('pt50 0001 0000 1234 5678 9019 4')).toMatchObject({
      status: 'valid',
      country: { code: 'PT', name: 'Portugal' },
      number: 'PT50000100001234567890194',
    })
    expect(validate('PT50000100001234567890194', 'ES').status).toBe('invalid-format')
  })
})

describe('Portuguese IBANs', () => {
  // The examples of Banco de Portugal's IBAN specification.
  const EXAMPLES = ['PT50123443211234567890172', 'PT50 0001 0000 1234 5678 9019 4']

  it("accepts the examples of Banco de Portugal's specification", () => {
    for (const iban of EXAMPLES) expect(isValidIban(iban), iban).toBe(true)
  })

  it('rejects a wrong NIB check digit, even with valid IBAN check digits', () => {
    const bban = '000100001234567890195'
    const iban = 'PT' + ibanCheckDigits('PT', bban) + bban
    expect(validate(iban).status).toBe('invalid-check-digit')
  })

  it('always have the check digits 50, as Banco de Portugal specifies', () => {
    const [type] = IBAN_FAMILY.getCountry('PT')?.types ?? []
    for (let i = 0; i < 300; i++) expect(type.generate()).toMatch(/^PT50\d{21}$/)
  })
})

describe.each(IBAN_COUNTRIES)('$code IBANs', country => {
  const [type] = country.types

  it('are generated valid and distinct', () => {
    const numbers = generateNumbers(type, MAX_QUANTITY)
    expect(new Set(numbers).size).toBe(MAX_QUANTITY)
    for (let i = 0; i < 100; i++) {
      const iban = type.generate()
      expect(iban, iban).toMatch(type.pattern)
      expect(validate(iban), iban).toMatchObject({ status: 'valid', verified: true })
      expect(validate(formatIban(iban)).status, iban).toBe('valid')
    }
  })

  it('are generated invalid on request', () => {
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

  it('have a notation of the right shape', () => {
    const sample = (type.notations?.[0] ?? '').slice(2).replace(/9/g, '1').replace(/C/g, 'Z')
    expect(country.code + sample).toMatch(type.pattern)
  })
})

describe('national check digits', () => {
  it('are computed for Belgium, Spain, Montenegro, Norway and Portugal', () => {
    expect(IBAN_COUNTRIES.map(c => c.code).filter(hasNationalCheck)).toEqual([
      'BE',
      'ES',
      'ME',
      'NO',
      'PT',
    ])
  })
})

describe('formatIban', () => {
  it('writes the IBAN in groups of four', () => {
    expect(formatIban('PT50000100001234567890194')).toBe('PT50 0001 0000 1234 5678 9019 4')
    expect(formatIban('NO9386011117947')).toBe('NO93 8601 1117 947')
  })
})
