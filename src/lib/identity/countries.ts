/**
 * Identity numbers: the numbers of identity cards and population registers.
 *
 * Every check-digit algorithm below is a line-by-line port of python-stdnum
 * (https://github.com/arthurdejong/python-stdnum), the module named in each `source`, and is
 * tested against the numbers of that project's documentation and test suite. A number is only
 * listed when python-stdnum verifies its check digit: numbers it only checks the format of (e.g.
 * the Danish CPR, whose check digit was abandoned in 2007) are not.
 *
 * Numbers that encode their holder's birth date or sex take a `PersonSeed`, so they can match a
 * generated person; on their own they are generated for a random adult.
 */
import {
  isLuhnValid,
  luhnCheckDigit,
  mod,
  pad2,
  verhoeffCheckDigit,
  verhoeffChecksum,
  weightedSum,
} from '@/lib/numbers/checksums'
import {
  ddmmyy,
  defineType as idType,
  isMale,
  pad3,
  yymmdd,
  type TypeDefinition as IdTypeDefinition,
} from '@/lib/numbers/define'
import { split } from '@/lib/numbers/helpers'
import { dateParts, isDate, randomWithParity } from '@/lib/numbers/person'
import type { NumberCountry, NumberType, PersonSeed } from '@/lib/numbers/types'
import { randomChar, randomDigits, randomInt } from '@/lib/random'
import { getTaxIdType } from '@/lib/tax-id'

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

/** A kind of number already listed as a tax number, which is also its country's identity number. */
function fromTaxIds(
  country: Parameters<typeof getTaxIdType>[0],
  taxId: string,
  stdnum: string,
  overrides: Partial<NumberType> = {}
): NumberType {
  const type = getTaxIdType(country, taxId)
  if (!type) throw new Error(`No ${country} ${taxId} tax number`)
  return { ...type, source: { stdnum }, ...overrides }
}

// --- Portugal (stdnum.pt.cc) ---------------------------------------------------------------------
const BASE36 = '0123456789' + UPPER
/** Luhn over letters and digits (A is 10, Z is 35), as the Cartão de Cidadão specification sets. */
function ccCheckDigit(body: string): string {
  let sum = 0
  for (let i = 0; i < body.length; i++) {
    const value = BASE36.indexOf(body[body.length - 1 - i])
    const doubled = value * 2
    sum += i % 2 === 0 ? (doubled > 9 ? doubled - 9 : doubled) : value
  }
  return String(mod(10 - sum, 10))
}

// --- Belgium (stdnum.be.nn, stdnum.be.eid) -------------------------------------------------------
/** The two check digits of a national number, for a birth year before or from 2000. */
const nnCheck = (body: string, from2000: boolean) =>
  pad2(97 - (Number((from2000 ? '2' : '') + body) % 97))
/** True when the check digits of a national (or BIS) number are right for either century. */
export function hasValidNnCheck(number: string): boolean {
  if (!/^\d{11}$/.test(number) || Number(number) <= 0) return false
  const body = number.slice(0, 9)
  const check = number.slice(9)
  // The check digits of people born from 2000 are computed with a 2 in front of the number.
  const from2000 = Number(number.slice(0, 2)) + 2000 <= new Date().getUTCFullYear()
  return check === nnCheck(body, false) || (from2000 && check === nnCheck(body, true))
}
const isValidNn = (number: string) => hasValidNnCheck(number) && Number(number.slice(2, 4)) <= 12
/** A national number for `person`: the day's counter is odd for men and even for women. */
export function nnCandidate(person: PersonSeed): string {
  const body = yymmdd(person) + pad3(randomWithParity(1, 997, isMale(person)))
  return body + nnCheck(body, dateParts(person.birthDate).year >= 2000)
}
const eidCheck = (body: string) => pad2(Number(body) % 97 || 97)

// --- Bulgaria (stdnum.bg.egn, stdnum.bg.pnf) -----------------------------------------------------
const egnCheck = (body: string) =>
  String((weightedSum(body, [2, 4, 8, 5, 10, 9, 7, 3, 6]) % 11) % 10)
