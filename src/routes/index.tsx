import { createFileRoute } from '@tanstack/react-router'
import { validateGeneratorSearch } from '@/features/nif-generator/generator-options'
import { NifGenerator } from '@/features/nif-generator/nif-generator'

export const Route = createFileRoute('/')({
  validateSearch: validateGeneratorSearch,
  component: NifGenerator,
})
