import { PersonAbout } from './person-about'
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