function isValidEgn(number: string): boolean {
  if (!/^\d{10}$/.test(number)) return false
  let year = Number(number.slice(0, 2)) + 1900
  let month = Number(number.slice(2, 4))
  if (month > 40) {
    year += 100
    month -= 40
  } else if (month > 20) {
    year -= 100
    month -= 20
  }
  return isDate(year, month, Number(number.slice(4, 6))) && egnCheck(number) === number[9]
}
const pnfCheck = (body: string) => String(weightedSum(body, [21, 19, 17, 13, 11, 9, 7, 3, 1]) % 10)

// --- Czechia and Slovakia (stdnum.cz.rc, which stdnum.sk.rc reuses) ------------------------------
function isValidRc(number: string): boolean {
  if (!/^\d{10}$/.test(number)) return false
  let year = 1900 + Number(number.slice(0, 2))
  // Women have 50 added to the month; 20 more is added when the day's serials run out.
  const month = (Number(number.slice(2, 4)) % 50) % 20
  if (year < 1954) year += 100
  if (!isDate(year, month, Number(number.slice(4, 6)))) return false
  return String((Number(number.slice(0, 9)) % 11) % 10) === number[9]
}
const RODNE_CISLO: Omit<IdTypeDefinition, 'label' | 'stdnum'> = {
  id: 'rc',
  name: 'Rodné číslo',
  badge: 'RČ',
  algorithm: 'The first nine digits modulo 11',
  pattern: /^\d{10}$/,
  notations: ['999999/9999'],
  format: n => split(n, [6], '/'),
  encodes: ['birthDate', 'sex'],
  isValid: isValidRc,
  candidate: person => {
    const body = yymmdd(person, isMale(person) ? 0 : 50) + randomDigits(3)
    return body + ((Number(body) % 11) % 10)
  },
}

// --- Estonia and Lithuania (stdnum.ee.ik, which stdnum.lt.asmens reuses) -------------------------
function ikCheck(number: string): string {
  const body = [...number.slice(0, 10)].map(Number)
  let check = body.reduce((sum, digit, i) => sum + ((i % 9) + 1) * digit, 0) % 11
  if (check === 10)
    check = body.reduce((sum, digit, i) => sum + (((i + 2) % 9) + 1) * digit, 0) % 11
  return String(check % 10)
}
function ikBirthDateIsValid(number: string): boolean {
  const century = 1800 + 100 * Math.floor((Number(number[0]) - 1) / 2)
  if (number[0] === '0' || number[0] === '9') return false
  return isDate(
    century + Number(number.slice(1, 3)),
    Number(number.slice(3, 5)),
    Number(number.slice(5, 7))
  )
}
/** Sex and century in the first digit, the birth date, a serial number and a check digit. */
function ikCandidate(person: PersonSeed): string {
  const { year } = dateParts(person.birthDate)
  const first = 2 * Math.floor((year - 1800) / 100) + (isMale(person) ? 1 : 2)
  const body = first + yymmdd(person) + randomDigits(3)
  return body + ikCheck(body)
}

// --- Finland (stdnum.fi.hetu) --------------------------------------------------------------------
const HETU_CONTROL = '0123456789ABCDEFHJKLMNPRSTUVWXY'
const HETU_CENTURIES: Record<string, number> = { '+': 1800, '-': 1900, A: 2000 }
for (const sign of 'YXWVU') HETU_CENTURIES[sign] = 1900
for (const sign of 'BCDEF') HETU_CENTURIES[sign] = 2000
const HETU = /^([0-3]\d)([01]\d)(\d\d)([-+ABCDEFYXWVU])(\d{3})([0-9ABCDEFHJKLMNPRSTUVWXY])$/
function isValidHetu(number: string): boolean {
  const match = HETU.exec(number)
  if (!match) return false
  const [, day, month, year, sign, individual, control] = match
  if (!isDate(HETU_CENTURIES[sign] + Number(year), Number(month), Number(day))) return false
  // Individual numbers start at 002; 900 to 999 are temporary identifiers.
  if (Number(individual) < 2 || Number(individual) >= 900) return false
  return HETU_CONTROL[Number(day + month + year + individual) % 31] === control
}

