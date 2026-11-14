import { createFamily } from '@/lib/numbers/family'
import { SOCIAL_SECURITY_COUNTRIES } from './countries'

export { SOCIAL_SECURITY_COUNTRIES }

/** Social security numbers as a family, for the generator and validator pages. */
export const SOCIAL_SECURITY_FAMILY = createFamily({
  id: 'social-security',
  noun: 'social security number',
  slug: 'social-security-numbers',
  countries: SOCIAL_SECURITY_COUNTRIES,
  defaultCountry: 'PT',
})
