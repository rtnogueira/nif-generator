import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { VALIDATOR_COUNTRIES } from '@/lib/tax-id'
import { VIES_FAQ_URL, VIES_VALIDATION_URL } from '@/lib/vat'
import { ExpectedFormats, FormatList } from './expected-formats'

const STDNUM_URL = 'https://github.com/arthurdejong/python-stdnum'

const COUNTRIES_BY_NAME = [...VALIDATOR_COUNTRIES].sort((a, b) => a.name.localeCompare(b.name))
const VIES_COUNTRIES = COUNTRIES_BY_NAME.filter(country => country.vat)
/** One row per number type outside VIES. */
const OTHER_TYPES = COUNTRIES_BY_NAME.filter(country => !country.vat).flatMap(country =>
  country.types.map(type => ({ key: `${country.code}-${type.id}`, country: country.name, type }))
)

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="font-medium text-foreground underline underline-offset-4"
    >
      {children}
    </a>
  )
}

const FAQ = [
  {
    question: 'Does a valid result mean the number is registered?',
    answer: (
      <>
        No. The validator checks that the number has the right structure and check digit for its
        country. Only the tax authorities know whether a number is assigned and active. For EU VAT
        numbers you can check that on <ExternalLink href={VIES_VALIDATION_URL}>VIES</ExternalLink>.
      </>
    ),
  },
  {
    question: 'Where do the check-digit algorithms come from?',
    answer: (
      <>
        The European Commission does not publish them, so they are ported from the open-source{' '}
        <ExternalLink href={STDNUM_URL}>python-stdnum</ExternalLink> library and tested against
        real, registered numbers from its test suite. They are the same algorithms the{' '}
        <Link to="/" className="font-medium text-foreground underline underline-offset-4">
          tax ID generator
        </Link>{' '}
        uses.
      </>
    ),
  },
  {
    question: 'Why is the check digit of some numbers not verified?',
    answer:
      'Some countries issue several kinds of VAT number, such as the 9- and 10-digit personal DIČ in Czechia or the 12-digit UK branch numbers. The check digit is only verified for the kinds listed on the generator; other numbers are checked against the official structure alone, and the result says so.',
  },
  {
    question: 'Where do the formats come from?',
    answer: (
      <>
        From the &ldquo;VAT identification number structure&rdquo; table published by the European
        Commission on <ExternalLink href={VIES_FAQ_URL}>VIES</ExternalLink>. Where the table needs
        clarification, the national tax authority&apos;s own documentation is used (Irish Revenue
        for Ireland, the Belastingdienst for the Netherlands), as noted in the table above.
      </>
    ),
  },
  {
    question: 'Is any data sent to a server?',
    answer: 'No. Validation happens entirely in your browser.',
  },
] as const

export function ValidatorAbout() {
  return (
    <section
      aria-labelledby="about-validator"
      className="flex max-w-3xl flex-col gap-10 text-muted-foreground"
    >
      <div className="flex flex-col gap-3">
        <h2 id="about-validator" className="text-2xl font-semibold tracking-tight text-foreground">
          Supported formats
        </h2>
        <p>
          VAT identification numbers start with a 2-letter country prefix followed by the national
          number. In the formats below, <span className="font-mono text-foreground">9</span> is a
          digit, <span className="font-mono text-foreground">X</span> a letter or a digit,{' '}
          <span className="font-mono text-foreground">S</span> a letter, a digit, &ldquo;+&rdquo; or
          &ldquo;*&rdquo;, and <span className="font-mono text-foreground">L</span> a letter. The
          check digit is verified too, for the kinds of number the generator supports.
        </p>
        <div className="rounded-lg border">
          <Table aria-label="EU VAT formats">
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Country</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Structure</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {VIES_COUNTRIES.map(country => (
                <TableRow key={country.code}>
                  <TableCell className="align-top text-foreground">{country.name}</TableCell>
                  <TableCell className="align-top whitespace-normal">
                    <ExpectedFormats country={country} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal">
                    {country.vat?.structure}
                    {country.vat?.note && (
                      <span className="mt-1 block text-xs">{country.vat.note}</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">Other countries</h2>
        <p>
          Outside the EU, pick the country before validating: these numbers carry no country prefix.
          Here <span className="font-mono text-foreground">9</span> is a digit and{' '}
          <span className="font-mono text-foreground">X</span> a digit or the letter K.
        </p>
        <div className="rounded-lg border">
          <Table aria-label="Other countries">
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Country</TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Check digit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {OTHER_TYPES.map(({ key, country, type }) => (
                <TableRow key={key}>
                  <TableCell className="align-top text-foreground">{country}</TableCell>
                  <TableCell className="align-top whitespace-normal">{type.label}</TableCell>
                  <TableCell className="align-top whitespace-normal">
                    <FormatList formats={type.notations ?? []} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal">{type.algorithm}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Frequently asked questions
        </h2>
        {FAQ.map(item => (
          <div key={item.question} className="flex flex-col gap-1.5">
            <h3 className="font-medium text-foreground">{item.question}</h3>
            <p>{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