// --- Iceland (stdnum.is_.kennitala) --------------------------------------------------------------
const kennitalaChecksum = (number: string) =>
  weightedSum(number, [3, 2, 7, 6, 5, 4, 3, 2, 1, 0]) % 11
function isValidKennitala(number: string): boolean {
  if (!/^[0-7]\d[01]\d{6}[09]$/.test(number)) return false
  const year = Number(number.slice(4, 6)) + (number[9] === '9' ? 1900 : 2000)
  // Organisations have 40 added to the day of their registration date.
  const day = Number(number.slice(0, 2))
  return (
    isDate(year, Number(number.slice(2, 4)), day >= 40 ? day - 40 : day) &&
    kennitalaChecksum(number) === 0
  )
}

// --- Israel (stdnum.il.idnr), India (stdnum.in_.aadhaar, stdnum.in_.vid) -------------------------
/** Aadhaar numbers and virtual IDs: not starting with 0 or 1, not a palindrome, Verhoeff. */
const isValidAadhaar = (length: number) => (number: string) =>
  new RegExp(`^[2-9]\\d{${length - 1}}$`).test(number) &&
  number !== [...number].reverse().join('') &&
  verhoeffChecksum(number) === 0
const aadhaarCandidate = (length: number) => () => {
  const body = randomChar('23456789') + randomDigits(length - 2)
  return body + verhoeffCheckDigit(body)
}

// --- Japan (stdnum.jp.in_) -----------------------------------------------------------------------
const myNumberCheck = (body: string) =>
  String(mod(-weightedSum(body, [6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2]), 11) % 10)

// --- South Korea (stdnum.kr.rrn) -----------------------------------------------------------------
const rrnCheck = (body: string) =>
  String((11 - (weightedSum(body, [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5]) % 11)) % 10)
function isValidRrn(number: string): boolean {
  if (!/^\d{13}$/.test(number)) return false
  const century = '1256'.includes(number[6]) ? 1900 : '3478'.includes(number[6]) ? 2000 : 1800
  return (
    isDate(
      century + Number(number.slice(0, 2)),
      Number(number.slice(2, 4)),
      Number(number.slice(4, 6))
    ) &&
    Number(number.slice(7, 9)) <= 96 &&
    rrnCheck(number) === number[12]
  )
}

// --- Norway (stdnum.no.fodselsnummer) ------------------------------------------------------------
/** A check digit, or "10" when the number has none (such numbers are not issued). */
const fnrCheck1 = (number: string) =>
  String(mod(11 - weightedSum(number, [3, 7, 6, 1, 8, 9, 4, 5, 2]), 11))
const fnrCheck2 = (number: string) =>
  String(mod(11 - weightedSum(number, [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]), 11))
function isValidFodselsnummer(number: string): boolean {
  if (!/^\d{11}$/.test(number)) return false
  if (number[9] !== fnrCheck1(number) || number[10] !== fnrCheck2(number)) return false
  let day = Number(number.slice(0, 2))
  let month = Number(number.slice(2, 4))
  let year = Number(number.slice(4, 6))
  const individual = Number(number.slice(6, 9))
  // FH numbers (day from 80) hold no birth date; D and H numbers add 40 to the day or month.
  if (day >= 80) return false
  if (day > 40) day -= 40
  if (month > 40) month -= 40
  if (individual < 500) year += 1900
  else if (individual < 750 && year >= 54) year += 1800
  else if (year < 40) year += 2000
  else if (individual >= 900) year += 1900
  else return false
  return isDate(year, month, day) && Date.UTC(year, month - 1, day) <= Date.now()
}

// --- Peru (stdnum.pe.cui) ------------------------------------------------------------------------
/** The check character is a digit or, on older documents, a letter: both are accepted. */
function cuiChecks(body: string): string {
  const c = weightedSum(body, [3, 2, 7, 6, 5, 4, 3, 2]) % 11
  return '65432110987'[c] + 'KJIHGFEDCBA'[c]
}

// --- Poland (stdnum.pl.pesel) --------------------------------------------------------------------
const PESEL_CENTURIES = [1900, 2000, 2100, 2200, 1800]
const peselCheck = (body: string) =>
  String(mod(10 - weightedSum(body, [1, 3, 7, 9, 1, 3, 7, 9, 1, 3]), 10))
