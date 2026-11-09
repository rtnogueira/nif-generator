/**
 * Tax number generators, one or more per country of the VIES table (see `@/lib/vat`).
 *
 * Every check-digit algorithm below is a line-by-line port of python-stdnum
 * (https://github.com/arthurdejong/python-stdnum), the module named in each comment, and is tested
 * against the real, registered VAT numbers collected in that project's test suite. A country is
 * only listed when its algorithm is verified that way. Where a country issues several kinds of VAT
 * number (e.g. legal entities and individuals), only the kind named in `label` is generated.
 *
 * Each `isValid` checks the national part of the number, without the country prefix.
 */
import { generateNif, isValidNif, NIF_TYPES } from '@/lib/nif'
import { randomChar, randomDigits, randomInt } from '@/lib/random'
import type { VatCountryCode } from '@/lib/vat'
import {
  isLuhnValid,
  isMod11_10Valid,
  luhnCheckDigit,
  luhnChecksum,
  mod,
  mod11_10CheckDigit,
  pad2,
  weightedSum,
} from './checksums'

export interface TaxIdType {
  /** Unique within its country. */
  id: string
  /** Short name of the number (e.g. "USt-IdNr."), used as the export column header. */
  name: string
  /** Short tag shown next to each generated number. */
  badge: string
  /** Who the number identifies / which kind is generated. */
  label: string
  /** Plain-language summary of the check-digit algorithm. */
  algorithm: string
  generate: () => string
  isValid: (number: string) => boolean
}

export interface TaxIdCountry {
  code: VatCountryCode
  types: readonly TaxIdType[]
}

const NONZERO = '123456789'

/**
 * Builds a generator from a candidate factory: candidates are drawn until one is valid. This
 * rejects the bodies for which an algorithm has no valid check digit (e.g. a mod-11 remainder of
 * 10), instead of mapping them to a wrong digit.
 */
function rejectionSampler(candidate: () => string, isValid: (n: string) => boolean) {
  return () => {
    for (;;) {
      const number = candidate()
      if (isValid(number)) return number
    }
  }
}

interface VatTypeDefinition extends Omit<TaxIdType, 'id' | 'badge' | 'generate'> {
  candidate: () => string
}

function vatType({ candidate, ...definition }: VatTypeDefinition, id = 'vat'): TaxIdType {
  return {
    id,
    badge: definition.name,
    generate: rejectionSampler(candidate, definition.isValid),
    ...definition,
  }
}

// --- Austria (stdnum.at.uid) ---------------------------------------------------------------------
const atCheck = (body: string) => String(mod(6 - luhnChecksum(body.slice(1)), 10))

// --- Bulgaria (stdnum.bg.vat, legal entities) ----------------------------------------------------
function bgLegalCheck(body: string) {
  let check = [...body].reduce((sum, d, i) => sum + (i + 1) * Number(d), 0) % 11
  if (check === 10) check = [...body].reduce((sum, d, i) => sum + (i + 3) * Number(d), 0) % 11
  return String(check % 10)
}

// --- Cyprus (stdnum.cy.vat) ----------------------------------------------------------------------
const CY_ODD = [1, 0, 5, 7, 9, 13, 15, 17, 19, 21]
function cyCheck(body: string) {
  let sum = 0
  for (let i = 0; i < body.length; i++)
    sum += i % 2 === 0 ? CY_ODD[Number(body[i])] : Number(body[i])
  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[sum % 26]
}

// --- Czechia (stdnum.cz.dic, legal entities) -----------------------------------------------------
function czLegalCheck(body: string) {
  const check = mod(11 - weightedSum(body, [8, 7, 6, 5, 4, 3, 2]), 11)
  return String((check || 1) % 10)
}

// --- Greece (stdnum.gr.vat) ----------------------------------------------------------------------
function grCheck(body: string) {
  let checksum = 0
  for (const digit of body) checksum = checksum * 2 + Number(digit)
  return String(((checksum * 2) % 11) % 10)
}

