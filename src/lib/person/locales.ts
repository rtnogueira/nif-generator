/**
 * The countries people can be generated for, each with the @faker-js/faker locale that has the
 * names and address formats of that country. Only locales with their own first names, last names,
 * streets, cities and postal code formats are listed (see the localization table of faker); the
 * English-speaking countries marked below share faker's general list of English first names.
 *
 * Each locale is loaded on demand, so only the ones a visitor picks are downloaded. The imports
 * are written out one by one because the bundler needs literal paths to split them.
 */
import type { Faker } from '@faker-js/faker'

export interface PersonLocale {
  /** ISO 3166-1 alpha-2 code. */
  code: string
  name: string
  /** False when the locale has no regions (states, districts...) of its own. */
  region: boolean
  load: () => Promise<{ faker: Faker }>
}

export const PERSON_LOCALES: readonly PersonLocale[] = [
  {
    code: 'AU',
    name: 'Australia',
    region: true,
    load: () => import('@faker-js/faker/locale/en_AU'),
  },
  { code: 'AT', name: 'Austria', region: true, load: () => import('@faker-js/faker/locale/de_AT') },
  { code: 'BE', name: 'Belgium', region: true, load: () => import('@faker-js/faker/locale/nl_BE') },
  { code: 'BR', name: 'Brazil', region: true, load: () => import('@faker-js/faker/locale/pt_BR') },
  // English first names from faker's general list.
  { code: 'CA', name: 'Canada', region: true, load: () => import('@faker-js/faker/locale/en_CA') },
  { code: 'CN', name: 'China', region: true, load: () => import('@faker-js/faker/locale/zh_CN') },
  { code: 'HR', name: 'Croatia', region: true, load: () => import('@faker-js/faker/locale/hr') },
  { code: 'CZ', name: 'Czechia', region: true, load: () => import('@faker-js/faker/locale/cs_CZ') },
  { code: 'DK', name: 'Denmark', region: true, load: () => import('@faker-js/faker/locale/da') },
  { code: 'FI', name: 'Finland', region: true, load: () => import('@faker-js/faker/locale/fi') },
  { code: 'FR', name: 'France', region: true, load: () => import('@faker-js/faker/locale/fr') },
  { code: 'DE', name: 'Germany', region: true, load: () => import('@faker-js/faker/locale/de') },
  { code: 'GR', name: 'Greece', region: false, load: () => import('@faker-js/faker/locale/el') },
  { code: 'HU', name: 'Hungary', region: true, load: () => import('@faker-js/faker/locale/hu') },
  { code: 'IN', name: 'India', region: true, load: () => import('@faker-js/faker/locale/en_IN') },
  { code: 'IL', name: 'Israel', region: true, load: () => import('@faker-js/faker/locale/he') },
  { code: 'IT', name: 'Italy', region: true, load: () => import('@faker-js/faker/locale/it') },
  { code: 'JP', name: 'Japan', region: true, load: () => import('@faker-js/faker/locale/ja') },
  { code: 'LV', name: 'Latvia', region: true, load: () => import('@faker-js/faker/locale/lv') },
  { code: 'MX', name: 'Mexico', region: true, load: () => import('@faker-js/faker/locale/es_MX') },
  {
    code: 'NL',
    name: 'Netherlands',
    region: true,
    load: () => import('@faker-js/faker/locale/nl'),
  },
  { code: 'NO', name: 'Norway', region: true, load: () => import('@faker-js/faker/locale/nb_NO') },
  { code: 'PL', name: 'Poland', region: true, load: () => import('@faker-js/faker/locale/pl') },
  {
    code: 'PT',
    name: 'Portugal',
    region: true,
    load: () => import('@faker-js/faker/locale/pt_PT'),
  },
  { code: 'RO', name: 'Romania', region: true, load: () => import('@faker-js/faker/locale/ro') },
  { code: 'SK', name: 'Slovakia', region: true, load: () => import('@faker-js/faker/locale/sk') },
  {
    code: 'SI',
    name: 'Slovenia',
    region: true,
    load: () => import('@faker-js/faker/locale/sl_SI'),
  },
  {
    code: 'ZA',
    name: 'South Africa',
    region: true,
    load: () => import('@faker-js/faker/locale/en_ZA'),
  },
  {
    code: 'KR',
    name: 'South Korea',
    region: true,
    load: () => import('@faker-js/faker/locale/ko'),
  },
  { code: 'ES', name: 'Spain', region: true, load: () => import('@faker-js/faker/locale/es') },
  { code: 'SE', name: 'Sweden', region: true, load: () => import('@faker-js/faker/locale/sv') },
  {
    code: 'CH',
    name: 'Switzerland',
    region: true,
    load: () => import('@faker-js/faker/locale/de_CH'),
  },
  { code: 'TR', name: 'Türkiye', region: true, load: () => import('@faker-js/faker/locale/tr') },
  { code: 'UA', name: 'Ukraine', region: true, load: () => import('@faker-js/faker/locale/uk') },
  // English first names from faker's general list.
  {
    code: 'GB',
    name: 'United Kingdom',
    region: true,
    load: () => import('@faker-js/faker/locale/en_GB'),
  },
  {
    code: 'US',
    name: 'United States',
    region: true,
    load: () => import('@faker-js/faker/locale/en_US'),
  },
]

export const DEFAULT_PERSON_COUNTRY = 'PT'

const BY_CODE = new Map(PERSON_LOCALES.map(locale => [locale.code, locale]))

export function getPersonLocale(code: string): PersonLocale | undefined {
  return BY_CODE.get(code)
}
