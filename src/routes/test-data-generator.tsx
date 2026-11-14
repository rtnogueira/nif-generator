import { createFileRoute } from '@tanstack/react-router'
import { TestDataGenerator } from '@/features/test-data/test-data-generator'
import { validateTestDataSearch } from '@/features/test-data/test-data-options'
import { TEST_DATA_GENERATOR_PAGE } from '@/features/test-data/test-data-pages'

export const Route = createFileRoute('/test-data-generator')({
  validateSearch: validateTestDataSearch,
  component: TestDataGeneratorPage,
})

function TestDataGeneratorPage() {
  return <TestDataGenerator {...TEST_DATA_GENERATOR_PAGE} />
}
