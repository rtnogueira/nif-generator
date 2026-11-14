import { generateNumbers, type NumberFamily } from '@/lib/numbers/family'
import { getVatCountry } from '@/lib/vat'
import { TAX_ID_COUNTRIES, type TaxIdCountry, type TaxIdType } from './countries'
import { getValidatorCountry, validateTaxNumber, VALIDATOR_COUNTRIES } from './validate'

export { TAX_ID_COUNTRIES, type TaxIdCountry, type TaxIdType }

export type TaxIdCountryCode = (typeof TAX_ID_COUNTRIES)[number]['code']

export const DEFAULT_TAX_ID_COUNTRY: TaxIdCountryCode = 'PT'
/** Portugal's default type is the most common individual NIF prefix. */
export const DEFAULT_TAX_ID_TYPE = '2'

const COUNTRIES_BY_CODE = new Map<string, TaxIdCountry>(TAX_ID_COUNTRIES.map(c => [c.code, c]))

export function isTaxIdCountryCode(value: string): value is TaxIdCountryCode {
  return COUNTRIES_BY_CODE.has(value)
}

export function getTaxIdCountry(code: TaxIdCountryCode): TaxIdCountry {
  const country = COUNTRIES_BY_CODE.get(code)
  if (!country) throw new Error(`No tax number generator for ${code}`)
  return country
}

/** True for countries in the EU's VIES system, whose numbers take a VAT prefix. */
export function isViesCountry(code: string): boolean {
  return getVatCountry(code) !== undefined
}

/** English country name: from the VIES table for VIES countries, otherwise from the generator. */
export function getTaxIdCountryName(code: TaxIdCountryCode): string {
  return getVatCountry(code)?.name ?? getTaxIdCountry(code).name ?? code
}

export function getTaxIdType(code: TaxIdCountryCode, typeId: string): TaxIdType | undefined {
  return getTaxIdCountry(code).types.find(type => type.id === typeId)
}

/**
 * Generates `count` distinct numbers (count is clamped to the supported range), with `generate`,
 * which defaults to the type's valid numbers (see `taxIdGenerator` for invalid ones).
 */
export const generateTaxIds = generateNumbers

/** Tax numbers as a family, for the generator and validator pages. */
export const TAX_FAMILY: NumberFamily = {
  id: 'tax',
  noun: 'tax number',
  slug: 'tax-numbers',
  countries: VALIDATOR_COUNTRIES,
  defaultCountry: DEFAULT_TAX_ID_COUNTRY,
  defaultType: DEFAULT_TAX_ID_TYPE,
  detectsCountry: true,
  getCountry: getValidatorCountry,
  validate: validateTaxNumber,
}

export { getExpectedFormats, type ExpectedFormat } from '@/lib/numbers/family'
export type { GeneratedBatch } from '@/lib/numbers/variants'
export {
  getValidatorCountry,
  validateTaxNumber,
  VALIDATOR_COUNTRIES,
  type TaxNumberValidation,
  type ValidatorCountry,
} from './validate'
export {
  checkPosition,
  displayTaxId,
  isValidity,
  taxIdGenerator,
  VALIDITIES,
  type DisplayOptions,
  type Validity,
} from './variants'
