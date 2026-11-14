import { createFileRoute } from '@tanstack/react-router'
import { IBAN_VALIDATOR_PAGE } from '@/features/iban/iban-pages'
import { NumberValidator } from '@/features/tax-number-validator/tax-number-validator'

export const Route = createFileRoute('/iban-validator')({
  component: IbanValidatorPage,
})

function IbanValidatorPage() {
  return <NumberValidator {...IBAN_VALIDATOR_PAGE} />
}
