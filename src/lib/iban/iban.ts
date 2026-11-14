/**
 * IBAN generator and validator.
 *
 * An IBAN is valid when its country is in the IBAN registry, its BBAN (everything after the first
 * four characters) has that country's structure, and its two check digits pass ISO 7064 Mod 97-10.
 * This is a port of python-stdnum's `stdnum.iban`; the sample IBANs of the registry and the real
 * ones collected in that project's tests are in `iban.fixtures.ts`.
 *
 * Five countries also have check digits inside the BBAN, which are verified and computed here:
 * Belgium, Spain, Montenegro and Norway as python-stdnum does, and Portugal as Banco de Portugal
 * specifies. For every other country only the structure and the IBAN check digits are checked:
 * bank codes are random, and national keys (such as the French clé RIB or the Italian CIN) are
 * not computed.
 */
import { luhnChecksum, mod97, pad2 } from '@/lib/numbers/checksums'
import { createFamily } from '@/lib/numbers/family'
import { rejectionSampler } from '@/lib/numbers/helpers'
import type { NumberSource, NumberType } from '@/lib/numbers/types'
import { randomChar, randomDigits } from '@/lib/random'
import { BE_BANK_CODE_RANGES } from './be-banks'
import { IBAN_REGISTRY, type IbanCountry } from './registry'

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ALPHANUMERIC = '0123456789' + UPPER

/** How each registry character class is matched, written in a notation, and generated. */
const CHARACTER_CLASSES = {
  n: { pattern: '[0-9]', notation: '9', random: (length: number) => randomDigits(length) },
  a: { pattern: '[A-Z]', notation: 'A', random: (length: number) => randomChars(UPPER, length) },
  c: {
    pattern: '[A-Z0-9]',
    notation: 'C',
    random: (length: number) => randomChars(ALPHANUMERIC, length),
  },
} as const

function randomChars(chars: string, length: number): string {
  let result = ''
  for (let i = 0; i < length; i++) result += randomChar(chars)
  return result
}

/** The parts of a registry structure such as `4!n4!n11!n2!n`. */
function parseStructure(structure: string) {
  return [...structure.matchAll(/(\d+)!([nac])/g)].map(([, length, kind]) => ({
    length: Number(length),
    ...CHARACTER_CLASSES[kind as keyof typeof CHARACTER_CLASSES],
  }))
}

/** The two check digits that make `countryCode` + digits + `bban` a valid IBAN. */
export function ibanCheckDigits(countryCode: string, bban: string): string {
  return pad2(98 - mod97(bban + countryCode + '00'))
}

/** True when the IBAN's check digits pass ISO 7064 Mod 97-10. */
function hasValidCheckDigits(iban: string): boolean {
  return mod97(iban.slice(4) + iban.slice(0, 4)) === 1
}

/** Check digits inside a country's BBAN. */
interface NationalCheck {
  /** Added to the description of the algorithm. */
  algorithm: string
  source: NumberSource
  isValid: (bban: string) => boolean
  /** `bban` (random, of the right structure) with its check digits set; '' to draw another. */
  complete: (bban: string) => string
}

const STDNUM_IBAN = 'stdnum.iban'

// --- Belgium (stdnum.be.iban) --------------------------------------------------------------------
const beCheck = (body: string) => pad2(mod97(body) || 97)
const isBelgianBank = (code: number) =>
  BE_BANK_CODE_RANGES.some(([from, to]) => code >= from && code <= to)

// --- Spain (stdnum.es.ccc) -----------------------------------------------------------------------
function cccCheckDigit(digits: string): string {
  const check = [...digits].reduce((sum, digit, i) => sum + Number(digit) * 2 ** i, 0) % 11
  return String(check < 2 ? check : 11 - check)
}
const cccChecks = (bban: string) =>
  cccCheckDigit('00' + bban.slice(0, 8)) + cccCheckDigit(bban.slice(10))

// --- Norway (stdnum.no.kontonr) ------------------------------------------------------------------
const kontonrCheck = (account: string) =>
  String(
    [6, 7, 8, 9, 4, 5, 6, 7, 8, 9].reduce(
      (sum, weight, i) => sum + weight * Number(account[i]),
      0
    ) % 11
  )
/** An 11-digit account, or a 7-digit postgiro account behind the bank code 0000 (Luhn). */
const isValidKontonr = (bban: string) =>
  bban.startsWith('0000') ? luhnChecksum(bban.slice(4)) === 0 : kontonrCheck(bban) === bban[10]

// --- Portugal (Banco de Portugal) ----------------------------------------------------------------
/** The two NIB check digits: ISO 7064 Mod 97-10 over the first 19 digits. */
const nibCheck = (body: string) => pad2(98 - mod97(body + '00'))

