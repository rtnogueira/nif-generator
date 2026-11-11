import { clampQuantity, MIN_QUANTITY } from '@/lib/nif'
import {
  DEFAULT_TAX_ID_COUNTRY,
  DEFAULT_TAX_ID_TYPE,
  displayTaxId,
  generateTaxIds,
  getTaxIdCountry,
  getTaxIdType,
  isTaxIdCountryCode,
  isValidity,
  isViesCountry,
  taxIdGenerator,
  type GeneratedBatch,
  type TaxIdCountryCode,
  type Validity,
} from '@/lib/tax-id'

export interface NifOptions {
  country: TaxIdCountryCode
  typeId: string
  quantity: number
  /** Add the VIES country prefix (VIES countries only). */
  withPrefix: boolean
  /** Write numbers in their usual form (types with a formatter only). */
  formatted: boolean
  validity: Validity
}

export const DEFAULT_OPTIONS: NifOptions = {
  country: DEFAULT_TAX_ID_COUNTRY,
  typeId: DEFAULT_TAX_ID_TYPE,
  quantity: MIN_QUANTITY,
  withPrefix: false,
  formatted: false,
  validity: 'valid',
}

/** The generator's URL search params, e.g. `?country=BR&type=cpf&qty=20&format=1`. */
export interface GeneratorSearch {
  country?: string
  type?: string
  qty?: string
  prefix?: string
  format?: string
  validity?: string
}

const SEARCH_KEYS = ['country', 'type', 'qty', 'prefix', 'format', 'validity'] as const

/**
 * Keeps the known params, as strings (the router's decoder turns `qty=3` into a number); anything
 * else in the URL is dropped. Never throws.
 */
export function validateGeneratorSearch(search: Record<string, unknown>): GeneratorSearch {
  const result: GeneratorSearch = {}
  for (const key of SEARCH_KEYS) {
    const value = search[key]
    if (['string', 'number', 'boolean'].includes(typeof value) && value !== '') {
      result[key] = String(value)
    }
  }
  return result
}

/**
 * The options a URL asks for, or null when it names no supported country. Unknown types, invalid
 * quantities and options that do not apply fall back to their defaults.
 */
export function optionsFromSearch(search: GeneratorSearch): NifOptions | null {
  const country = search.country?.toUpperCase()
  if (!country || !isTaxIdCountryCode(country)) return null
  const types = getTaxIdCountry(country).types
  const type = types.find(t => t.id === search.type) ?? types[0]
  const quantity = Number.parseInt(search.qty ?? '', 10)
  return {
    country,
    typeId: type.id,
    quantity: Number.isFinite(quantity) ? clampQuantity(quantity) : MIN_QUANTITY,
    withPrefix: isViesCountry(country) && search.prefix === '1',
    formatted: Boolean(type.format) && search.format === '1',
    validity: isValidity(search.validity) ? search.validity : 'valid',
  }
}

/** The URL search params for `options`, leaving out the ones at their default. */
export function searchFromOptions(options: NifOptions): GeneratorSearch {
  return {
    country: options.country,
    type: options.typeId,
    qty: String(options.quantity),
    prefix: options.withPrefix ? '1' : undefined,
    format: options.formatted ? '1' : undefined,
    validity: options.validity === 'valid' ? undefined : options.validity,
  }
}

export function generateBatch(options: NifOptions): GeneratedBatch | null {
  const { country, typeId, quantity, validity } = options
  const type = getTaxIdType(country, typeId)
  if (!type) return null
  const numbers = generateTaxIds(type, quantity, taxIdGenerator(country, type, validity))
  return {
    country,
    type,
    validity,
    numbers: numbers.map(number => displayTaxId(country, type, number, options)),
  }
}
