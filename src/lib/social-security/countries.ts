/**
 * Social security, social insurance and health insurance numbers.
 *
 * Every check-digit algorithm below is a line-by-line port of python-stdnum
 * (https://github.com/arthurdejong/python-stdnum), the module named in each `source`, and is
 * tested against the numbers of that project's documentation and test suite. Numbers without a
 * check digit (e.g. the US SSN) are not listed.
 *
 * The Portuguese NISS is the exception: python-stdnum does not have it, so its check digit is the
 * rule of the `validators_pt` module named in its `source`.
 */
import { hasValidNnCheck, nnCandidate } from '@/lib/identity/countries'
import { isLuhnValid, luhnCheckDigit, mod, pad2, weightedSum } from '@/lib/numbers/checksums'
import { ddmmyy, defineType, isMale, pad3 } from '@/lib/numbers/define'
import { split } from '@/lib/numbers/helpers'
import { dateParts, isDate, randomWithParity } from '@/lib/numbers/person'
import type { NumberCountry } from '@/lib/numbers/types'
import { randomChar, randomDigits, randomInt } from '@/lib/random'

const NONZERO = '123456789'

// --- Austria (stdnum.at.vnr) ---------------------------------------------------------------------
/** The fourth digit, or "10" when the serial number has no valid check digit. */
const vnrCheck = (number: string) =>
  String(weightedSum(number, [3, 7, 9, 0, 5, 8, 4, 2, 1, 6]) % 11)

// --- Belgium (stdnum.be.ssn: a national number or a BIS number) ----------------------------------
function isValidBelgianSsn(number: string): boolean {
  if (!hasValidNnCheck(number)) return false
  // BIS numbers, for people not in the national register, add 20 or 40 to the month.
  const month = Number(number.slice(2, 4))
  return month <= 12 || (month >= 20 && month <= 32) || (month >= 40 && month <= 52)
}

// --- Switzerland (stdnum.ch.ssn, stdnum.ean) -----------------------------------------------------
function eanCheckDigit(body: string): string {
  let sum = 0
  for (let i = 0; i < body.length; i++) sum += (i % 2 === 0 ? 3 : 1) * Number(body.at(-1 - i))
  return String(mod(10 - sum, 10))
}

// --- France (stdnum.fr.nir) ----------------------------------------------------------------------
/** The two-digit key; the Corsican departments 2A and 2B count as 19 and 18. */
function nirKey(number: string): string {
  const digits = number.slice(0, 13).replace('2A', '19').replace('2B', '18')
  return pad2(97 - (Number(digits) % 97))
}
const NIR = /^\d{5}(\d{2}|2[AB])\d{8}$/

// --- United Kingdom (stdnum.gb.nhs) --------------------------------------------------------------
/** Weights 10 to 1 from the left: 0 for a valid number. */
const nhsChecksum = (number: string) => weightedSum(number, [10, 9, 8, 7, 6, 5, 4, 3, 2, 1]) % 11

// --- Greece (stdnum.gr.amka) ---------------------------------------------------------------------
function isValidAmka(number: string): boolean {
  if (!/^\d{11}$/.test(number) || !isLuhnValid(number)) return false
  const [day, month, year] = [0, 2, 4].map(at => Number(number.slice(at, at + 2)))
  // Two-digit year: valid in either century.
  return isDate(1900 + year, month, day) || isDate(2000 + year, month, day)
}

// --- Ireland (stdnum.ie.pps, with the check character of stdnum.ie.vat) --------------------------
const PPS_ALPHABET = 'WABCDEFGHIJKLMNOPQRSTUV'
/** Check letter of the seven digits and, in the format in use since 2013, the second letter. */
function ppsCheck(digits: string, second = ''): string {
  let sum = 9 * PPS_ALPHABET.indexOf(second || 'W')
  for (let i = 0; i < 7; i++) sum += (8 - i) * Number(digits[i])
  return PPS_ALPHABET[sum % 23]
}
function isValidPps(number: string): boolean {
  if (!/^\d{7}[A-W][ABHWTX]?$/.test(number)) return false
  // A, B and H are part of the number since 2013; the older W, T and X are ignored.
  const second = number.length === 9 && 'ABH'.includes(number[8]) ? number[8] : ''
  return number[7] === ppsCheck(number, second)
}

