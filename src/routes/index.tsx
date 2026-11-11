import { createFileRoute } from '@tanstack/react-router'
import { validateGeneratorSearch } from '@/features/nif-generator/generator-options'
import { HOME_PAGE } from '@/features/nif-generator/landing-pages'
import { NifGenerator } from '@/features/nif-generator/nif-generator'

export const Route = createFileRoute('/')({
  validateSearch: validateGeneratorSearch,
  component: HomeGeneratorPage,
})

function HomeGeneratorPage() {
  return <NifGenerator {...HOME_PAGE} />
}
