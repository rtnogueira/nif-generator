import {
  generateNumbers,
  getFamilyType,
  type FamilyCountry,
  type NumberFamily,
} from '@/lib/numbers/family'
import { clampQuantity, MIN_QUANTITY } from '@/lib/numbers/quantity'
import {
  displayNumber,
  isValidity,
  numberGenerator,
  type GeneratedBatch,
  type Validity,
} from '@/lib/numbers/variants'

/** Country prefix a number can be shown with: the VIES prefix of VIES countries. */
export const countryPrefix = (country: FamilyCountry | undefined) => country?.vat?.code

export interface NifOptions {
  country: string
  typeId: string
  quantity: number
  /** Add the VIES country prefix (VIES countries only). */
  withPrefix: boolean
  /** Write numbers in their usual form (types with a formatter only). */
  formatted: boolean
  validity: Validity
}

export function defaultOptions(family: NumberFamily): NifOptions {
  return {
    country: family.defaultCountry,
    typeId: family.defaultType,
    quantity: MIN_QUANTITY,
    withPrefix: false,
    formatted: false,
    validity: 'valid',
  }
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
export function optionsFromSearch(
  family: NumberFamily,
  search: GeneratorSearch
): NifOptions | null {
  const country = family.getCountry(search.country?.toUpperCase() ?? '')
  if (!country) return null
  const type = country.types.find(t => t.id === search.type) ?? country.types[0]
  const quantity = Number.parseInt(search.qty ?? '', 10)
  return {
    country: country.code,
    typeId: type.id,
    quantity: Number.isFinite(quantity) ? clampQuantity(quantity) : MIN_QUANTITY,
    withPrefix: Boolean(countryPrefix(country)) && search.prefix === '1',
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

export function generateBatch(family: NumberFamily, options: NifOptions): GeneratedBatch | null {
  const { country, typeId, quantity, validity } = options
  const type = getFamilyType(family, country, typeId)
  if (!type) return null
  const prefix = countryPrefix(family.getCountry(country))
  const numbers = generateNumbers(
    type,
    quantity,
    numberGenerator(family.validate, country, type, validity)
  )
  return {
    family,
    country,
    type,
    validity,
    numbers: numbers.map(number => displayNumber(prefix, type, number, options)),
  }
}
