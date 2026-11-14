/** The generic number variants (see `@/lib/numbers/variants`), bound to the tax number validator. */
import {
  displayNumber,
  numberGenerator,
  type DisplayOptions,
  type Validity,
} from '@/lib/numbers/variants'
import { getVatCountry } from '@/lib/vat'
import type { TaxIdType } from './countries'
import { validateTaxNumber } from './validate'

export {
  checkPosition,
  isValidity,
  VALIDITIES,
  type DisplayOptions,
  type Validity,
} from '@/lib/numbers/variants'

/** A generator of numbers of `type` with the given validity, confirmed by the site's validator. */
export function taxIdGenerator(countryCode: string, type: TaxIdType, validity: Validity) {
  return numberGenerator(validateTaxNumber, countryCode, type, validity)
}

/** A generated number as shown: formatted, and with the VIES prefix for VIES countries. */
export function displayTaxId(
  countryCode: string,
  type: TaxIdType,
  number: string,
  options: DisplayOptions
): string {
  return displayNumber(getVatCountry(countryCode)?.code, type, number, options)
}
