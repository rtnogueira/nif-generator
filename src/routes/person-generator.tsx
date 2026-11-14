import { createFileRoute } from '@tanstack/react-router'
import { TestDataGenerator } from '@/features/test-data/test-data-generator'
import { validateTestDataSearch } from '@/features/test-data/test-data-options'
import { PERSON_GENERATOR_PAGE } from '@/features/test-data/test-data-pages'

export const Route = createFileRoute('/person-generator')({
  validateSearch: validateTestDataSearch,
  component: PersonGeneratorPage,
})

function PersonGeneratorPage() {
  return <TestDataGenerator {...PERSON_GENERATOR_PAGE} />
}
