/** Shared check-digit algorithms, ported from python-stdnum (stdnum.luhn, stdnum.iso7064). */

/** Mathematical modulo: always in [0, n), like Python's `%` (JavaScript's `%` keeps the sign). */
export function mod(value: number, n: number): number {
  return ((value % n) + n) % n
}

/** Sum of each digit multiplied by the weight at the same position. */
export function weightedSum(digits: string, weights: readonly number[]): number {
  let sum = 0
  for (let i = 0; i < weights.length; i++) sum += weights[i] * Number(digits[i])
  return sum
}

/** Luhn (mod 10) checksum: 0 for a valid number. */
export function luhnChecksum(digits: string): number {
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let digit = Number(digits[digits.length - 1 - i])
    if (i % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return sum % 10
}

export function isLuhnValid(digits: string): boolean {
  return luhnChecksum(digits) === 0
}

/** Digit that makes `body + digit` Luhn-valid. */
export function luhnCheckDigit(body: string): string {
  return String(mod(-luhnChecksum(body + '0'), 10))
}

/** ISO 7064 Mod 11, 10 checksum: 1 for a valid number. */
export function mod11_10Checksum(digits: string): number {
  let check = 5
  for (const digit of digits) check = ((((check || 10) * 2) % 11) + Number(digit)) % 10
  return check
}

export function isMod11_10Valid(digits: string): boolean {
  return mod11_10Checksum(digits) === 1
}

/** Digit that makes `body + digit` valid under ISO 7064 Mod 11, 10. */
export function mod11_10CheckDigit(body: string): string {
  return String(mod(1 - (((mod11_10Checksum(body) || 10) * 2) % 11), 10))
}

/** ISO 7064 Mod 97, 10 over an alphanumeric string (letters count as 10–35), computed in chunks. */
export function mod97(value: string): number {
  const digits = [...value].map(c => String(Number.parseInt(c, 36))).join('')
  let remainder = 0
  for (let i = 0; i < digits.length; i += 7)
    remainder = Number(remainder + digits.slice(i, i + 7)) % 97
  return remainder
}

// The multiplication and permutation tables of the Verhoeff algorithm (stdnum.verhoeff).
const VERHOEFF_MULTIPLICATION = [
  '0123456789',
  '1234067895',
  '2340178956',
  '3401289567',
  '4012395678',
  '5987604321',
  '6598710432',
  '7659821043',
  '8765932104',
  '9876543210',
]
const VERHOEFF_PERMUTATION = [
  '0123456789',
  '1576283094',
  '5803796142',
  '8916043527',
  '9453126870',
  '4286573901',
  '2793806415',
  '7046913258',
]

/** Verhoeff checksum: 0 for a valid number. */
export function verhoeffChecksum(digits: string): number {
  let check = 0
  for (let i = 0; i < digits.length; i++) {
    const digit = Number(digits[digits.length - 1 - i])
    check = Number(VERHOEFF_MULTIPLICATION[check][Number(VERHOEFF_PERMUTATION[i % 8][digit])])
  }
  return check
}

/** Digit that makes `body + digit` valid under the Verhoeff algorithm. */
export function verhoeffCheckDigit(body: string): string {
  return String(VERHOEFF_MULTIPLICATION[verhoeffChecksum(body + '0')].indexOf('0'))
}

/** Zero-pads a number to two digits. */
export function pad2(value: number): string {
  return String(value).padStart(2, '0')
}
