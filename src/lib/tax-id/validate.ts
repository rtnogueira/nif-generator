import { isValidNif } from '@/lib/nif'
import type { FamilyCountry, NumberValidation } from '@/lib/numbers/family'
import { getVatCountry, normalizeVatNumber, validateVatNumber } from '@/lib/vat'
import { TAX_ID_COUNTRIES, type TaxIdType } from './countries'

/** A country the validator accepts: every country the generator supports. */
export type ValidatorCountry = FamilyCountry

export const VALIDATOR_COUNTRIES: readonly ValidatorCountry[] = TAX_ID_COUNTRIES.map(country => {
  const vat = getVatCountry(country.code)
  return {
    code: country.code,
    name: vat?.name ?? ('name' in country ? country.name : country.code),
    vat,
    types: country.types,
  }
})

const COUNTRIES_BY_CODE = new Map(VALIDATOR_COUNTRIES.map(c => [c.code, c]))

export function getValidatorCountry(code: string): ValidatorCountry | undefined {
  return COUNTRIES_BY_CODE.get(code)
}

export type TaxNumberValidation = NumberValidation

/** Country-specific ways of writing a number, reduced to the form its `isValid` expects. */
const COMPACT: Partial<Record<string, (value: string) => string>> = {
  // "CHE-123.456.789 MWST": the UID with an optional VAT suffix (MWST, TVA or IVA).
  CH: value => value.replace(/(MWST|TVA|IVA)$/, '').replace(/^(?=\d{9}$)/, 'CHE'),
  // "NO 123 456 789 MVA": the organisation number with the VAT prefix and suffix.
  NO: value => value.replace(/^NO(?=\d)/, '').replace(/MVA$/, ''),
}

/** Country of an input without a chosen country: from its VIES prefix, or "CHE" for Switzerland. */
function detectCountry(value: string): ValidatorCountry | undefined {
  if (value.startsWith('CHE')) return getValidatorCountry('CH')
  const vat = getVatCountry(value.slice(0, 2))
  return vat && getValidatorCountry(vat.code)
}

/**
 * Checks a tax number's format and, for the kinds this site generates, its check digit. Without a
 * `countryCode`, the country is taken from the number's VIES prefix (or "CHE" for Switzerland).
 */
export function validateTaxNumber(input: string, countryCode?: string): TaxNumberValidation {
  const value = normalizeVatNumber(input)
  if (!value) return { status: 'empty' }

  const country = countryCode ? getValidatorCountry(countryCode) : detectCountry(value)
  if (!country) return { status: 'unknown-country' }

  if (country.vat) {
    const format = validateVatNumber(value, country.code)
    if (format.status === 'valid') return checkDigits(country, format.number, true)
    const number = format.status === 'invalid-format' ? format.number : value
    return { status: 'invalid-format', country, number }
  }
  return checkDigits(country, COMPACT[country.code]?.(value) ?? value, false)
}

function checkDigits(
  country: ValidatorCountry,
  number: string,
  formatChecked: boolean
): TaxNumberValidation {
  if (country.code === 'PT') return checkPortugal(country, number)

  const types = country.types.filter(type => type.pattern.test(number))
  if (types.length === 0) {
    // A VIES format this site has no algorithm for; outside VIES, no known format at all.
    return formatChecked
      ? { status: 'valid', country, number, verified: false }
      : { status: 'invalid-format', country, number }
  }
  const type = types.find(t => t.isValid(number))
  return type
    ? { status: 'valid', country, number, verified: true, type }
    : { status: 'invalid-check-digit', country, number, types }
}

/**
 * The NIF check digit does not depend on the taxpayer type, so any 9-digit number with a correct
 * one is valid. The type is the one with the longest matching prefix (e.g. 38 rather than 3).
 */
function checkPortugal(country: ValidatorCountry, number: string): TaxNumberValidation {
  const type = country.types
    .filter(t => t.pattern.test(number))
    .reduce<TaxIdType | undefined>(
      (best, t) => (t.badge.length > (best?.badge.length ?? 0) ? t : best),
      undefined
    )
  return isValidNif(number)
    ? { status: 'valid', country, number, verified: true, type }
    : { status: 'invalid-check-digit', country, number, types: country.types.slice(0, 1) }
}
