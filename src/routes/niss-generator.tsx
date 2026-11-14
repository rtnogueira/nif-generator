import { createFileRoute } from '@tanstack/react-router'
import { validateGeneratorSearch } from '@/features/nif-generator/generator-options'
import { NifGenerator } from '@/features/nif-generator/nif-generator'
import { NISS_PAGE } from '@/features/social-security/social-security-pages'

export const Route = createFileRoute('/niss-generator')({
  validateSearch: validateGeneratorSearch,
  component: NissGeneratorPage,
})

function NissGeneratorPage() {
  return <NifGenerator {...NISS_PAGE} />
}