// --- Ireland (stdnum.ie.vat) ---------------------------------------------------------------------
const IE_ALPHABET = 'WABCDEFGHIJKLMNOPQRSTUV'
const ieCheck = (digits: string) => IE_ALPHABET[weightedSum(digits, [8, 7, 6, 5, 4, 3, 2]) % 23]

// --- Italy (stdnum.it.iva) -----------------------------------------------------------------------
function isItalianOffice(code: string) {
  return (code >= '001' && code <= '100') || ['120', '121', '888', '999'].includes(code)
}

// --- Lithuania (stdnum.lt.pvm, legal entities) ---------------------------------------------------
function ltCheck(body: string) {
  let check = [...body].reduce((sum, d, i) => sum + (1 + (i % 9)) * Number(d), 0) % 11
  if (check === 10)
    check = [...body].reduce((sum, d, i) => sum + (1 + ((i + 2) % 9)) * Number(d), 0)
  return String((check % 11) % 10)
}

// --- Netherlands (stdnum.nl.btw, stdnum.nl.bsn, stdnum.iso7064.mod_97_10) ------------------------
const bsnChecksum = (n: string) => mod(weightedSum(n, [9, 8, 7, 6, 5, 4, 3, 2]) - Number(n[8]), 11)
/** ISO 7064 Mod 97, 10 over an alphanumeric string (letters count as 10–35), computed in chunks. */
function mod97(value: string) {
  const digits = [...value].map(c => String(Number.parseInt(c, 36))).join('')
  let remainder = 0
  for (let i = 0; i < digits.length; i += 7)
    remainder = Number(remainder + digits.slice(i, i + 7)) % 97
  return remainder
}

// --- Romania (stdnum.ro.cui) ---------------------------------------------------------------------
const roCheck = (body: string) =>
  String(((10 * weightedSum(body.padStart(9, '0'), [7, 5, 3, 2, 1, 7, 5, 3, 2])) % 11) % 10)

// --- Slovenia (stdnum.si.ddv) --------------------------------------------------------------------
function siCheck(body: string) {
  const check = 11 - (weightedSum(body, [8, 7, 6, 5, 4, 3, 2]) % 11)
  return check === 10 ? '0' : String(check)
}

// --- Spain (stdnum.es.dni, stdnum.es.nie, stdnum.es.cif) -----------------------------------------
const DNI_LETTERS = 'TRWAGMYFPDXBNJZSQVHLCKE'
const dniLetter = (digits: string) => DNI_LETTERS[Number(digits) % 23]
const cifChecks = (digits: string) => {
  const check = luhnCheckDigit(digits)
  return [check, 'JABCDEFGHI'[Number(check)]]
}

// --- United Kingdom and Northern Ireland (stdnum.gb.vat, 9-digit standard numbers) ---------------
const gbChecksum = (n: string) => weightedSum(n, [8, 7, 6, 5, 4, 3, 2, 10, 1]) % 97
const GB_VAT = vatType({
  name: 'VAT',
  label: 'VAT registration number (9-digit standard number)',
  algorithm: 'Modulo 97 (weights 8 to 2), two check digits',
  isValid: n =>
    /^\d{9}$/.test(n) &&
    (Number(n.slice(0, 3)) >= 100 ? [0, 42, 55].includes(gbChecksum(n)) : gbChecksum(n) === 0),
  candidate: () => {
    const body = randomChar(NONZERO) + randomDigits(6)
    return body + pad2(mod(-weightedSum(body, [8, 7, 6, 5, 4, 3, 2]), 97))
  },
})

const PORTUGAL_TYPES: TaxIdType[] = NIF_TYPES.map(type => ({
  id: type.prefix,
  name: 'NIF',
  badge: type.prefix,
  label: type.label,
  algorithm: 'Modulo 11 (weights 9 to 2)',
  generate: () => generateNif(type.prefix),
  isValid: (number: string) => number.startsWith(type.prefix) && isValidNif(number),
}))

