import { describe, expect, it } from 'vitest'
import { normalizeVatNumber, validateVatNumber, viesNotationToRegExp } from './vat'
import { VAT_COUNTRIES, type VatCountry } from './vat-countries'

/** One number that matches each country's official structure, and one that does not. */
const CASES: Record<string, { valid: string[]; invalid: string[] }> = {
  AT: { valid: ['ATU12345678'], invalid: ['AT12345678', 'ATU1234567'] },
  BE: { valid: ['BE0123456789', 'BE1123456789'], invalid: ['BE2123456789', 'BE123456789'] },
  BG: { valid: ['BG123456789', 'BG1234567890'], invalid: ['BG12345678'] },
  HR: { valid: ['HR12345678901'], invalid: ['HR1234567890'] },
  CY: { valid: ['CY12345678L'], invalid: ['CY123456789'] },
  CZ: { valid: ['CZ12345678', 'CZ123456789', 'CZ1234567890'], invalid: ['CZ1234567'] },
  DK: { valid: ['DK12345678', 'DK 12 34 56 78'], invalid: ['DK123456789'] },
  EE: { valid: ['EE123456789'], invalid: ['EE12345678'] },
  FI: { valid: ['FI12345678'], invalid: ['FI1234567'] },
  FR: { valid: ['FR12345678901', 'FRAB123456789', 'FR 1A 123456789'], invalid: ['FR1234567890'] },
  DE: { valid: ['DE123456789'], invalid: ['DE12345678'] },
  EL: { valid: ['EL123456789'], invalid: ['EL12345678'] },
  HU: { valid: ['HU12345678'], invalid: ['HU123456789'] },
  IE: {
    valid: ['IE1234567A', 'IE1A23456B', 'IE1+23456B', 'IE1234567AB'],
    invalid: ['IE12345678', 'IE12345678A', 'IE1234567A1'],
  },
  IT: { valid: ['IT12345678901'], invalid: ['IT1234567890'] },
  LV: { valid: ['LV12345678901'], invalid: ['LV1234567890'] },
  LT: { valid: ['LT123456789', 'LT123456789012'], invalid: ['LT1234567890'] },
  LU: { valid: ['LU12345678'], invalid: ['LU123456789'] },
  MT: { valid: ['MT12345678'], invalid: ['MT1234567'] },
  NL: {
    valid: ['NL123456789B01', 'NL0+*ABC123B9Z'],
    invalid: ['NL123456789A01', 'NL123456789B0', 'NL123456789012', 'NL1234567B01'],
  },
  PL: { valid: ['PL1234567890'], invalid: ['PL123456789'] },
  PT: { valid: ['PT123456789', 'PT501964843'], invalid: ['PT12345678'] },
  RO: { valid: ['RO12', 'RO123456789', 'RO1234567890'], invalid: ['RO1', 'RO12345678901'] },
  SK: { valid: ['SK1234567890'], invalid: ['SK123456789'] },
  SI: { valid: ['SI12345678'], invalid: ['SI1234567'] },
  ES: {
    valid: ['ESX1234567L', 'ESA12345678', 'ES12345678Z'],
    invalid: ['ES123456789', 'ESA1234567'],
  },
  SE: { valid: ['SE123456789012'], invalid: ['SE12345678901'] },
  XI: {
    valid: ['XI123456789', 'XI 123 4567 89', 'XI123456789012', 'XIGD123', 'XIHA123'],
    invalid: ['XI12345678', 'XIGD1234', 'XIAB123'],
  },
  GB: {
    valid: ['GB123456789', 'GB123456789012', 'GBGD001', 'GBHA599'],
    invalid: ['GB1234567890', 'GBGDABC'],
  },
}

describe('viesNotationToRegExp', () => {
  it('translates the VIES legend and keeps other characters literal', () => {
    expect(viesNotationToRegExp('U99999999').source).toBe('^U\\d\\d\\d\\d\\d\\d\\d\\d$')
    expect(viesNotationToRegExp('XX 9').source).toBe('^[A-Z0-9][A-Z0-9]\\d$')
    expect(viesNotationToRegExp('9S99999L').test('1+23456A')).toBe(true)
    expect(viesNotationToRegExp('9S99999L').test('1-23456A')).toBe(false)
  })
})

describe('VAT countries', () => {
  it('has test cases for every country', () => {
    expect(Object.keys(CASES).sort()).toEqual(VAT_COUNTRIES.map(c => c.code).sort())
  })

  it('only overrides the VIES pattern when a note explains why', () => {
    for (const country of VAT_COUNTRIES as readonly VatCountry[]) {
      const refined = country.formats.some(format => 'pattern' in format)
      if (refined) expect(country.note, country.code).toBeTruthy()
    }
  })
})

describe('validateVatNumber', () => {
  for (const [code, { valid, invalid }] of Object.entries(CASES)) {
    it(`validates ${code} numbers`, () => {
      for (const input of valid) expect(validateVatNumber(input).status, input).toBe('valid')
      for (const input of invalid) expect(validateVatNumber(input).status, input).not.toBe('valid')
    })
  }

  it('checks the format only (check digits are verified in @/lib/tax-id)', () => {
    expect(validateVatNumber('PT123456788').status).toBe('valid')
  })

  it('accepts the number without prefix when the country is given', () => {
    expect(validateVatNumber('123456789', 'PT')).toMatchObject({
      status: 'valid',
      number: '123456789',
    })
    expect(validateVatNumber('U12345678', 'AT').status).toBe('valid')
    expect(validateVatNumber('pt 123 456 789', 'PT').status).toBe('valid')
  })

  it('validates against the chosen country, not the prefix in the input', () => {
    expect(validateVatNumber('DE123456789', 'PT').status).toBe('invalid-format')
  })

  it('never reuses the prefix letters as part of a truncated national number', () => {
    for (const input of ['FR123456789', 'NL1234567B01']) {
      expect(validateVatNumber(input).status, input).toBe('invalid-format')
      expect(validateVatNumber(input, input.slice(0, 2)).status, input).toBe('invalid-format')
    }
  })

  it('reports empty input and unsupported prefixes', () => {
    expect(validateVatNumber('   ').status).toBe('empty')
    expect(validateVatNumber('123456789').status).toBe('unknown-country')
    expect(validateVatNumber('GR123456789').status).toBe('unknown-country')
    expect(validateVatNumber('US123456789').status).toBe('unknown-country')
  })
})

describe('normalizeVatNumber', () => {
  it('uppercases and strips spaces, dots and dashes but keeps "+" and "*"', () => {
    expect(normalizeVatNumber(' be 0123.456-789 ')).toBe('BE0123456789')
    expect(normalizeVatNumber('nl0+*abc123b9z')).toBe('NL0+*ABC123B9Z')
  })
})