function isValidPesel(number: string): boolean {
  if (!/^\d{11}$/.test(number) || peselCheck(number) !== number[10]) return false
  const month = Number(number.slice(2, 4))
  return isDate(
    Number(number.slice(0, 2)) + PESEL_CENTURIES[Math.floor(month / 20)],
    month % 20,
    Number(number.slice(4, 6))
  )
}

// --- Sweden (stdnum.se.personnummer) -------------------------------------------------------------
/** "yymmdd-nnnn", with a plus instead of the dash from the year the person turns 100. */
function compactPersonnummer(input: string): string {
  const number = input.replace(/[\s:]/g, '')
  const signed = /^\d{10}$|^\d{12}$/.test(number)
    ? `${number.slice(0, -4)}-${number.slice(-4)}`
    : number
  return signed.slice(0, -5).replace(/[-+]/g, '') + signed.slice(-5)
}
function isValidPersonnummer(number: string): boolean {
  const match = /^(\d{2})?(\d{2})(\d{2})(\d{2})([-+])(\d{4})$/.exec(number)
  if (!match) return false
  const [, century, yy, month, day, sign, serial] = match
  let year: number
  if (century) {
    year = Number(century + yy)
  } else {
    // The latest year with these two digits, a century earlier after a plus sign.
    const today = new Date().getUTCFullYear()
    year = Math.floor(today / 100) * 100 + Number(yy)
    if (Number(yy) > today % 100) year -= 100
    if (sign === '+') year -= 100
  }
  return isDate(year, Number(month), Number(day)) && isLuhnValid(yy + month + day + serial)
}

// --- Thailand (stdnum.th.pin) --------------------------------------------------------------------
function pinCheck(number: string): string {
  let sum = 0
  for (let i = 0; i < 12; i++) sum += (2 - i) * Number(number[i])
  return String(mod(1 - mod(sum, 11), 10))
}

// --- South Africa (stdnum.za.idnr) ---------------------------------------------------------------
function isValidZaId(number: string): boolean {
  if (!/^\d{13}$/.test(number)) return false
  // Two-digit year: the latest one that is not in the future.
  const today = new Date().getUTCFullYear()
  let year = Number(number.slice(0, 2)) + 100 * Math.floor(today / 100)
  if (year > today) year -= 100
  return (
    isDate(year, Number(number.slice(2, 4)), Number(number.slice(4, 6))) &&
    '01'.includes(number[10]) &&
    isLuhnValid(number)
  )
}