export const TAX_ID_COUNTRIES = [
  {
    code: 'AT',
    types: [
      vatType({
        name: 'UID',
        label: 'Umsatzsteuer-Identifikationsnummer (VAT number)',
        algorithm: 'Luhn variant ("U" + 7 digits + check digit)',
        isValid: n => /^U\d{8}$/.test(n) && atCheck(n.slice(0, 8)) === n[8],
        candidate: () => {
          const body = 'U' + randomDigits(7)
          return body + atCheck(body)
        },
      }),
    ],
  },
  {
    code: 'BE',
    types: [
      vatType({
        name: 'Ondernemingsnummer',
        label: 'Enterprise number (VAT number)',
        algorithm: 'Modulo 97, two check digits',
        isValid: n =>
          /^[01]\d{9}$/.test(n) &&
          Number(n) > 0 &&
          (Number(n.slice(0, 8)) + Number(n.slice(8))) % 97 === 0,
        candidate: () => {
          const body = randomChar('01') + randomDigits(7)
          return body + pad2(97 - (Number(body) % 97))
        },
      }),
    ],
  },
  {
    code: 'BG',
    types: [
      vatType({
        name: 'ЕИК',
        label: 'Legal entity VAT number (9 digits, ЕИК/BULSTAT)',
        algorithm: 'Weighted modulo 11 (weights 1 to 8, fallback 3 to 10)',
        isValid: n => /^\d{9}$/.test(n) && bgLegalCheck(n.slice(0, 8)) === n[8],
        candidate: () => {
          const body = randomDigits(8)
          return body + bgLegalCheck(body)
        },
      }),
    ],
  },
  {
    code: 'HR',
    types: [
      vatType({
        name: 'OIB',
        label: 'Osobni identifikacijski broj (individuals and companies)',
        algorithm: 'ISO 7064 Mod 11, 10',
        isValid: n => /^\d{11}$/.test(n) && isMod11_10Valid(n),
        candidate: () => {
          const body = randomDigits(10)
          return body + mod11_10CheckDigit(body)
        },
      }),
    ],
  },
  {
    code: 'CY',
    types: [
      vatType({
        name: 'ΦΠΑ',
        label: 'VAT number (8 digits + check letter)',
        algorithm: 'Translated digit sum modulo 26, check letter',
        isValid: n =>
          /^\d{8}[A-Z]$/.test(n) && !n.startsWith('12') && cyCheck(n.slice(0, 8)) === n[8],
        candidate: () => {
          const body = randomDigits(8)
          return body + cyCheck(body)
        },
      }),
    ],
  },
  {
    code: 'CZ',
    types: [
      vatType({
        name: 'DIČ',
        label: 'Legal entity VAT number (8 digits)',
        algorithm: 'Weighted modulo 11 (weights 8 to 2)',
        isValid: n => /^[0-8]\d{7}$/.test(n) && czLegalCheck(n.slice(0, 7)) === n[7],
        candidate: () => {
          const body = randomChar('012345678') + randomDigits(6)
          return body + czLegalCheck(body)
        },
      }),
    ],
  },
  {
    code: 'DK',
    types: [
      vatType({
        name: 'CVR',
        label: 'Momsregistreringsnummer (CVR number)',
        algorithm: 'Weighted modulo 11 (weights 2, 7, 6, 5, 4, 3, 2, 1)',
        isValid: n => /^[1-9]\d{7}$/.test(n) && weightedSum(n, [2, 7, 6, 5, 4, 3, 2, 1]) % 11 === 0,
        candidate: () => {
          const body = randomChar(NONZERO) + randomDigits(6)
          return body + mod(-weightedSum(body, [2, 7, 6, 5, 4, 3, 2]), 11)
        },
      }),
    ],
  },
  {
    code: 'EE',
    types: [
      vatType({
        name: 'KMKR',
        label: 'Käibemaksukohustuslase number (VAT number)',
        algorithm: 'Weighted modulo 10 (weights 3, 7, 1)',
        isValid: n => /^\d{9}$/.test(n) && weightedSum(n, [3, 7, 1, 3, 7, 1, 3, 7, 1]) % 10 === 0,
        candidate: () => {
          const body = '10' + randomDigits(6)
          return body + mod(-weightedSum(body, [3, 7, 1, 3, 7, 1, 3, 7]), 10)
        },
      }),
    ],
  },
  {
    code: 'FI',
    types: [
      vatType({
        name: 'ALV',
        label: 'Arvonlisäveronumero (VAT number, from the Y-tunnus)',
        algorithm: 'Weighted modulo 11 (weights 7, 9, 10, 5, 8, 4, 2)',
        isValid: n => /^\d{8}$/.test(n) && weightedSum(n, [7, 9, 10, 5, 8, 4, 2, 1]) % 11 === 0,
        candidate: () => {
          const body = randomDigits(7)
          return body + mod(-weightedSum(body, [7, 9, 10, 5, 8, 4, 2]), 11)
        },
      }),
    ],
  },
  {
    code: 'FR',
    types: [
      vatType({
        name: 'TVA',
        label: 'Numéro de TVA intracommunautaire (numeric key + SIREN)',
        algorithm: 'SIREN with Luhn check digit, key = (SIREN × 100 + 12) mod 97',
        isValid: n => {
          if (!/^\d{11}$/.test(n)) return false
          const siren = n.slice(2)
          // SIRENs starting with 000 are Monaco numbers, which are not Luhn-checked.
          if (!siren.startsWith('000') && !isLuhnValid(siren)) return false
          return Number(n.slice(0, 2)) === Number(siren + '12') % 97
        },
        candidate: () => {
          const body = randomChar(NONZERO) + randomDigits(7)
          const siren = body + luhnCheckDigit(body)
          return pad2(Number(siren + '12') % 97) + siren
        },
      }),
    ],
  },
  {
    code: 'DE',
    types: [
      vatType({
        name: 'USt-IdNr.',
        label: 'Umsatzsteuer-Identifikationsnummer (VAT number)',
        algorithm: 'ISO 7064 Mod 11, 10',
        isValid: n => /^[1-9]\d{8}$/.test(n) && isMod11_10Valid(n),
        candidate: () => {
          const body = randomChar(NONZERO) + randomDigits(7)
          return body + mod11_10CheckDigit(body)
        },
      }),
    ],
  },
  {
    code: 'EL',
    types: [
      vatType({
        name: 'ΑΦΜ',
        label: 'Αριθμός Φορολογικού Μητρώου (tax number)',
        algorithm: 'Powers of 2 modulo 11',
        isValid: n => /^\d{9}$/.test(n) && grCheck(n.slice(0, 8)) === n[8],
        candidate: () => {
          const body = randomDigits(8)
          return body + grCheck(body)
        },
      }),
    ],
  },
  {
    code: 'HU',
    types: [
      vatType({
        name: 'ANUM',
        label: 'Közösségi adószám (VAT number)',
        algorithm: 'Weighted modulo 10 (weights 9, 7, 3, 1)',
        isValid: n => /^\d{8}$/.test(n) && weightedSum(n, [9, 7, 3, 1, 9, 7, 3, 1]) % 10 === 0,
        candidate: () => {
          const body = randomChar(NONZERO) + randomDigits(6)
          return body + mod(-weightedSum(body, [9, 7, 3, 1, 9, 7, 3]), 10)
        },
      }),
    ],
  },
  {
    code: 'IE',
    types: [
      vatType({
        name: 'VAT',
        label: 'VAT number (7 digits + check letter)',
        algorithm: 'Weighted modulo 23 (weights 8 to 2), check letter',
        isValid: n => /^\d{7}[A-Z]$/.test(n) && ieCheck(n) === n[7],
        candidate: () => {
          const body = randomDigits(7)
          return body + ieCheck(body)
        },
      }),
    ],
  },
  {
    code: 'IT',
    types: [
      vatType({
        name: 'Partita IVA',
        label: 'Partita IVA (VAT number)',
        algorithm: 'Luhn, with a valid tax office code in digits 8–10',
        isValid: n =>
          /^\d{11}$/.test(n) &&
          Number(n.slice(0, 7)) > 0 &&
          isItalianOffice(n.slice(7, 10)) &&
          isLuhnValid(n),
        candidate: () => {
          const office = String(1 + randomInt(100)).padStart(3, '0')
          const body = randomDigits(7) + office
          return body + luhnCheckDigit(body)
        },
      }),
    ],
  },
  {
    code: 'LV',
    types: [
      vatType({
        name: 'PVN',
        label: 'Legal entity VAT number (11 digits, first digit above 3)',
        algorithm: 'Weighted modulo 11 (weights 9, 1, 4, 8, 3, 10, 2, 5, 7, 6, 1)',
        isValid: n =>
          /^[4-9]\d{10}$/.test(n) && weightedSum(n, [9, 1, 4, 8, 3, 10, 2, 5, 7, 6, 1]) % 11 === 3,
        candidate: () => {
          const body = randomChar('456789') + randomDigits(9)
          return body + mod(3 - weightedSum(body, [9, 1, 4, 8, 3, 10, 2, 5, 7, 6]), 11)
        },
      }),
    ],
  },
  {
    code: 'LT',
    types: [
      vatType({
        name: 'PVM',
        label: 'Legal entity VAT number (9 digits)',
        algorithm: 'Weighted modulo 11 (weights 1 to 9, fallback 3 to 9, 1, 2)',
        isValid: n => /^\d{7}1\d$/.test(n) && ltCheck(n.slice(0, 8)) === n[8],
        candidate: () => {
          const body = randomDigits(7) + '1'
          return body + ltCheck(body)
        },
      }),
    ],
  },
  {
    code: 'LU',
    types: [
      vatType({
        name: 'TVA',
        label: 'Numéro d’identification à la TVA (VAT number)',
        algorithm: 'First 6 digits modulo 89, two check digits',
        isValid: n => /^\d{8}$/.test(n) && pad2(Number(n.slice(0, 6)) % 89) === n.slice(6),
        candidate: () => {
          const body = randomChar(NONZERO) + randomDigits(5)
          return body + pad2(Number(body) % 89)
        },
      }),
    ],
  },
  {
    code: 'MT',
    types: [
      vatType({
        name: 'VAT',
        label: 'VAT registration number',
        algorithm: 'Weighted modulo 37 (weights 3, 4, 6, 7, 8, 9, 10, 1)',
        isValid: n =>
          /^[1-9]\d{7}$/.test(n) && weightedSum(n, [3, 4, 6, 7, 8, 9, 10, 1]) % 37 === 0,
        candidate: () => {
          const body = randomChar(NONZERO) + randomDigits(5)
          return body + pad2(mod(-weightedSum(body, [3, 4, 6, 7, 8, 9]), 37))
        },
      }),
    ],
  },
  {
    code: 'NL',
    types: [
      vatType({
        name: 'Btw-nummer',
        label: 'Btw-nummer (RSIN/BSN + B01)',
        algorithm: 'Elfproef (weighted modulo 11) on the first 9 digits',
        isValid: n =>
          /^\d{9}B\d{2}$/.test(n) &&
          Number(n.slice(0, 9)) > 0 &&
          Number(n.slice(10)) > 0 &&
          (bsnChecksum(n) === 0 || mod97(`NL${n}`) === 1),
        candidate: () => {
          const body = randomChar(NONZERO) + randomDigits(7)
          return `${body}${mod(weightedSum(body, [9, 8, 7, 6, 5, 4, 3, 2]), 11)}B01`
        },
      }),
    ],
  },
  {
    code: 'PL',
    types: [
      vatType({
        name: 'NIP',
        label: 'Numer Identyfikacji Podatkowej (tax number)',
        algorithm: 'Weighted modulo 11 (weights 6, 5, 7, 2, 3, 4, 5, 6, 7)',
        isValid: n =>
          /^\d{10}$/.test(n) && mod(weightedSum(n, [6, 5, 7, 2, 3, 4, 5, 6, 7, -1]), 11) === 0,
        candidate: () => {
          const body = randomChar(NONZERO) + randomDigits(8)
          return body + mod(weightedSum(body, [6, 5, 7, 2, 3, 4, 5, 6, 7]), 11)
        },
      }),
    ],
  },
  {
    code: 'PT',
    types: PORTUGAL_TYPES,
  },
  {
    code: 'RO',
    types: [
      vatType({
        name: 'CIF',
        label: 'Cod de identificare fiscală (8-digit company number)',
        algorithm: 'Weighted modulo 11 (weights 7, 5, 3, 2, 1, 7, 5, 3, 2)',
        isValid: n => /^[1-9]\d{1,9}$/.test(n) && roCheck(n.slice(0, -1)) === n.slice(-1),
        candidate: () => {
          const body = randomChar(NONZERO) + randomDigits(6)
          return body + roCheck(body)
        },
      }),
    ],
  },
  {
    code: 'SK',
    types: [
      vatType({
        name: 'IČ DPH',
        label: 'Identifikačné číslo pre DPH (VAT number)',
        algorithm: 'Whole number divisible by 11',
        isValid: n => /^[1-9]\d[234789]\d{7}$/.test(n) && Number(n) % 11 === 0,
        candidate: () => {
          const body =
            randomChar(NONZERO) + randomDigits(1) + randomChar('234789') + randomDigits(6)
          return body + mod(-Number(body + '0'), 11)
        },
      }),
    ],
  },
  {
    code: 'SI',
    types: [
      vatType({
        name: 'DDV',
        label: 'Identifikacijska številka za DDV (VAT number)',
        algorithm: 'Weighted modulo 11 (weights 8 to 2)',
        isValid: n => /^[1-9]\d{7}$/.test(n) && siCheck(n.slice(0, 7)) === n[7],
        candidate: () => {
          const body = randomChar(NONZERO) + randomDigits(6)
          return body + siCheck(body)
        },
      }),
    ],
  },
  {
    code: 'ES',
    types: [
      vatType(
        {
          name: 'DNI',
          label: 'NIF of a Spanish citizen (DNI: 8 digits + letter)',
          algorithm: 'Number modulo 23, check letter',
          isValid: n => /^\d{8}[A-Z]$/.test(n) && dniLetter(n.slice(0, 8)) === n[8],
          candidate: () => {
            const body = randomDigits(8)
            return body + dniLetter(body)
          },
        },
        'dni'
      ),
      vatType(
        {
          name: 'NIE',
          label: 'NIF of a foreign resident (NIE: X, Y or Z + 7 digits + letter)',
          algorithm: 'X/Y/Z read as 0/1/2, number modulo 23, check letter',
          isValid: n =>
            /^[XYZ]\d{7}[A-Z]$/.test(n) && dniLetter('XYZ'.indexOf(n[0]) + n.slice(1, 8)) === n[8],
          candidate: () => {
            const body = randomChar('XYZ') + randomDigits(7)
            return body + dniLetter('XYZ'.indexOf(body[0]) + body.slice(1))
          },
        },
        'nie'
      ),
      vatType(
        {
          name: 'CIF',
          label: 'NIF of a company (CIF: A or B + 7 digits + check digit)',
          algorithm: 'Luhn on the 7 digits, check digit or letter',
          isValid: n =>
            /^[ABCDEFGHJNPQRSUVW]\d{7}[0-9A-J]$/.test(n) && cifChecks(n.slice(1, 8)).includes(n[8]),
          candidate: () => {
            const digits = randomDigits(7)
            return randomChar('AB') + digits + luhnCheckDigit(digits)
          },
        },
        'cif'
      ),
    ],
  },
  {
    code: 'SE',
    types: [
      vatType({
        name: 'Momsnr',
        label: 'Momsregistreringsnummer (organisationsnummer + 01)',
        algorithm: 'Luhn on the 10-digit organisationsnummer',
        isValid: n => /^\d{10}01$/.test(n) && isLuhnValid(n.slice(0, 10)),
        candidate: () => {
          // Organisation numbers have a third digit of 2 or more, unlike personal identity numbers.
          const body =
            randomChar(NONZERO) + randomDigits(1) + randomChar('23456789') + randomDigits(6)
          return `${body}${luhnCheckDigit(body)}01`
        },
      }),
    ],
  },
  { code: 'XI', types: [GB_VAT] },
  { code: 'GB', types: [GB_VAT] },
] as const satisfies readonly TaxIdCountry[]
