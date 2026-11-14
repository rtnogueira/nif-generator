import { createFileRoute } from '@tanstack/react-router'
import { CARTAO_CIDADAO_PAGE } from '@/features/identity/identity-pages'
import { validateGeneratorSearch } from '@/features/nif-generator/generator-options'
import { NifGenerator } from '@/features/nif-generator/nif-generator'

export const Route = createFileRoute('/cartao-de-cidadao-generator')({
  validateSearch: validateGeneratorSearch,
  component: CartaoCidadaoGeneratorPage,
})

function CartaoCidadaoGeneratorPage() {
  return <NifGenerator {...CARTAO_CIDADAO_PAGE} />
}
