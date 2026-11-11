import { createFileRoute } from '@tanstack/react-router'
import { validateGeneratorSearch } from '@/features/nif-generator/generator-options'
import { VAT_PAGE } from '@/features/nif-generator/landing-pages'
import { NifGenerator } from '@/features/nif-generator/nif-generator'

export const Route = createFileRoute('/vat-number-generator')({
  validateSearch: validateGeneratorSearch,
  component: VatGeneratorPage,
})

function VatGeneratorPage() {
  return <NifGenerator {...VAT_PAGE} />
}
