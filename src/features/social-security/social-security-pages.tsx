import type { NifGeneratorProps } from '@/features/nif-generator/nif-generator'
import type { NumberValidatorProps } from '@/features/tax-number-validator/tax-number-validator'
import { SOCIAL_SECURITY_FAMILY } from '@/lib/social-security'
import {
  NissAbout,
  SocialSecurityGeneratorAbout,
  SocialSecurityValidatorAbout,
} from './social-security-about'

export const SOCIAL_SECURITY_GENERATOR_PAGE: NifGeneratorProps = {
  path: '/social-security-number-generator',
  family: SOCIAL_SECURITY_FAMILY,
  heading: 'Social Security Number Generator',
  intro: (
    <p>
      Generate valid social security and social insurance numbers for testing, with a correct check
      digit, or deliberately invalid ones to check that they are rejected: the Portuguese NISS, the
      French NIR, the Belgian INSZ, the Swiss AHV number, the Canadian SIN and more. Free, instant
      and fully in your browser.
    </p>
  ),
  about: <SocialSecurityGeneratorAbout />,
}

export const NISS_PAGE: NifGeneratorProps = {
  path: '/niss-generator',
  family: SOCIAL_SECURITY_FAMILY,
  heading: 'NISS Generator',
  intro: (
    <p>
      Generate valid Portuguese social security numbers (NISS,{' '}
      <i lang="pt">Número de Identificação de Segurança Social</i>) for testing, with a correct
      check digit, or invalid ones to check that your forms reject them. A free{' '}
      <i lang="pt">gerador de NISS</i> that runs fully in your browser.
    </p>
  ),
  preset: { country: 'PT', typeId: 'niss' },
  about: <NissAbout />,
}

export const SOCIAL_SECURITY_VALIDATOR_PAGE: NumberValidatorProps = {
  path: '/social-security-number-validator',
  family: SOCIAL_SECURITY_FAMILY,
  heading: 'Social Security Number Validator',
  intro: (
    <p>
      Check whether a social security or social insurance number has the right format and check
      digit for its country: the Portuguese NISS, the French NIR, the Belgian INSZ, the Swiss AHV
      number, the Canadian SIN and more. Free, instant and fully in your browser.
    </p>
  ),
  formHint: 'Pick the country, then type the number as it is printed.',
  placeholder: '11234567892',
  unknownCountry: <>Pick the country that issued the number from the list.</>,
  about: <SocialSecurityValidatorAbout />,
}
