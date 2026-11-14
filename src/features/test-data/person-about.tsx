import { About, Block, ExternalLink, Faq } from '@/components/page-sections'
import { MAX_ROWS } from '@/lib/dataset'
import { PERSON_LOCALES } from '@/lib/person'

const FAKER_URL = 'https://fakerjs.dev/'
const COUNTRIES = PERSON_LOCALES.map(locale => locale.name)

export function PersonAbout() {
  return (
    <About id="about-person-generator">
      <Block id="about-person-generator" title="About the person generator">
        <p>
          It generates made-up people for test data: a first and last name that match the chosen
          sex, a birth date within the age range you set, and an address written the way the country
          writes it. Choose the columns you need, generate up to {MAX_ROWS} rows at a time, then
          copy the table (it pastes into a spreadsheet as columns) or export it to Excel, CSV or
          JSON. The options are kept in the page address, so a setup can be bookmarked or shared.
        </p>
      </Block>

      <Block title="Where the names and addresses come from">
        <p>
          Names, street names, cities and postal code formats come from the open-source{' '}
          <ExternalLink href={FAKER_URL}>Faker</ExternalLink> library, which keeps lists of them for
          each country. Only countries for which Faker has its own names and addresses are offered:{' '}
          {COUNTRIES.join(', ')}.
        </p>
        <p>
          The data is realistic, not real. Names are common in the country and are combined at
          random. Addresses have the right shape, but the street, the city and the postal code are
          drawn separately, so they do not belong together, some city names are invented, and a
          postal code may not exist. Do not use them where an address must be found on a map or
          checked against a postal database.
        </p>
      </Block>

      <Faq
        items={[
          {
            question: 'Are these real people?',
            answer:
              'No. Every value is drawn at random, so a generated person does not exist. A name may coincide with that of a real person, as common names do.',
          },
          {
            question: 'How is the birth date chosen?',
            answer:
              'It is a random date that makes the person as old today as the age range allows, both ends included. The default range is 18 to 65.',
          },
          {
            question: 'Is anything sent to a server?',
            answer:
              'No. The names and addresses of the country you pick are downloaded once, and the table is generated in your browser.',
          },
        ]}
      />
    </About>
  )
}
