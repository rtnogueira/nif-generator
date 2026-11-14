import { PersonAbout } from './person-about'
import { TestDataAbout } from './test-data-about'
import type { TestDataGeneratorProps } from './test-data-generator'

export const PERSON_GENERATOR_PAGE: TestDataGeneratorProps = {
  path: '/person-generator',
  heading: 'Person Generator',
  intro: (
    <p>
      Generate made-up people for testing: names, birth dates and addresses written the way each
      country writes them. Pick a country, a sex and an age range, choose the columns, then copy the
      table or export it to Excel, CSV or JSON. Free and fully in your browser.
    </p>
  ),
  groups: ['person'],
  slug: 'people',
  about: <PersonAbout />,
}

export const TEST_DATA_GENERATOR_PAGE: TestDataGeneratorProps = {
  path: '/test-data-generator',
  heading: 'Test Data Generator',
  intro: (
    <p>
      Generate a table of made-up people with everything a test record needs: name, birth date and
      address, plus a tax number, an identity number, a social security number and an IBAN from the
      same country, each with a correct check digit. Choose the columns, then copy the table or
      export it to Excel, CSV or JSON. Free and fully in your browser.
    </p>
  ),
  groups: ['person', 'tax', 'identity', 'social-security', 'banking'],
  slug: 'test-data',
  about: <TestDataAbout />,
}
