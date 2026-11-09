import { clampQuantity } from '@/lib/nif'
import { getVatCountry } from '@/lib/vat'
import { TAX_ID_COUNTRIES, type TaxIdCountry, type TaxIdType } from './countries'

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

/** English country name, from the VIES table (every generator country is a VIES country). */
export function getTaxIdCountryName(code: TaxIdCountryCode): string {
  return getVatCountry(code)?.name ?? code
}

export function getTaxIdType(code: TaxIdCountryCode, typeId: string): TaxIdType | undefined {
  return getTaxIdCountry(code).types.find(type => type.id === typeId)
}

/** A batch of generated numbers, as shown in the results. */
export interface GeneratedBatch {
  country: TaxIdCountryCode
  type: TaxIdType
  numbers: string[]
}

/** Generates `count` distinct numbers of a type (count is clamped to the supported range). */
export function generateTaxIds(type: TaxIdType, count: number): string[] {
  const unique = new Set<string>()
  const target = clampQuantity(count)
  while (unique.size < target) unique.add(type.generate())
  return [...unique]
}
