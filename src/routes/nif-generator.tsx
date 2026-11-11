import { createFileRoute } from '@tanstack/react-router'
import { validateGeneratorSearch } from '@/features/nif-generator/generator-options'
import { NIF_PAGE } from '@/features/nif-generator/landing-pages'
import { NifGenerator } from '@/features/nif-generator/nif-generator'

export const Route = createFileRoute('/nif-generator')({
  validateSearch: validateGeneratorSearch,
  component: NifGeneratorPage,
})

function NifGeneratorPage() {
  return <NifGenerator {...NIF_PAGE} />
}
