/** What a number that encodes its holder's birth date or sex is generated from. */
export interface PersonSeed {
  birthDate: Date
  sex: 'female' | 'male'
}

/** Where a check-digit algorithm comes from. */
export interface NumberSource {
  /** The python-stdnum module the algorithm is ported from, e.g. `stdnum.pt.cc`. */
  stdnum?: string
  /** A document describing the algorithm, when it is not (only) in python-stdnum. */
  document?: { title: string; url: string }
}

/** One kind of number of a country, e.g. the Brazilian CPF. */
export interface NumberType {
  /** Unique within its country. */
  id: string
  /** Short name of the number (e.g. "USt-IdNr."), used as the export column header. */
  name: string
  /** Short tag shown next to each generated number. */
  badge: string
  /** Who the number identifies / which kind is generated. */
  label: string
  /** Plain-language summary of the check-digit algorithm. */
  algorithm: string
  /**
   * Shape of the numbers the algorithm applies to (national part, uppercase, without spaces or
   * dots). The validator only reports a wrong check digit for numbers of this shape: a number with
   * another valid shape is a kind this site does not check (e.g. a 10-digit Czech personal DIČ).
   */
  pattern: RegExp
  /**
   * Every accepted format, for countries outside VIES (whose formats come from `@/lib/vat`):
   * 9 = a digit, X = a digit or the letter K, anything else is literal. An entry with spaces is a
   * description in words, for formats a notation cannot express. The first entry is the usual one.
   */
  notations?: readonly string[]
  /** Index of the (first) check character, when it is not the last one. */
  checkIndex?: number
  /**
   * The usual written form of a valid number (national part), as python-stdnum's `format()`
   * writes it. Only set for types whose stdnum module has one.
   */
  format?: (number: string) => string
  /** What the number encodes about its holder: `generate` then takes a `PersonSeed`. */
  encodes?: readonly ('birthDate' | 'sex')[]
  source?: NumberSource
  /** A valid number, for `person` when the number encodes a birth date or sex. */
  generate: (person?: PersonSeed) => string
  isValid: (number: string) => boolean
}

export interface NumberCountry {
  /** VIES prefix for VIES countries (e.g. `EL` for Greece), ISO 3166-1 alpha-2 otherwise. */
  code: string
  /** English name, only for countries outside VIES (VIES countries take theirs from `@/lib/vat`). */
  name?: string
  /**
   * Reduces an input to the form `isValid` expects, for countries whose numbers have significant
   * punctuation (e.g. the century sign of a Finnish identity code). Defaults to dropping spaces,
   * dots, dashes and slashes.
   */
  compact?: (input: string) => string
  types: readonly NumberType[]
}
