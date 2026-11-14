import { createFileRoute } from '@tanstack/react-router'
import { NumberValidator } from '@/features/tax-number-validator/tax-number-validator'
import { TAX_VALIDATOR_PAGE } from '@/features/tax-number-validator/validator-pages'

export const Route = createFileRoute('/tax-id-validator')({
  component: TaxIdValidatorPage,
})

function TaxIdValidatorPage() {
  return <NumberValidator {...TAX_VALIDATOR_PAGE} />
}
