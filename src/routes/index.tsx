import { createFileRoute } from '@tanstack/react-router'
import { NifGenerator } from '@/features/nif-generator/nif-generator'

export const Route = createFileRoute('/')({
  component: NifGenerator,
})
