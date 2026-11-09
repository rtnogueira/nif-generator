import { isValidNif } from '@/lib/nif'
import {
  VAT_COUNTRIES,
  type VatCountry,
  type VatCountryCode,
  type VatFormat,
} from './vat-countries'

/** Character classes of the VIES notation legend. */
const VIES_LEGEND: Record<string, string> = {
  '9': '\\d',
  X: '[A-Z0-9]',
  S: '[A-Z0-9+*]',
  L: '[A-Z]',
}

/** Builds the regex for a VIES notation: legend symbols become classes, spaces are dropped, the rest is literal. */
export function viesNotationToRegExp(notation: string): RegExp {
  let source = ''
  for (const char of notation.replace(/\s/g, '')) {
    source += VIES_LEGEND[char] ?? char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  }
  return new RegExp(`^${source}$`)
}

export function formatPattern(format: VatFormat): RegExp {
  return format.pattern ?? viesNotationToRegExp(format.notation)
}

const COUNTRIES_BY_CODE = new Map<string, VatCountry>(VAT_COUNTRIES.map(c => [c.code, c]))

export function getVatCountry(code: string): VatCountry | undefined {
  return COUNTRIES_BY_CODE.get(code.toUpperCase())
}

export function isVatCountryCode(value: string): value is VatCountryCode {
  return COUNTRIES_BY_CODE.has(value)
}

/** Uppercases and removes the separators people commonly type (spaces, dots, dashes). */
export function normalizeVatNumber(input: string): string {
  return input.toUpperCase().replace(/[\s.-]/g, '')
}

export type VatValidation =
  | { status: 'empty' }
  /** No country was chosen and the input does not start with a supported prefix. */
  | { status: 'unknown-country' }
  | { status: 'invalid-format'; country: VatCountry; number: string }
  | { status: 'invalid-check-digit'; country: VatCountry; number: string }
  | { status: 'valid'; country: VatCountry; number: string }

/**
 * Checks a VAT number against the official structure of its country (and the check digit, where
 * supported). `countryCode` is optional: without it the country is taken from the number's prefix.
 * The prefix is optional when a country is given.
 */
export function validateVatNumber(input: string, countryCode?: string): VatValidation {
  const value = normalizeVatNumber(input)
  if (!value) return { status: 'empty' }

  const country = countryCode ? getVatCountry(countryCode) : getVatCountry(value.slice(0, 2))
  if (!country) return { status: 'unknown-country' }

  const number = value.startsWith(country.code) ? value.slice(country.code.length) : value
  if (!country.formats.some(format => formatPattern(format).test(number))) {
    return { status: 'invalid-format', country, number }
  }
  if (country.code === 'PT' && !isValidNif(number)) {
    return { status: 'invalid-check-digit', country, number }
  }
  return { status: 'valid', country, number }
}
