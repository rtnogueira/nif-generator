/**
 * A family of numbers (tax IDs, IBANs, identity numbers...) as the generator and validator pages
 * use it: its countries, each with one or more kinds of number, and how an input is validated.
 */
import type { VatCountry } from '@/lib/vat'
import { clampQuantity } from './quantity'
import type { NumberCountry, NumberType } from './types'

/** A country of a family, with its name resolved. */
export interface FamilyCountry {
  code: string
  name: string
  /** The VIES structure, for VIES countries of the tax family: their numbers take a prefix. */
  vat?: VatCountry
  /** See `NumberCountry.compact`. */
  compact?: (input: string) => string
  types: readonly NumberType[]
}

export type NumberValidation =
  | { status: 'empty' }
  /** No country was chosen and the input does not start with a supported prefix. */
  | { status: 'unknown-country' }
  | { status: 'invalid-format'; country: FamilyCountry; number: string }
  /** The number has the shape of `types`, but fails all their checks. */
  | {
      status: 'invalid-check-digit'
      country: FamilyCountry
      number: string
      types: readonly NumberType[]
    }
  /**
   * `verified` is false when only the format could be checked: the number is a kind whose check
   * digit this site does not verify. `type` is the kind that matched, when known.
   */
  | {
      status: 'valid'
      country: FamilyCountry
      number: string
      verified: boolean
      type?: NumberType
    }

export interface NumberFamily {
  id: string
  /** What one number is called in messages, e.g. "tax number". */
  noun: string
  /** Start of export file names, e.g. "tax-numbers". */
  slug: string
  countries: readonly FamilyCountry[]
  defaultCountry: string
  /** Type the default country starts with; other countries start with their first type. */
  defaultType: string
  /** True when `validate` can find the country in the number itself. */
  detectsCountry: boolean
  getCountry: (code: string) => FamilyCountry | undefined
  /** Checks an input's format and check digit, for `countryCode` or the country it names. */
  validate: (input: string, countryCode?: string) => NumberValidation
}

/** Uppercases and drops the separators numbers are usually written with. */
export function compact(input: string): string {
  return input.toUpperCase().replace(/[\s.\-/]/g, '')
}

interface FamilyDefinition {
  id: string
  noun: string
  slug: string
  countries: readonly (NumberCountry & { name: string })[]
  defaultCountry: string
  defaultType?: string
  /** Country code named by a compacted input, e.g. the first two letters of an IBAN. */
  detectCountry?: (value: string) => string | undefined
}

/** A family whose numbers are validated by shape (`pattern`) and then check digit (`isValid`). */
export function createFamily(definition: FamilyDefinition): NumberFamily {
  const countries: FamilyCountry[] = definition.countries.map(
    ({ code, name, types, compact: compactCountry }) => ({
      code,
      name,
      compact: compactCountry,
      types,
    })
  )
  const byCode = new Map(countries.map(country => [country.code, country]))
  const getCountry = (code: string) => byCode.get(code)
  const defaultCountry = getCountry(definition.defaultCountry)
  if (!defaultCountry) throw new Error(`${definition.id}: unknown default country`)

  return {
    id: definition.id,
    noun: definition.noun,
    slug: definition.slug,
    countries,
    defaultCountry: defaultCountry.code,
    defaultType: definition.defaultType ?? defaultCountry.types[0].id,
    detectsCountry: Boolean(definition.detectCountry),
    getCountry,
    validate(input, countryCode) {
      const compacted = compact(input)
      if (!compacted) return { status: 'empty' }
      const country = getCountry(countryCode ?? definition.detectCountry?.(compacted) ?? '')
      if (!country) return { status: 'unknown-country' }
      const number = country.compact ? country.compact(input.trim().toUpperCase()) : compacted
      const types = country.types.filter(type => type.pattern.test(number))
      if (types.length === 0) return { status: 'invalid-format', country, number }
      const type = types.find(t => t.isValid(number))
      return type
        ? { status: 'valid', country, number, verified: true, type }
        : { status: 'invalid-check-digit', country, number, types }
    },
  }
}

export function getFamilyType(
  family: NumberFamily,
  countryCode: string,
  typeId: string
): NumberType | undefined {
  return family.getCountry(countryCode)?.types.find(type => type.id === typeId)
}

/**
 * Generates `count` distinct numbers (count is clamped to the supported range), with `generate`,
 * which defaults to the type's valid numbers (see `numberGenerator` for invalid ones).
 */
export function generateNumbers(
  type: NumberType,
  count: number,
  generate: () => string = () => type.generate()
): string[] {
  const unique = new Set<string>()
  const target = clampQuantity(count)
  while (unique.size < target) unique.add(generate())
  return [...unique]
}

export interface ExpectedFormat {
  /** The number's name, when the country has several kinds (e.g. "CPF"). */
  label?: string
  /** VIES-style notations, with the prefix for VIES countries (e.g. "ATU99999999"). */
  formats: readonly string[]
}

/** The formats a country accepts: its VIES structure, or the formats of each kind of number. */
export function getExpectedFormats(country: FamilyCountry): ExpectedFormat[] {
  if (country.vat) {
    return [{ formats: country.vat.formats.map(format => country.code + format.notation) }]
  }
  return country.types.map(type => ({
    label: country.types.length > 1 ? type.name : undefined,
    formats: type.notations ?? [],
  }))
}
