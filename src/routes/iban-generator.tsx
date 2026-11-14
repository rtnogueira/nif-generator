import { createFileRoute } from '@tanstack/react-router'
import { IBAN_GENERATOR_PAGE } from '@/features/iban/iban-pages'
import { validateGeneratorSearch } from '@/features/nif-generator/generator-options'
import { NifGenerator } from '@/features/nif-generator/nif-generator'

export const Route = createFileRoute('/iban-generator')({
  validateSearch: validateGeneratorSearch,
  component: IbanGeneratorPage,
})

function IbanGeneratorPage() {
  return <NifGenerator {...IBAN_GENERATOR_PAGE} />
}
