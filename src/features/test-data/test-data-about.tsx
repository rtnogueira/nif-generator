import { Link } from '@tanstack/react-router'
import { About, Block, Faq } from '@/components/page-sections'
import { MAX_ROWS } from '@/lib/dataset'

const LINK_CLASS = 'font-medium text-foreground underline underline-offset-4'
const MONO = 'font-mono text-foreground'

const TOOLS = [
  { to: '/person-generator', label: 'person generator' },
  { to: '/', label: 'tax ID generator' },
  { to: '/id-number-generator', label: 'identity number generator' },
  { to: '/social-security-number-generator', label: 'social security number generator' },
  { to: '/iban-generator', label: 'IBAN generator' },
] as const

export function TestDataAbout() {
  return (
    <About id="about-test-data">
      <Block id="about-test-data" title="About the test data generator">
        <p>
          It builds a table with one made-up person per row and the numbers that person would have
          in the chosen country: a tax number, an identity number, a social security number and an
          IBAN, each with a correct check digit. For Portugal, for example, a row has a name, a
          birth date, an address, a NIF, a Cartão de Cidadão number, a NISS and an IBAN starting
          with <span className={MONO}>PT50</span>.
        </p>
        <p>
          Choose the columns you need, generate up to {MAX_ROWS} rows, then copy the table (it
          pastes into a spreadsheet as columns) or export it to Excel, CSV or JSON, where each row
          is an object with the column names as keys. The options are kept in the page address.
        </p>
      </Block>

      <Block title="How the values of a row fit together">
        <p>
          Every value of a row is made for the same person. Numbers that hold a birth date or a sex,
          such as the Swedish personnummer, the Polish PESEL or the French social security number,
          hold the birth date and sex of that row. Where two numbers are the same number in real
          life, as with a Belgian&apos;s national register number and social security number, both
          columns show the same value.
        </p>
        <p>
          The numbers a country offers are the ones the single tools generate, with the same sources
          and limits:{' '}
          {TOOLS.map((tool, index) => (
            <span key={tool.to}>
              {index > 0 && (index === TOOLS.length - 1 ? ' and ' : ', ')}
              <Link to={tool.to} className={LINK_CLASS}>
                {tool.label}
              </Link>
            </span>
          ))}
          . A country only has the columns that exist for it, so some have no identity or social
          security number, and countries outside the IBAN registry have no IBAN.
        </p>
      </Block>

      <Faq
        items={[
          {
            question: 'Is this real data?',
            answer:
              'No. People, addresses and numbers are generated at random and belong to no one. A number may coincide with one that has been issued, so only use the table in test environments.',
          },
          {
            question: 'Do the address and the IBAN match the person?',
            answer:
              'Only the country does. The street, city and postal code are drawn separately, and the bank codes of an IBAN are random, so neither points to a real place or bank.',
          },
          {
            question: 'Why does a number not match an older person’s birth date?',
            answer:
              'A few numbers changed format over time. Czech and Slovak birth numbers, for example, have had ten digits and a check digit only since 1954, so they are generated in that form whatever the age. The default age range, 18 to 65, avoids these cases.',
          },
        ]}
      />
    </About>
  )
}
