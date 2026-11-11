/**
 * VAT identification number structures, transcribed from the European Commission's VIES
 * "VAT identification number structure" table (https://ec.europa.eu/taxation_customs/vies/#/faq).
 *
 * `notation` uses the VIES legend (the 2-letter prefix is excluded):
 *   9 = a digit · X = a letter or a digit · S = a letter, a digit, "+" or "*" · L = a letter
 * Any other character is literal, and spaces only separate blocks.
 *
 * Do not edit a notation by hand: it must match the VIES table. Where a VIES footnote or the national
 * tax authority narrows a format, set `pattern` and document the source in `note`.
 */

export interface VatFormat {
  /** National part of the number in VIES notation, prefix excluded (e.g. `U99999999` for Austria). */
  notation: string
  /** Overrides the regex derived from `notation`. Only set it when an official source requires it. */
  pattern?: RegExp
}

export interface VatCountry {
  /** VIES country prefix (ISO 3166-1 alpha-2, except Greece: `EL`, and Northern Ireland: `XI`). */
  code: string
  name: string
  /** Structure description from the VIES table. */
  structure: string
  formats: readonly VatFormat[]
  /** Why a format deviates from its plain VIES notation, and the official source for it. */
  note?: string
}

export const VIES_FAQ_URL = 'https://ec.europa.eu/taxation_customs/vies/#/faq'
export const VIES_VALIDATION_URL = 'https://ec.europa.eu/taxation_customs/vies/#/vat-validation'

const UK_FORMATS = [
  { notation: '999 9999 99' },
  { notation: '999 9999 99 999' },
  { notation: 'GD999' },
  { notation: 'HA999' },
] as const satisfies readonly VatFormat[]

const UK_STRUCTURE =
  '1 block of 3 digits, 1 block of 4 digits and 1 block of 2 digits; or the above followed by a block of 3 digits; or 1 block of 5 characters'

const UK_NOTE =
  'The 12-digit format identifies branch traders, GD government departments and HA health authorities.'

