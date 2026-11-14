import { createFileRoute } from '@tanstack/react-router'
import { SOCIAL_SECURITY_VALIDATOR_PAGE } from '@/features/social-security/social-security-pages'
import { NumberValidator } from '@/features/tax-number-validator/tax-number-validator'

export const Route = createFileRoute('/social-security-number-validator')({
  component: SocialSecurityNumberValidatorPage,
})

function SocialSecurityNumberValidatorPage() {
  return <NumberValidator {...SOCIAL_SECURITY_VALIDATOR_PAGE} />
}
