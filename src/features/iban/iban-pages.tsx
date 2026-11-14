import type { NifGeneratorProps } from '@/features/nif-generator/nif-generator'
import type { NumberValidatorProps } from '@/features/tax-number-validator/tax-number-validator'
import { IBAN_FAMILY, IBAN_REGISTRY } from '@/lib/iban'
import { IbanGeneratorAbout, IbanValidatorAbout } from './iban-about'

const COUNT = IBAN_REGISTRY.length

export const IBAN_GENERATOR_PAGE: NifGeneratorProps = {
  path: '/iban-generator',
  family: IBAN_FAMILY,
  heading: 'IBAN Generator',
  intro: (
    <p>
      Generate valid IBANs (International Bank Account Numbers) for testing forms, payment flows and
      APIs, or deliberately invalid ones to check that they are rejected. Covers the {COUNT}{' '}
      countries of the IBAN registry, with correct check digits. Free, instant and fully in your
      browser.
    </p>
  ),
  about: <IbanGeneratorAbout />,
}

export const IBAN_VALIDATOR_PAGE: NumberValidatorProps = {
  path: '/iban-validator',
  family: IBAN_FAMILY,
  heading: 'IBAN Validator',
  intro: (
    <p>
      Check whether an IBAN (International Bank Account Number) has the right length, structure and
      check digits for its country. Covers the {COUNT} countries of the IBAN registry. Free, instant
      and fully in your browser.
    </p>
  ),
  formHint: 'Type or paste an IBAN. The country is taken from its first two letters.',
  placeholder: 'PT50 0001 0000 1234 5678 9019 4',
  unknownCountry: (
    <>
      An IBAN starts with the two-letter code of a country in the IBAN registry, such as PT, ES or
      DE. This one does not.
    </>
  ),
  about: <IbanValidatorAbout />,
}
