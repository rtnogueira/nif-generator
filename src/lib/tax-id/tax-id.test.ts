import { describe, expect, it } from 'vitest'
import { generateNif, MAX_QUANTITY } from '@/lib/nif'
import { validateVatNumber, VAT_COUNTRIES } from '@/lib/vat'
import {
  checkPosition,
  displayTaxId,
  generateTaxIds,
  getTaxIdCountry,
  getTaxIdCountryName,
  getTaxIdType,
  isTaxIdCountryCode,
  isViesCountry,
  TAX_ID_COUNTRIES,
  taxIdGenerator,
  validateTaxNumber,
  VALIDITIES,
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
  // Outside VIES, from tests/test_<country>_<number>.doctest (CPF: the stdnum.br.cpf docstring;
  // CA: the 9-digit BN part of real program accounts).
  AR: ['20101234569', '20040356437', '20047433747'],
  AU: ['11574456001', '12123552732', '112474082', '459599230', '000024733', '001002731'],
  BR: ['07195358000166', '08807432000110', '11015248000142', '39053344705'],
  CA: ['000089987', '100007780', '100026723'],
  CH: ['CHE113042942', 'CHE101415551', 'CHE105067880'],
  CL: ['10626628-K', '10075381-2', '10219183-8'],
  CO: ['1118534248-0', '15252525-0', '17343020-1'],
  JP: ['1020281079130', '1092280840134', '1878613755182'],
  NO: ['965920358', '980430596', '998772680'],
  NZ: ['047179025', '136410132', '35901981'],
  PE: ['10000655959', '10010734121', '10040578108'],
  TR: ['0010213576', '0010441520', '10010405214', '10036951702'],
  UY: ['020164180014', '020334150013', '040003080012'],
  ZA: ['0001339050', '0843089848'],
}

/** Position of the check character of a real number, from the type it belongs to. */
function checkIndex(code: string, number: string) {
  const type = getTaxIdCountry(code as never).types.find(t => t.isValid(number))
  if (!type) throw new Error(`${number} is not a valid ${code} number`)
  return checkPosition(type, number)
}

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
  it('covers every VIES country', () => {
    const codes = countries.map(c => c.code)
    for (const { code } of VAT_COUNTRIES) expect(codes, code).toContain(code)
  })

  it('names every country outside VIES', () => {
    for (const country of countries) {
      if (!isViesCountry(country.code)) expect(country.name, country.code).toBeTruthy()
    }
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
    expect(getTaxIdCountryName('BR')).toBe('Brazil')
    expect(isViesCountry('BR')).toBe(false)
    expect(isViesCountry('XI')).toBe(true)
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
      const index = checkIndex(country.code, number)
      const mutated = mutate(number, index)
      expect(isValidFor(country, mutated), mutated).toBe(false)
    }
  })

  it.each(country.types)('generates valid $name numbers ($id)', type => {
    for (let i = 0; i < 300; i++) {
      const number = type.generate()
      expect(type.isValid(number), number).toBe(true)
      expect(number, number).toMatch(type.pattern)
      expect(validateTaxNumber(number, country.code), number).toMatchObject({
        status: 'valid',
        verified: true,
      })
      if (isViesCountry(country.code)) {
        // The site's own validator must agree, with and without the country prefix.
        expect(validateVatNumber(country.code + number).status, number).toBe('valid')
        expect(validateVatNumber(number, country.code).status, number).toBe('valid')
      }
    }
  })
})

