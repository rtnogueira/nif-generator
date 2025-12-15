import { createFileRoute } from '@tanstack/react-router'
import { NifGenerator } from '../pages/nif-generator/'

export const Route = createFileRoute('/')({
  component: NifGenerator,
})
