import { createFileRoute } from '@tanstack/react-router'
import { TaxNumberValidator } from '@/features/tax-number-validator/tax-number-validator'

export const Route = createFileRoute('/tax-number-validator')({
  component: TaxNumberValidator,
})