describe('validateTaxNumber', () => {
  it.each(countries)('verifies real $code numbers and rejects a wrong check character', country => {
    const vies = isViesCountry(country.code)
    for (const number of REAL_NUMBERS[country.code]) {
      const valid = { status: 'valid', verified: true }
      expect(validateTaxNumber(number, country.code), number).toMatchObject(valid)
      if (vies) expect(validateTaxNumber(country.code + number), number).toMatchObject(valid)

      const mutated = mutate(number, checkIndex(country.code, number))
      expect(validateTaxNumber(mutated, country.code).status, mutated).not.toBe('valid')
    }
  })

  it('reports a wrong check digit, naming the kind of number', () => {
    expect(validateTaxNumber('DE113866164')).toMatchObject({
      status: 'invalid-check-digit',
      number: '113866164',
      types: [{ name: 'USt-IdNr.' }],
    })
    expect(validateTaxNumber('PT123456788').status).toBe('invalid-check-digit')
  })

  it('checks only the format of kinds of number without a known algorithm', () => {
    for (const input of [
      'CZ1234567890',
      'IE1234567AB',
      'LV01234567890',
      'GBGD001',
      'BG1234567890',
    ]) {
      expect(validateTaxNumber(input), input).toMatchObject({ status: 'valid', verified: false })
    }
  })

  it('names the matching type, the most specific one for Portugal', () => {
    expect(validateTaxNumber('ESX5253868R')).toMatchObject({ type: { name: 'NIE' } })
    expect(validateTaxNumber('PT501964843')).toMatchObject({ type: { badge: '5' } })
    const nif = generateNif('38')
    expect(validateTaxNumber(nif, 'PT')).toMatchObject({ type: { badge: '38' } })
  })

  it('lists every accepted format outside VIES', () => {
    for (const country of countries) {
      if (isViesCountry(country.code)) continue
      for (const type of country.types) {
        expect(type.notations?.length, `${country.code} ${type.id}`).toBeGreaterThan(0)
        // Each notation (not a description in words) must have the type's shape.
        for (const notation of type.notations ?? []) {
          if (notation.includes(' ')) continue
          const sample = notation.replace(/9/g, '1').replace(/X/g, 'K')
          expect(sample, `${country.code} ${notation}`).toMatch(type.pattern)
        }
      }
    }
  })

  it('accepts the usual ways of writing numbers outside VIES', () => {
    const valid = { status: 'valid', verified: true }
    expect(validateTaxNumber('390.533.447-05', 'BR')).toMatchObject(valid)
    expect(validateTaxNumber('10626628k', 'CL')).toMatchObject(valid)
    expect(validateTaxNumber('15.252.525-0', 'CO')).toMatchObject(valid)
    expect(validateTaxNumber('NO 965 920 358 MVA', 'NO')).toMatchObject(valid)
    expect(validateTaxNumber('113.042.942', 'CH')).toMatchObject(valid)
    // Swiss UIDs are recognised by their CHE prefix, with or without a VAT suffix.
    expect(validateTaxNumber('CHE-113.042.942 MWST')).toMatchObject({
      ...valid,
      country: { code: 'CH' },
    })
  })

  it('reports a wrong format with the national part only', () => {
    expect(validateTaxNumber('DE12345678')).toMatchObject({
      status: 'invalid-format',
      number: '12345678',
    })
    expect(validateTaxNumber('1234', 'BR').status).toBe('invalid-format')
  })

  it('reports empty input and unsupported prefixes', () => {
    expect(validateTaxNumber(' ').status).toBe('empty')
    for (const input of ['123456789', 'US123456789', 'BR39053344705']) {
      expect(validateTaxNumber(input).status, input).toBe('unknown-country')
    }
  })
})

describe('formatted numbers', () => {
  it('match the examples of python-stdnum', () => {
    const format = (code: string, id: string, number: string) =>
      getTaxIdType(code as never, id)?.format?.(number)
    expect(format('BR', 'cpf', '39053344705')).toBe('390.533.447-05')
    expect(format('BR', 'cnpj', '16727230000197')).toBe('16.727.230/0001-97')
    expect(format('AU', 'abn', '51824753556')).toBe('51 824 753 556')
    expect(format('CH', 'uid', 'CHE113042942')).toBe('CHE-113.042.942')
    expect(format('CL', 'rut', '76086428-5')).toBe('76.086.428-5')
    expect(format('CO', 'nit', '213123432-1')).toBe('213.123.432-1')
    expect(format('NZ', 'ird', '49091850')).toBe('49-091-850')
    expect(format('UY', 'rut', '211003420017')).toBe('21-100342-001-7')
    expect(format('GB', 'vat', '980780684')).toBe('980 7806 84')
    expect(format('PL', 'vat', '1234563218')).toBe('123-456-32-18')
  })

  it.each(countries)('are accepted by the validator ($code)', country => {
    for (const type of country.types.filter(t => t.format)) {
      for (let i = 0; i < 50; i++) {
        const number = type.generate()
        for (const withPrefix of [false, true]) {
          const shown = displayTaxId(country.code, type, number, {
            validity: 'valid',
            formatted: true,
            withPrefix,
          })
          expect(validateTaxNumber(shown, country.code), shown).toMatchObject({
            status: 'valid',
            verified: true,
          })
        }
      }
    }
  })
})

describe('invalid numbers', () => {
  const EXPECTED = {
    'invalid-check-digit': 'invalid-check-digit',
    'invalid-length': 'invalid-format',
  }

  it.each(countries)('are generated for every $code type and invalid kind', country => {
    for (const type of country.types) {
      for (const validity of VALIDITIES.filter(v => v !== 'valid')) {
        const numbers = generateTaxIds(
          type,
          MAX_QUANTITY,
          taxIdGenerator(country.code, type, validity)
        )
        expect(new Set(numbers).size, `${type.id} ${validity}`).toBe(MAX_QUANTITY)
        for (const number of numbers) {
          expect(validateTaxNumber(number, country.code).status, number).toBe(EXPECTED[validity])
        }
      }
    }
  })

  it.each(countries)('are still rejected as shown, formatted and prefixed ($code)', country => {
    for (const type of country.types) {
      const generate = taxIdGenerator(country.code, type, 'invalid-check-digit')
      for (let i = 0; i < 20; i++) {
        const shown = displayTaxId(country.code, type, generate(), {
          validity: 'invalid-check-digit',
          formatted: true,
          withPrefix: true,
        })
        expect(validateTaxNumber(shown, country.code).status, shown).toBe('invalid-check-digit')
      }
    }
  })

  it('keep the format when only the check digit is wrong', () => {
    const type = getTaxIdType('BR', 'cpf')
    if (!type) throw new Error('missing type')
    const [number] = generateTaxIds(type, 1, taxIdGenerator('BR', type, 'invalid-check-digit'))
    expect(number).toMatch(/^\d{11}$/)
    expect(
      displayTaxId('BR', type, number, {
        validity: 'invalid-check-digit',
        formatted: true,
        withPrefix: false,
      })
    ).toMatch(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/)
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
