import { createFileRoute } from '@tanstack/react-router'
import { validateGeneratorSearch } from '@/features/nif-generator/generator-options'
import { CPF_PAGE } from '@/features/nif-generator/landing-pages'
import { NifGenerator } from '@/features/nif-generator/nif-generator'

export const Route = createFileRoute('/cpf-generator')({
  validateSearch: validateGeneratorSearch,
  component: CpfGeneratorPage,
})

function CpfGeneratorPage() {
  return <NifGenerator {...CPF_PAGE} />
}
