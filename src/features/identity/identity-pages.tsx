import type { NifGeneratorProps } from '@/features/nif-generator/nif-generator'
import type { NumberValidatorProps } from '@/features/tax-number-validator/tax-number-validator'
import { IDENTITY_FAMILY } from '@/lib/identity'
import {
  CartaoCidadaoAbout,
  IdentityGeneratorAbout,
  IdentityValidatorAbout,
} from './identity-about'

export const IDENTITY_GENERATOR_PAGE: NifGeneratorProps = {
  path: '/id-number-generator',
  family: IDENTITY_FAMILY,
  heading: 'Identity Number Generator',
  intro: (
    <p>
      Generate valid identity card and population register numbers for testing, with a correct check
      digit, or deliberately invalid ones to check that they are rejected: the Portuguese Cartão de
      Cidadão, the Spanish DNI and NIE, the Polish PESEL, the Swedish personnummer and the numbers
      of {IDENTITY_FAMILY.countries.length - 4} more countries. Free, instant and fully in your
      browser.
    </p>
  ),
  about: <IdentityGeneratorAbout />,
}

export const CARTAO_CIDADAO_PAGE: NifGeneratorProps = {
  path: '/cartao-de-cidadao-generator',
  family: IDENTITY_FAMILY,
  heading: 'Cartão de Cidadão Number Generator',
  intro: (
    <p>
      Generate valid Portuguese Cartão de Cidadão document numbers (
      <i lang="pt">número de documento do Cartão de Cidadão</i>) for testing, with a correct check
      digit, or invalid ones to check that your forms reject them. A free{' '}
      <i lang="pt">gerador de número de Cartão de Cidadão</i> that runs fully in your browser.
    </p>
  ),
  preset: { country: 'PT', typeId: 'cc', formatted: true },
  about: <CartaoCidadaoAbout />,
}

export const IDENTITY_VALIDATOR_PAGE: NumberValidatorProps = {
  path: '/id-number-validator',
  family: IDENTITY_FAMILY,
  heading: 'Identity Number Validator',
  intro: (
    <p>
      Check whether an identity card or population register number has the right format and check
      digit for its country: the Portuguese Cartão de Cidadão, the Spanish DNI and NIE, the Polish
      PESEL, the Swedish personnummer and more. Free, instant and fully in your browser.
    </p>
  ),
  formHint: 'Pick the country, then type the number as it is printed.',
  placeholder: '00000000 0 ZZ4',
  unknownCountry: <>Pick the country that issued the number from the list.</>,
  about: <IdentityValidatorAbout />,
}
