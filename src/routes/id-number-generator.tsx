import { createFileRoute } from '@tanstack/react-router'
import { IDENTITY_GENERATOR_PAGE } from '@/features/identity/identity-pages'
import { validateGeneratorSearch } from '@/features/nif-generator/generator-options'
import { NifGenerator } from '@/features/nif-generator/nif-generator'

export const Route = createFileRoute('/id-number-generator')({
  validateSearch: validateGeneratorSearch,
  component: IdNumberGeneratorPage,
})

function IdNumberGeneratorPage() {
  return <NifGenerator {...IDENTITY_GENERATOR_PAGE} />
}