// --- Portugal (validators_pt) --------------------------------------------------------------------
const nissCheck = (body: string) =>
  String(9 - (weightedSum(body, [29, 23, 19, 17, 13, 11, 7, 5, 3, 2]) % 10))

export const SOCIAL_SECURITY_COUNTRIES: readonly (NumberCountry & { name: string })[] = [
  {
    code: 'AT',
    name: 'Austria',
    types: [
      defineType({
        id: 'vnr',
        name: 'Versicherungsnummer',
        badge: 'VNR',
        label: 'Sozialversicherungsnummer (social insurance number)',
        algorithm: 'Weighted sum (3, 7, 9, 5, 8, 4, 2, 1, 6) modulo 11, in the fourth digit',
        stdnum: 'stdnum.at.vnr',
        pattern: /^\d{10}$/,
        notations: ['9999 999999'],
        checkIndex: 3,
        format: n => split(n, [4], ' '),
        encodes: ['birthDate'],
        isValid: n => /^[1-9]\d{9}$/.test(n) && vnrCheck(n) === n[3],
        candidate: person => {
          // A serial number, the check digit, then the birth date.
          const serial = randomChar(NONZERO) + randomDigits(2)
          const check = vnrCheck(serial + '0' + ddmmyy(person))
          return check.length > 1 ? '' : serial + check + ddmmyy(person)
        },
      }),
    ],
  },
  {
    code: 'BE',
    name: 'Belgium',
    types: [
      defineType({
        id: 'ssn',
        name: 'INSZ / NISS',
        badge: 'INSZ',
        label: 'Social security identification number (the national or BIS number)',
        algorithm: 'Two check digits: 97 minus the first nine digits modulo 97',
        stdnum: 'stdnum.be.ssn',
        pattern: /^\d{11}$/,
        notations: ['99.99.99-999.99'],
        checkIndex: 9,
        format: n => `${split(n.slice(0, 6), [2, 4], '.')}-${split(n.slice(6), [3], '.')}`,
        encodes: ['birthDate', 'sex'],
        isValid: isValidBelgianSsn,
        candidate: nnCandidate,
      }),
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    types: [
      defineType({
        id: 'sin',
        name: 'SIN',
        label: 'Social Insurance Number',
        algorithm: 'Luhn (mod 10)',
        stdnum: 'stdnum.ca.sin',
        pattern: /^\d{9}$/,
        notations: ['999-999-999'],
        format: n => split(n, [3, 6], '-'),
        // Numbers starting with 0 or 8 are not issued to people.
        isValid: n => /^[1-79]\d{8}$/.test(n) && isLuhnValid(n),
        candidate: () => {
          const body = randomChar('1234567') + randomDigits(7)
          return body + luhnCheckDigit(body)
        },
      }),
    ],
  },
  {
    code: 'FR',
    name: 'France',
    types: [
      defineType({
        id: 'nir',
        name: 'NIR',
        label: 'Numéro de sécurité sociale (numéro d’inscription au répertoire)',
        algorithm: 'Two-digit key: 97 minus the first thirteen digits modulo 97',
        stdnum: 'stdnum.fr.nir',
        pattern: NIR,
        notations: ['9 99 99 99 999 999 99'],
        checkIndex: 13,
        format: n => split(n, [1, 3, 5, 7, 10, 13], ' '),
        // The year and month of birth; the day is not part of the number.
        encodes: ['birthDate', 'sex'],
        isValid: n => NIR.test(n) && nirKey(n) === n.slice(13),
        candidate: person => {
          const { yy, month } = dateParts(person.birthDate)
          // Sex, year and month of birth, then the department and commune of birth and an order
          // number, which are random here.
          const body =
            (isMale(person) ? '1' : '2') +
            pad2(yy) +
            pad2(month) +
            pad2(1 + randomInt(19)) +
            pad3(1 + randomInt(990)) +
            pad3(1 + randomInt(999))
          return body + nirKey(body)
        },
      }),
    ],
  },
  {
    code: 'GR',
    name: 'Greece',
    types: [
      defineType({
        id: 'amka',
        name: 'ΑΜΚΑ',
        badge: 'AMKA',
        label: 'Αριθμός Μητρώου Κοινωνικής Ασφάλισης (social security number)',
        algorithm: 'Luhn (mod 10)',
        stdnum: 'stdnum.gr.amka',
        pattern: /^\d{11}$/,
        notations: ['99999999999'],
        encodes: ['birthDate', 'sex'],
        isValid: isValidAmka,
        candidate: person => {
          // The birth date, then a serial number whose last digit is odd for men.
          const body = ddmmyy(person) + randomDigits(3) + randomWithParity(0, 9, isMale(person))
          return body + luhnCheckDigit(body)
        },
      }),
    ],
  },
  {
    code: 'IE',
    name: 'Ireland',
    types: [
      defineType({
        id: 'pps',
        name: 'PPS No.',
        badge: 'PPS',
        label: 'Personal Public Service number',
        algorithm: 'Check letter: weighted sum (8 to 2) modulo 23',
        stdnum: 'stdnum.ie.pps',
        pattern: /^\d{7}[A-W][ABHWTX]?$/,
        notations: ['9999999A', '9999999AA (two letters, since 2013)'],
        checkIndex: 7,
        isValid: isValidPps,
        candidate: () => {
          const digits = randomDigits(7)
          return digits + ppsCheck(digits)
        },
      }),
    ],
  },
  {
    code: 'PT',
    name: 'Portugal',
    types: [
      defineType({
        id: 'niss',
        name: 'NISS',
        label: 'Número de Identificação de Segurança Social',
        algorithm: 'Weighted sum (29, 23, 19, 17, 13, 11, 7, 5, 3, 2) modulo 10',
        document: {
          title: 'validators_pt, a Python module of Portuguese number validators',
          label: 'validators_pt',
          url: 'https://gist.github.com/dreispt/024dd11c160af58268e2b44019080bbf',
        },
        pattern: /^\d{11}$/,
        notations: ['99999999999'],
        // 1 for people, 2 for companies and other entities.
        isValid: n => /^[12]\d{10}$/.test(n) && nissCheck(n) === n[10],
        candidate: () => {
          const body = '1' + randomDigits(9)
          return body + nissCheck(body)
        },
      }),
    ],
  },
  {
    code: 'CH',
    name: 'Switzerland',
    types: [
      defineType({
        id: 'ahv',
        name: 'AHV-Nr.',
        badge: 'AHV',
        label: 'AHV-Nummer / numéro AVS (social security number)',
        algorithm: 'EAN-13 check digit',
        stdnum: 'stdnum.ch.ssn',
        pattern: /^\d{13}$/,
        notations: ['756.9999.9999.99'],
        format: n => split(n, [3, 7, 11], '.'),
        // 756 is the country code of Switzerland.
        isValid: n => /^756\d{10}$/.test(n) && eanCheckDigit(n.slice(0, 12)) === n[12],
        candidate: () => {
          const body = '756' + randomDigits(9)
          return body + eanCheckDigit(body)
        },
      }),
    ],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    types: [
      defineType({
        id: 'nhs',
        name: 'NHS number',
        badge: 'NHS',
        label: 'National Health Service number (England, Wales and the Isle of Man)',
        algorithm: 'Weighted sum (10 to 2) modulo 11',
        stdnum: 'stdnum.gb.nhs',
        pattern: /^\d{10}$/,
        notations: ['999 999 9999'],
        format: n => split(n, [3, 6], ' '),
        isValid: n => /^\d{10}$/.test(n) && nhsChecksum(n) === 0,
        candidate: () => {
          const body = randomDigits(9)
          const check = mod(-weightedSum(body, [10, 9, 8, 7, 6, 5, 4, 3, 2]), 11)
          return check === 10 ? '' : body + check
        },
      }),
    ],
  },
]
