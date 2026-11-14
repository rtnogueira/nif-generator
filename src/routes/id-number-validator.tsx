import { createFileRoute } from '@tanstack/react-router'
import { IDENTITY_VALIDATOR_PAGE } from '@/features/identity/identity-pages'
import { NumberValidator } from '@/features/tax-number-validator/tax-number-validator'

export const Route = createFileRoute('/id-number-validator')({
  component: IdNumberValidatorPage,
})

function IdNumberValidatorPage() {
  return <NumberValidator {...IDENTITY_VALIDATOR_PAGE} />
}