export const IDENTITY_COUNTRIES: readonly (NumberCountry & { name: string })[] = [
  {
    code: 'BE',
    name: 'Belgium',
    types: [
      idType({
        id: 'nn',
        name: 'Rijksregisternummer',
        badge: 'NN',
        label: 'National register number (numéro national)',
        algorithm: 'Two check digits: 97 minus the first nine digits modulo 97',
        stdnum: 'stdnum.be.nn',
        pattern: /^\d{11}$/,
        notations: ['99.99.99-999.99'],
        checkIndex: 9,
        format: n => `${split(n.slice(0, 6), [2, 4], '.')}-${split(n.slice(6), [3], '.')}`,
        encodes: ['birthDate', 'sex'],
        isValid: isValidNn,
        candidate: nnCandidate,
      }),
      idType({
        id: 'eid',
        name: 'eID card number',
        badge: 'eID',
        label: 'Identity card number',
        algorithm: 'Two check digits: the first ten digits modulo 97 (97 instead of 00)',
        stdnum: 'stdnum.be.eid',
        pattern: /^\d{12}$/,
        notations: ['999-9999999-99'],
        checkIndex: 10,
        format: n => split(n, [3, 10], '-'),
        isValid: n =>
          /^\d{12}$/.test(n) && Number(n) > 0 && eidCheck(n.slice(0, 10)) === n.slice(10),
        candidate: () => {
          const body = randomDigits(10)
          return body + eidCheck(body)
        },
      }),
    ],
  },
  {
    code: 'BR',
    name: 'Brazil',
    types: [fromTaxIds('BR', 'cpf', 'stdnum.br.cpf')],
  },
  {
    code: 'BG',
    name: 'Bulgaria',
    types: [
      idType({
        id: 'egn',
        name: 'ЕГН',
        badge: 'EGN',
        label: 'Единен граждански номер (uniform civil number)',
        algorithm: 'Weighted sum (2, 4, 8, 5, 10, 9, 7, 3, 6) modulo 11',
        stdnum: 'stdnum.bg.egn',
        pattern: /^\d{10}$/,
        notations: ['9999999999'],
        encodes: ['birthDate'],
        isValid: isValidEgn,
        candidate: person => {
          // 40 is added to the month of people born from 2000.
          const body =
            yymmdd(person, dateParts(person.birthDate).year >= 2000 ? 40 : 0) + randomDigits(3)
          return body + egnCheck(body)
        },
      }),
      idType({
        id: 'pnf',
        name: 'ЛНЧ',
        badge: 'PNF',
        label: 'Личен номер на чужденец (personal number of a foreigner)',
        algorithm: 'Weighted sum (21, 19, 17, 13, 11, 9, 7, 3, 1) modulo 10',
        stdnum: 'stdnum.bg.pnf',
        pattern: /^\d{10}$/,
        notations: ['9999999999'],
        isValid: n => /^\d{10}$/.test(n) && pnfCheck(n) === n[9],
        candidate: () => {
          const body = randomDigits(9)
          return body + pnfCheck(body)
        },
      }),
    ],
  },
  {
    code: 'HR',
    name: 'Croatia',
    types: [fromTaxIds('HR', 'vat', 'stdnum.hr.oib', { id: 'oib', notations: ['99999999999'] })],
  },
  {
    code: 'CZ',
    name: 'Czechia',
    types: [
      idType({
        ...RODNE_CISLO,
        label: 'Birth number (ten digits, for people born from 1954)',
        stdnum: 'stdnum.cz.rc',
      }),
    ],
  },
  {
    code: 'EE',
    name: 'Estonia',
    types: [
      idType({
        id: 'ik',
        name: 'Isikukood',
        badge: 'IK',
        label: 'Personal identification code',
        algorithm: 'Weighted sum modulo 11 (weights 1 to 9, then 3 to 9 and 1 to 3)',
        stdnum: 'stdnum.ee.ik',
        pattern: /^\d{11}$/,
        notations: ['99999999999'],
        encodes: ['birthDate', 'sex'],
        isValid: n => /^\d{11}$/.test(n) && ikBirthDateIsValid(n) && ikCheck(n) === n[10],
        candidate: ikCandidate,
      }),
    ],
  },
  {
    code: 'FI',
    name: 'Finland',
    compact: input => input.replace(/\s/g, ''),
    types: [
      idType({
        id: 'hetu',
        name: 'Henkilötunnus',
        badge: 'HETU',
        label: 'Personal identity code',
        algorithm: 'Check character: the nine digits modulo 31',
        stdnum: 'stdnum.fi.hetu',
        pattern: /^\d{6}[-+ABCDEFYXWVU]\d{3}[0-9A-Y]$/,
        notations: ['999999-999X (a digit or a letter at the end)'],
        encodes: ['birthDate'],
        isValid: isValidHetu,
        candidate: person => {
          const sign = dateParts(person.birthDate).year >= 2000 ? 'A' : '-'
          const individual = pad3(2 + randomInt(898))
          const digits = ddmmyy(person) + individual
          return ddmmyy(person) + sign + individual + HETU_CONTROL[Number(digits) % 31]
        },
      }),
    ],
  },
  {
    code: 'IS',
    name: 'Iceland',
    types: [
      idType({
        id: 'kennitala',
        name: 'Kennitala',
        label: 'Identification number of a person',
        algorithm: 'Weighted sum (3, 2, 7, 6, 5, 4, 3, 2) modulo 11, in the ninth digit',
        stdnum: 'stdnum.is_.kennitala',
        pattern: /^\d{10}$/,
        notations: ['999999-9999'],
        checkIndex: 8,
        format: n => split(n, [6], '-'),
        encodes: ['birthDate'],
        isValid: isValidKennitala,
        candidate: person => {
          const body = ddmmyy(person) + randomDigits(2)
          const check = mod(-weightedSum(body, [3, 2, 7, 6, 5, 4, 3, 2]), 11)
          const century = dateParts(person.birthDate).year >= 2000 ? '0' : '9'
          return check === 10 ? '' : body + check + century
        },
      }),
    ],
  },
  {
    code: 'IN',
    name: 'India',
    types: [
      idType({
        id: 'aadhaar',
        name: 'Aadhaar',
        label: 'Aadhaar number',
        algorithm: 'Verhoeff check digit',
        stdnum: 'stdnum.in_.aadhaar',
        pattern: /^\d{12}$/,
        notations: ['9999 9999 9999'],
        format: n => split(n, [4, 8], ' '),
        isValid: isValidAadhaar(12),
        candidate: aadhaarCandidate(12),
      }),
      idType({
        id: 'vid',
        name: 'Aadhaar VID',
        badge: 'VID',
        label: 'Aadhaar virtual ID',
        algorithm: 'Verhoeff check digit',
        stdnum: 'stdnum.in_.vid',
        pattern: /^\d{16}$/,
        notations: ['9999 9999 9999 9999'],
        format: n => split(n, [4, 8, 12], ' '),
        isValid: isValidAadhaar(16),
        candidate: aadhaarCandidate(16),
      }),
    ],
  },
  {
    code: 'IL',
    name: 'Israel',
    // Shorter numbers are written without their leading zeros.
    compact: input => input.replace(/[\s-]/g, '').padStart(9, '0'),
    types: [
      idType({
        id: 'idnr',
        name: 'Mispar Zehut',
        badge: 'ID',
        label: 'Identity number (מספר זהות)',
        algorithm: 'Luhn (mod 10)',
        stdnum: 'stdnum.il.idnr',
        pattern: /^\d{9}$/,
        notations: ['99999999-9'],
        format: n => split(n, [8], '-'),
        isValid: n => /^\d{9}$/.test(n) && Number(n) > 0 && isLuhnValid(n),
        candidate: () => {
          const body = randomDigits(8)
          return body + luhnCheckDigit(body)
        },
      }),
    ],
  },
  {
    code: 'JP',
    name: 'Japan',
    types: [
      idType({
        id: 'mynumber',
        name: 'My Number',
        label: 'Individual number (個人番号)',
        algorithm: 'Weighted sum (6 to 2, then 7 to 2) modulo 11',
        stdnum: 'stdnum.jp.in_',
        pattern: /^\d{12}$/,
        notations: ['9999 9999 9999'],
        format: n => split(n, [4, 8], ' '),
        isValid: n => /^\d{12}$/.test(n) && myNumberCheck(n) === n[11],
        candidate: () => {
          const body = randomDigits(11)
          return body + myNumberCheck(body)
        },
      }),
    ],
  },
  {
    code: 'LT',
    name: 'Lithuania',
    types: [
      idType({
        id: 'asmens',
        name: 'Asmens kodas',
        badge: 'AK',
        label: 'Personal code',
        algorithm: 'Weighted sum modulo 11 (weights 1 to 9, then 3 to 9 and 1 to 3)',
        stdnum: 'stdnum.lt.asmens',
        pattern: /^\d{11}$/,
        notations: ['99999999999'],
        encodes: ['birthDate', 'sex'],
        // Codes starting with 9 hold no birth date.
        isValid: n =>
          /^\d{11}$/.test(n) && (n[0] === '9' || ikBirthDateIsValid(n)) && ikCheck(n) === n[10],
        candidate: ikCandidate,
      }),
    ],
  },
  {
    code: 'NO',
    name: 'Norway',
    types: [
      idType({
        id: 'fnr',
        name: 'Fødselsnummer',
        badge: 'FNR',
        label: 'Birth number',
        algorithm: 'Two modulo 11 check digits',
        stdnum: 'stdnum.no.fodselsnummer',
        pattern: /^\d{11}$/,
        notations: ['999999 99999'],
        checkIndex: 9,
        format: n => split(n, [6], ' '),
        encodes: ['birthDate', 'sex'],
        isValid: isValidFodselsnummer,
        candidate: person => {
          // Individual numbers below 500 are for the 1900s, from 500 for people born from 2000;
          // the last digit is odd for men and even for women.
          const from2000 = dateParts(person.birthDate).year >= 2000
          const individual = randomWithParity(
            from2000 ? 500 : 0,
            from2000 ? 999 : 499,
            isMale(person)
          )
          const body = ddmmyy(person) + pad3(individual)
          const first = fnrCheck1(body)
          const second = fnrCheck2(body + first)
          return first.length > 1 || second.length > 1 ? '' : body + first + second
        },
      }),
    ],
  },
  {
    code: 'PE',
    name: 'Peru',
    types: [
      idType({
        id: 'cui',
        name: 'DNI',
        label: 'Documento Nacional de Identidad (CUI, with its check character)',
        algorithm: 'Weighted sum (3, 2, 7, 6, 5, 4, 3, 2) modulo 11',
        stdnum: 'stdnum.pe.cui',
        pattern: /^\d{8}[0-9A-K]$/,
        notations: ['99999999-9', '99999999-A (a letter from A to K)'],
        format: n => split(n, [8], '-'),
        isValid: n => /^\d{8}[0-9A-K]$/.test(n) && cuiChecks(n).includes(n[8]),
        candidate: () => {
          const body = randomDigits(8)
          return body + cuiChecks(body)[0]
        },
      }),
    ],
  },
  {
    code: 'PL',
    name: 'Poland',
    types: [
      idType({
        id: 'pesel',
        name: 'PESEL',
        label: 'National identification number',
        algorithm: 'Weighted sum (1, 3, 7, 9, 1, 3, 7, 9, 1, 3) modulo 10',
        stdnum: 'stdnum.pl.pesel',
        pattern: /^\d{11}$/,
        notations: ['99999999999'],
        encodes: ['birthDate', 'sex'],
        isValid: isValidPesel,
        candidate: person => {
          // 20 is added to the month of people born from 2000; the tenth digit is odd for men.
          const body =
            yymmdd(person, dateParts(person.birthDate).year >= 2000 ? 20 : 0) +
            randomDigits(3) +
            randomWithParity(0, 9, isMale(person))
          return body + peselCheck(body)
        },
      }),
    ],
  },
  {
    code: 'PT',
    name: 'Portugal',
    types: [
      idType({
        id: 'cc',
        name: 'Cartão de Cidadão',
        badge: 'CC',
        label: 'Número de documento do Cartão de Cidadão',
        algorithm: 'Luhn (mod 10) over digits and letters, where A is 10 and Z is 35',
        stdnum: 'stdnum.pt.cc',
        document: {
          title:
            'Agência para a Modernização Administrativa, Validação de Número de Documento do Cartão de Cidadão (2009)',
          url: 'https://www.autenticacao.gov.pt/documents/20126/0/Valida%C3%A7%C3%A3o+de+N%C3%BAmero+de+Documento+do+Cart%C3%A3o+de+Cidad%C3%A3o+(1).pdf/7d5745ba-2bcc-e861-3954-bafe9f7591a0',
        },
        pattern: /^\d{9}[A-Z0-9]{2}\d$/,
        notations: ['99999999 9 AA9 (two letters or digits before the last digit)'],
        format: n => `${n.slice(0, 8)} ${n[8]} ${n.slice(9)}`,
        isValid: n => /^\d{9}[A-Z0-9]{2}\d$/.test(n) && ccCheckDigit(n.slice(0, 11)) === n[11],
        candidate: () => {
          // The civil identification number and its own check digit (whose algorithm is not
          // published, so it is random), then the card's version, which counts down from ZZ.
          const body = randomDigits(9) + 'Z' + randomChar(UPPER)
          return body + ccCheckDigit(body)
        },
      }),
    ],
  },
  {
    code: 'SK',
    name: 'Slovakia',
    types: [
      idType({
        ...RODNE_CISLO,
        label: 'Birth number (ten digits, for people born from 1954)',
        stdnum: 'stdnum.sk.rc',
      }),
    ],
  },
  {
    code: 'ZA',
    name: 'South Africa',
    types: [
      idType({
        id: 'idnr',
        name: 'ID number',
        badge: 'ID',
        label: 'Identity number',
        algorithm: 'Luhn (mod 10)',
        stdnum: 'stdnum.za.idnr',
        pattern: /^\d{13}$/,
        notations: ['9999999999999'],
        format: n => split(n, [6, 10, 12], ' '),
        encodes: ['birthDate', 'sex'],
        isValid: isValidZaId,
        candidate: person => {
          // A sequence number from 5000 for men, 0 for a citizen or 1 for a permanent resident.
          const sequence = String(randomInt(5000) + (isMale(person) ? 5000 : 0)).padStart(4, '0')
          const body = yymmdd(person) + sequence + randomInt(2) + '8'
          return body + luhnCheckDigit(body)
        },
      }),
    ],
  },
  {
    code: 'KR',
    name: 'South Korea',
    types: [
      idType({
        id: 'rrn',
        name: 'RRN',
        label: 'Resident registration number (주민등록번호)',
        algorithm: 'Weighted sum (2 to 9, then 2 to 5) modulo 11',
        stdnum: 'stdnum.kr.rrn',
        pattern: /^\d{13}$/,
        notations: ['999999-9999999'],
        format: n => split(n, [6], '-'),
        encodes: ['birthDate', 'sex'],
        isValid: isValidRrn,
        candidate: person => {
          // 1 and 2 are men and women born in the 1900s, 3 and 4 those born from 2000.
          const first =
            (dateParts(person.birthDate).year >= 2000 ? 3 : 1) + (isMale(person) ? 0 : 1)
          const body = yymmdd(person) + first + pad2(randomInt(97)) + randomDigits(3)
          return body + rrnCheck(body)
        },
      }),
    ],
  },
  {
    code: 'ES',
    name: 'Spain',
    types: [
      fromTaxIds('ES', 'dni', 'stdnum.es.dni', { notations: ['99999999A'] }),
      fromTaxIds('ES', 'nie', 'stdnum.es.nie', {
        notations: ['X9999999A (starting with X, Y or Z)'],
      }),
    ],
  },
  {
    code: 'SE',
    name: 'Sweden',
    compact: compactPersonnummer,
    types: [
      idType({
        id: 'personnummer',
        name: 'Personnummer',
        badge: 'PNR',
        label: 'Personal identity number',
        algorithm: 'Luhn (mod 10) over the ten digits',
        stdnum: 'stdnum.se.personnummer',
        pattern: /^(\d{2})?\d{6}[-+]\d{4}$/,
        notations: ['999999-9999', '99999999-9999'],
        encodes: ['birthDate', 'sex'],
        isValid: isValidPersonnummer,
        candidate: person => {
          // The third digit of the serial is odd for men and even for women.
          const body = yymmdd(person) + randomDigits(2) + randomWithParity(0, 9, isMale(person))
          // A plus replaces the dash from the year the person turns 100.
          const turned100 = new Date().getUTCFullYear() - dateParts(person.birthDate).year >= 100
          return `${body.slice(0, 6)}${turned100 ? '+' : '-'}${body.slice(6)}${luhnCheckDigit(body)}`
        },
      }),
    ],
  },
  {
    code: 'TH',
    name: 'Thailand',
    types: [
      idType({
        id: 'pin',
        name: 'PIN',
        label: 'Personal identification number (เลขประจำตัวประชาชน)',
        algorithm: 'Weighted sum (13 to 2) modulo 11',
        stdnum: 'stdnum.th.pin',
        pattern: /^\d{13}$/,
        notations: ['9-9999-99999-99-9'],
        format: n => split(n, [1, 5, 10, 12], '-'),
        isValid: n => /^[1-8]\d{12}$/.test(n) && pinCheck(n) === n[12],
        candidate: () => {
          const body = randomChar('12345678') + randomDigits(11)
          return body + pinCheck(body)
        },
      }),
    ],
  },
  {
    code: 'TR',
    name: 'Türkiye',
    types: [fromTaxIds('TR', 'tckn', 'stdnum.tr.tckimlik')],
  },
]
