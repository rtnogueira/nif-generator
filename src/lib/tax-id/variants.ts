/**
 * What the generator can produce besides plain valid numbers: deliberately invalid numbers (for
 * testing that forms reject them) and the written form of a number.
 */
import { randomChar, randomChoice, randomDigits } from '@/lib/random'
import { getVatCountry } from '@/lib/vat'
import type { TaxIdType } from './countries'
import { validateTaxNumber } from './validate'

export const VALIDITIES = ['valid', 'invalid-check-digit', 'invalid-length'] as const
export type Validity = (typeof VALIDITIES)[number]

export function isValidity(value: unknown): value is Validity {
  return VALIDITIES.includes(value as Validity)
}

/** Index of the (first) check character of a number of `type`. */
export function checkPosition(type: TaxIdType, number: string): number {
  return type.checkIndex ?? number.length - 1
}

const DIGITS = '0123456789'
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

/** A different character of the same kind: digit for a digit, letter for a letter. */
function otherChar(char: string): string {
  const pool = (DIGITS.includes(char) ? DIGITS : LETTERS).replace(char, '')
  return randomChar(pool)
}

/** Changes the check character, so the number keeps its format but fails the check. */
function changeCheckCharacter(type: TaxIdType): string {
  const number = type.generate()
  const index = checkPosition(type, number)
  return number.slice(0, index) + otherChar(number[index]) + number.slice(index + 1)
}

/**
 * Adds or removes digits inside the number. Large steps are included because some countries
 * accept a range of lengths (2 to 10 digits in Romania, 7 to 15 in Colombia).
 */
const LENGTH_CHANGES = [-2, -1, 1, 2, 3, 7] as const

function changeLength(type: TaxIdType): string {
  const number = type.generate()
  const digitPositions = [...number].flatMap((char, i) => (DIGITS.includes(char) ? [i] : []))
  const change = randomChoice(LENGTH_CHANGES)
  const at = randomChoice(digitPositions)
  return change > 0
    ? number.slice(0, at) + randomDigits(change) + number.slice(at)
    : number.slice(0, at) + number.slice(at - change) // removes -change characters from `at`
}

const MAX_ATTEMPTS = 1000

const INVALID: Record<
  Exclude<Validity, 'valid'>,
  { make: (type: TaxIdType) => string; status: string }
> = {
  'invalid-check-digit': { make: changeCheckCharacter, status: 'invalid-check-digit' },
  'invalid-length': { make: changeLength, status: 'invalid-format' },
}

/**
 * A generator of numbers of `type` with the given validity. Invalid candidates are confirmed by the
 * site's own validator, so an "invalid check digit" number is one the validator reports as such.
 */
export function taxIdGenerator(countryCode: string, type: TaxIdType, validity: Validity) {
  if (validity === 'valid') return type.generate
  const { make, status } = INVALID[validity]
  return () => {
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
      const number = make(type)
      if (validateTaxNumber(number, countryCode).status === status) return number
    }
    throw new Error(`Could not generate an ${validity} ${countryCode} ${type.id} number`)
  }
}

export interface DisplayOptions {
  validity: Validity
  /** Write the number in its usual form (e.g. 390.533.447-05), when the type has one. */
  formatted: boolean
  /** Add the VIES country prefix, for VIES countries. */
  withPrefix: boolean
}

/** A generated number as shown, copied and exported: formatted and prefixed as requested. */
export function displayTaxId(
  countryCode: string,
  type: TaxIdType,
  number: string,
  { validity, formatted, withPrefix }: DisplayOptions
): string {
  // A number of the wrong length has no written form.
  const shown =
    formatted && type.format && validity !== 'invalid-length' ? type.format(number) : number
  return withPrefix && getVatCountry(countryCode) ? countryCode + shown : shown
}
