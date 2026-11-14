import { TAX_FAMILY } from '@/lib/tax-id'
import type { NumberValidatorProps } from './tax-number-validator'
import { ValidatorAbout } from './validator-about'

export const TAX_VALIDATOR_PAGE: NumberValidatorProps = {
  path: '/tax-id-validator',
  family: TAX_FAMILY,
  heading: 'Tax ID Validator',
  intro: (
    <p>
      Check whether a tax ID (tax identification number, or TIN) has the right format and check
      digit for its country. Covers the VAT numbers of all 27 EU member states, Northern Ireland and
      the United Kingdom, Portuguese NIFs, and tax numbers from countries such as Brazil,
      Switzerland, Norway, Australia and Japan. Free, instant and fully in your browser.
    </p>
  ),
  formHint: 'Pick a country, or type an EU VAT number with its country prefix.',
  placeholder: 'PT123456789',
  unknownCountry: (
    <>
      Start the number with an EU VAT prefix (such as PT, ES or DE), or pick the country from the
      list. Numbers from outside the EU need the country picked.
    </>
  ),
  about: <ValidatorAbout />,
}
