import { createFileRoute } from '@tanstack/react-router'
import { validateGeneratorSearch } from '@/features/nif-generator/generator-options'
import { NifGenerator } from '@/features/nif-generator/nif-generator'
import { SOCIAL_SECURITY_GENERATOR_PAGE } from '@/features/social-security/social-security-pages'

export const Route = createFileRoute('/social-security-number-generator')({
  validateSearch: validateGeneratorSearch,
  component: SocialSecurityNumberGeneratorPage,
})

function SocialSecurityNumberGeneratorPage() {
  return <NifGenerator {...SOCIAL_SECURITY_GENERATOR_PAGE} />
}
