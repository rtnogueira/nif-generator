import { createFamily } from '@/lib/numbers/family'
import { IDENTITY_COUNTRIES } from './countries'

export { IDENTITY_COUNTRIES }

/** Identity numbers as a family, for the generator and validator pages. */
export const IDENTITY_FAMILY = createFamily({
  id: 'identity',
  noun: 'identity number',
  slug: 'identity-numbers',
  countries: IDENTITY_COUNTRIES,
  defaultCountry: 'PT',
})