export const VAT_COUNTRIES = [
  {
    code: 'AT',
    name: 'Austria',
    structure: '1 block of 9 characters',
    formats: [{ notation: 'U99999999' }],
    note: 'The first position following the prefix is always "U".',
  },
  {
    code: 'BE',
    name: 'Belgium',
    structure: '1 block of 10 digits',
    formats: [{ notation: '0999999999' }, { notation: '1999999999' }],
  },
  {
    code: 'BG',
    name: 'Bulgaria',
    structure: '1 block of 9 digits or 1 block of 10 digits',
    formats: [{ notation: '999999999' }, { notation: '9999999999' }],
  },
  {
    code: 'HR',
    name: 'Croatia',
    structure: '1 block of 11 digits',
    formats: [{ notation: '99999999999' }],
  },
  {
    code: 'CY',
    name: 'Cyprus',
    structure: '1 block of 9 characters',
    formats: [{ notation: '99999999L' }],
  },
  {
    code: 'CZ',
    name: 'Czechia',
    structure: '1 block of either 8, 9 or 10 digits',
    formats: [{ notation: '99999999' }, { notation: '999999999' }, { notation: '9999999999' }],
  },
  {
    code: 'DK',
    name: 'Denmark',
    structure: '4 blocks of 2 digits',
    formats: [{ notation: '99 99 99 99' }],
  },
  {
    code: 'EE',
    name: 'Estonia',
    structure: '1 block of 9 digits',
    formats: [{ notation: '999999999' }],
  },
  {
    code: 'FI',
    name: 'Finland',
    structure: '1 block of 8 digits',
    formats: [{ notation: '99999999' }],
  },
  {
    code: 'FR',
    name: 'France',
    structure: '1 block of 2 characters, 1 block of 9 digits',
    formats: [{ notation: 'XX 999999999' }],
  },
  {
    code: 'DE',
    name: 'Germany',
    structure: '1 block of 9 digits',
    formats: [{ notation: '999999999' }],
  },
  {
    code: 'EL',
    name: 'Greece',
    structure: '1 block of 9 digits',
    formats: [{ notation: '999999999' }],
    note: 'Greek VAT numbers use the prefix EL, not GR.',
  },
  {
    code: 'HU',
    name: 'Hungary',
    structure: '1 block of 8 digits',
    formats: [{ notation: '99999999' }],
  },
  {
    code: 'IE',
    name: 'Ireland',
    structure: '1 block of 8 characters or 1 block of 9 characters',
    // The VIES legend does not define "W" and "I". Irish Revenue's VIES Traders Manual describes the
    // 9-character format as "seven digits and one or two letters" (e.g. IE1234567AB).
    formats: [{ notation: '9S99999L' }, { notation: '9999999WI', pattern: /^\d{7}[A-Z]{2}$/ }],
    note: 'The 9-character format is 7 digits followed by 2 letters, as defined by Irish Revenue (VIES Traders Manual).',
  },
  {
    code: 'IT',
    name: 'Italy',
    structure: '1 block of 11 digits',
    formats: [{ notation: '99999999999' }],
  },
  {
    code: 'LV',
    name: 'Latvia',
    structure: '1 block of 11 digits',
    formats: [{ notation: '99999999999' }],
  },
  {
    code: 'LT',
    name: 'Lithuania',
    structure: '1 block of 9 digits, or 1 block of 12 digits',
    formats: [{ notation: '999999999' }, { notation: '999999999999' }],
  },
  {
    code: 'LU',
    name: 'Luxembourg',
    structure: '1 block of 8 digits',
    formats: [{ notation: '99999999' }],
  },
  {
    code: 'MT',
    name: 'Malta',
    structure: '1 block of 8 digits',
    formats: [{ notation: '99999999' }],
  },
  {
    code: 'NL',
    name: 'Netherlands',
    structure: '1 block of 12 characters',
    // VIES note 8, confirmed by the Belastingdienst (e.g. NL123456789B01).
    formats: [{ notation: 'SSSSSSSSSSSS', pattern: /^[A-Z0-9+*]{9}B[A-Z0-9+*]{2}$/ }],
    note: 'The 10th position following the prefix is always "B" (VIES note 8, confirmed by the Belastingdienst).',
  },
  {
    code: 'PL',
    name: 'Poland',
    structure: '1 block of 10 digits',
    formats: [{ notation: '9999999999' }],
  },
  {
    code: 'PT',
    name: 'Portugal',
    structure: '1 block of 9 digits',
    formats: [{ notation: '999999999' }],
  },
  {
    code: 'RO',
    name: 'Romania',
    structure: '1 block of minimum 2 digits and maximum 10 digits',
    // The VIES example shows 9 digits, but its structure column states 2 to 10 digits.
    formats: [{ notation: '999999999', pattern: /^\d{2,10}$/ }],
    note: 'Between 2 and 10 digits, as stated in the VIES structure column.',
  },
  {
    code: 'SK',
    name: 'Slovakia',
    structure: '1 block of 10 digits',
    formats: [{ notation: '9999999999' }],
  },
  {
    code: 'SI',
    name: 'Slovenia',
    structure: '1 block of 8 digits',
    formats: [{ notation: '99999999' }],
  },
  {
    code: 'ES',
    name: 'Spain',
    structure: '1 block of 9 characters',
    // VIES note 4: the first and last characters may not both be numeric.
    formats: [{ notation: 'X9999999X', pattern: /^(?!\d{9}$)[A-Z0-9]\d{7}[A-Z0-9]$/ }],
    note: 'The first and last characters may be letters or digits, but not both digits (VIES note 4).',
  },
  {
    code: 'SE',
    name: 'Sweden',
    structure: '1 block of 12 digits',
    formats: [{ notation: '999999999999' }],
  },
  {
    code: 'XI',
    name: 'Northern Ireland',
    structure: UK_STRUCTURE,
    formats: UK_FORMATS,
    note: UK_NOTE,
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    structure: UK_STRUCTURE,
    formats: UK_FORMATS,
    note: `${UK_NOTE} GB numbers left VIES in 2021; the structure is the one still published in the VIES table.`,
  },
] as const satisfies readonly VatCountry[]

export type VatCountryCode = (typeof VAT_COUNTRIES)[number]['code']
