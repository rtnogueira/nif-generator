import { describe, expect, it } from 'vitest'
import { MAX_QUANTITY } from '@/lib/nif'
import { validateVatNumber, VAT_COUNTRIES } from '@/lib/vat'
import {
  generateTaxIds,
  getTaxIdCountry,
  getTaxIdCountryName,
  getTaxIdType,
  isTaxIdCountryCode,
  TAX_ID_COUNTRIES,
  type TaxIdCountry,
} from '.'
import {
  luhnCheckDigit,
  luhnChecksum,
  mod,
  mod11_10CheckDigit,
  mod11_10Checksum,
} from './checksums'

/**
 * Real, registered VAT numbers (national part only), taken from python-stdnum's test suite
 * (tests/test_eu_vat.doctest, tests/test_gb_vat.doctest and the stdnum.hr.oib docstring), where
 * they were collected from public sources. They prove the algorithms against reality rather than
 * against themselves.
 */
const REAL_NUMBERS: Record<string, string[]> = {
  AT: ['U14243102', 'U15159209', 'U28560205'],
  BE: ['0468561072', '0202239951', '0220764971'],
  BG: ['103873594', '124551319', '130358310'],
  HR: ['33392005961'],
  CY: ['10246672X', '10263870R', '10274231F'],
  CZ: ['25123891', '25577581', '26852357'],
  DK: ['10503280', '11975658', '12144822'],
  EE: ['100931558', '100523487', '100572933'],
  FI: ['02459042', '09826511', '10320534'],
  FR: ['04409414364', '09434086930', '11424872836'],
  DE: ['113866163', '231969187', '265265318'],
  EL: ['039868210', '044824428', '072130053'],
  HU: ['12509403', '10672101', '10766172'],
  IE: ['0005306C', '4550159S', '4693875V'],
  IT: ['01404480202', '00618280499', '00595000217'],
  LV: ['40003521600', '40003189718', '40003282138'],
  LT: ['119511515', '235449811', '250266219'],
  LU: ['10059929', '10590281', '10967628'],
  MT: ['10396417', '11679112', '14658213'],
  NL: ['001241643B01', '009122746B01', '806753742B01'],
  PL: ['5211355116', '5211754253', '5220205853'],
  PT: ['500019720', '500135495', '501507930'],
  RO: ['11358544', '13837330', '14840784'],
  SK: ['1078449064', '2022749619', '2020237945'],
  SI: ['26808498', '29664373', '36097152'],
  ES: ['54362315K', 'X5253868R', 'X5277343Q', 'A28184661', 'A60631835'],
  SE: ['202100500001', '390806051401', '556200077701'],
  XI: ['432525179'],
  // 100190874 uses the newer "restarting" checksum (remainder 42 or 55).
  GB: ['002425728', '003232345', '100190874', '980780684'],
}

/** Position of the (first) check character, where it is not the last one. */
const CHECK_INDEX: Record<string, number> = { FR: 1, NL: 8, SE: 9 }

/** Changes one character to a different one of the same kind (digit → digit, letter → letter). */
function mutate(number: string, index: number): string {
  const char = number[index]
  const next = /\d/.test(char)
    ? String((Number(char) + 1) % 10)
    : String.fromCharCode(((char.charCodeAt(0) - 64) % 26) + 65)
  return number.slice(0, index) + next + number.slice(index + 1)
}

const countries = TAX_ID_COUNTRIES as readonly TaxIdCountry[]
const isValidFor = (country: TaxIdCountry, number: string) =>
  country.types.some(type => type.isValid(number))

describe('tax number countries', () => {
  it('covers every VIES country, and only those', () => {
    expect(countries.map(c => c.code).sort()).toEqual(VAT_COUNTRIES.map(c => c.code).sort())
  })

  it('has real numbers to test every country against', () => {
    expect(Object.keys(REAL_NUMBERS).sort()).toEqual(countries.map(c => c.code).sort())
  })

  it('has unique type ids within each country', () => {
    for (const country of countries) {
      const ids = country.types.map(type => type.id)
      expect(new Set(ids).size, country.code).toBe(ids.length)
    }
  })

  it('resolves country codes and types', () => {
    expect(isTaxIdCountryCode('DE')).toBe(true)
    expect(isTaxIdCountryCode('US')).toBe(false)
    expect(getTaxIdCountryName('EL')).toBe('Greece')
    expect(getTaxIdType('ES', 'nie')?.name).toBe('NIE')
    expect(getTaxIdType('ES', 'nope')).toBeUndefined()
  })
})

describe.each(countries)('$code', country => {
  it('accepts real registered numbers', () => {
    for (const number of REAL_NUMBERS[country.code]) {
      expect(isValidFor(country, number), number).toBe(true)
    }
  })

  it('rejects real numbers with a wrong check character', () => {
    for (const number of REAL_NUMBERS[country.code]) {
      const index = CHECK_INDEX[country.code] ?? number.length - 1
      const mutated = mutate(number, index)
      expect(isValidFor(country, mutated), mutated).toBe(false)
    }
  })

  it.each(country.types)('generates valid $name numbers ($id)', type => {
    for (let i = 0; i < 300; i++) {
      const number = type.generate()
      expect(type.isValid(number), number).toBe(true)
      // The site's own validator must agree, with and without the country prefix.
      expect(validateVatNumber(country.code + number).status, number).toBe('valid')
      expect(validateVatNumber(number, country.code).status, number).toBe('valid')
    }
  })
})

describe('generateTaxIds', () => {
  it('returns the requested number of distinct numbers for every type', () => {
    for (const country of countries) {
      for (const type of country.types) {
        const numbers = generateTaxIds(type, MAX_QUANTITY)
        expect(numbers, `${country.code} ${type.id}`).toHaveLength(MAX_QUANTITY)
        expect(new Set(numbers).size).toBe(MAX_QUANTITY)
      }
    }
  })

  it('clamps the quantity to the supported range', () => {
    const [type] = getTaxIdCountry('DE').types
    expect(generateTaxIds(type, 0)).toHaveLength(1)
    expect(generateTaxIds(type, 500)).toHaveLength(MAX_QUANTITY)
  })
})

describe('checksums', () => {
  it('computes a Python-style modulo', () => {
    expect(mod(-3, 11)).toBe(8)
    expect(mod(14, 11)).toBe(3)
  })

  it('computes Luhn check digits', () => {
    // The worked example of the Luhn algorithm on Wikipedia.
    expect(luhnCheckDigit('7992739871')).toBe('3')
    expect(luhnChecksum('79927398713')).toBe(0)
  })

  it('computes ISO 7064 Mod 11, 10 check digits', () => {
    // Examples from the stdnum.iso7064.mod_11_10 docstring.
    expect(mod11_10CheckDigit('79462')).toBe('3')
    expect(mod11_10Checksum('794623')).toBe(1)
    expect(mod11_10CheckDigit('00200667308')).toBe('5')
  })
})