const NATIONAL_CHECKS: Partial<Record<string, NationalCheck>> = {
  BE: {
    algorithm:
      'the last two digits are the first ten modulo 97 (97 instead of 00), and the bank code is one the National Bank of Belgium has assigned',
    source: { stdnum: 'stdnum.be.iban' },
    isValid: bban =>
      bban.slice(10) === beCheck(bban.slice(0, 10)) && isBelgianBank(Number(bban.slice(0, 3))),
    complete: bban =>
      isBelgianBank(Number(bban.slice(0, 3))) ? bban.slice(0, 10) + beCheck(bban.slice(0, 10)) : '',
  },
  ES: {
    algorithm: 'two modulo 11 check digits of the account number (CCC)',
    source: { stdnum: 'stdnum.es.ccc' },
    isValid: bban => bban.slice(8, 10) === cccChecks(bban),
    complete: bban => bban.slice(0, 8) + cccChecks(bban) + bban.slice(10),
  },
  ME: {
    algorithm: 'the account number modulo 97 is 1',
    source: { stdnum: 'stdnum.me.iban' },
    isValid: bban => mod97(bban) === 1,
    complete: bban => bban.slice(0, 16) + pad2(98 - mod97(bban.slice(0, 16) + '00')),
  },
  NO: {
    algorithm: 'modulo 11 check digit of the account number',
    source: { stdnum: 'stdnum.no.kontonr' },
    isValid: isValidKontonr,
    complete: bban => {
      // Bank code 0000 is the postgiro, with a different account number: not generated.
      const check = kontonrCheck(bban)
      return bban.startsWith('0000') || check.length > 1 ? '' : bban.slice(0, 10) + check
    },
  },
  PT: {
    algorithm: 'two modulo 97 check digits of the NIB, which make the IBAN check digits 50',
    source: {
      stdnum: STDNUM_IBAN,
      document: {
        title:
          'Banco de Portugal, International Bank Account Number – IBAN: especificações e procedimentos de validação',
        url: 'https://www.bportugal.pt/sites/default/files/anexos/documentos-relacionados/international_bank_account_number_pt.pdf',
      },
    },
    isValid: bban => bban.slice(19) === nibCheck(bban.slice(0, 19)),
    complete: bban => bban.slice(0, 19) + nibCheck(bban.slice(0, 19)),
  },
}

/** True for countries whose BBAN check digits are verified and computed. */
export const hasNationalCheck = (countryCode: string) => countryCode in NATIONAL_CHECKS

/** The IBAN in groups of four characters, as it is printed. */
export function formatIban(iban: string): string {
  return iban.replace(/(.{4})(?=.)/g, '$1 ')
}

function ibanType({ code, bban }: IbanCountry): NumberType {
  const parts = parseStructure(bban)
  const length = 4 + parts.reduce((sum, part) => sum + part.length, 0)
  const pattern = new RegExp(
    `^${code}\\d{2}${parts.map(part => `${part.pattern}{${part.length}}`).join('')}$`
  )
  const national = NATIONAL_CHECKS[code]
  const isValid = (iban: string) =>
    pattern.test(iban) && hasValidCheckDigits(iban) && (national?.isValid(iban.slice(4)) ?? true)

  return {
    id: 'iban',
    name: 'IBAN',
    badge: code,
    label: `IBAN (${length} characters)`,
    algorithm:
      'ISO 7064 Mod 97-10 over the whole IBAN' + (national ? `; ${national.algorithm}` : ''),
    pattern,
    notations: [`${code}99${parts.map(part => part.notation.repeat(part.length)).join('')}`],
    // The first of the two check digits, right after the country code.
    checkIndex: 2,
    format: formatIban,
    source: national?.source ?? { stdnum: STDNUM_IBAN },
    generate: rejectionSampler(() => {
      const random = parts.map(part => part.random(part.length)).join('')
      const account = national ? national.complete(random) : random
      return account && code + ibanCheckDigits(code, account) + account
    }, isValid),
    isValid,
  }
}

/** Every country of the IBAN registry, each with its IBAN as its only kind of number. */
export const IBAN_COUNTRIES = IBAN_REGISTRY.map(country => ({
  code: country.code,
  name: country.name,
  types: [ibanType(country)],
}))

export const IBAN_FAMILY = createFamily({
  id: 'iban',
  noun: 'IBAN',
  slug: 'ibans',
  countries: IBAN_COUNTRIES,
  defaultCountry: 'PT',
  // An IBAN starts with its country code.
  detectCountry: value => value.slice(0, 2),
})

/** True when `input` is a valid IBAN, however it is spaced. */
export function isValidIban(input: string): boolean {
  return IBAN_FAMILY.validate(input).status === 'valid'
}
