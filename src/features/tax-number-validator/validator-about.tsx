import type { ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { VAT_COUNTRIES, VIES_FAQ_URL, VIES_VALIDATION_URL } from '@/lib/vat'
import { ExpectedFormats } from './expected-formats'

const COUNTRIES_BY_NAME = [...VAT_COUNTRIES].sort((a, b) => a.name.localeCompare(b.name))

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
        No. The validator checks that the number has the official structure for its country (and,
        for Portugal, the check digit). Only the tax authorities know whether a number is assigned
        and active. For EU VAT numbers you can check that on{' '}
        <ExternalLink href={VIES_VALIDATION_URL}>VIES</ExternalLink>.
      </>
    ),
  },
  {
    question: 'Why is only the Portuguese check digit verified?',
    answer:
      'Most countries add a check digit to their tax numbers, but the European Commission does not publish those algorithms. Rather than rely on unofficial reimplementations, this tool only checks the officially published structure, plus the Portuguese NIF check digit that this site also uses to generate test numbers.',
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
          &ldquo;*&rdquo;, and <span className="font-mono text-foreground">L</span> a letter.
        </p>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Country</TableHead>
                <TableHead>Format</TableHead>
                <TableHead>Structure</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {COUNTRIES_BY_NAME.map(country => (
                <TableRow key={country.code}>
                  <TableCell className="align-top text-foreground">{country.name}</TableCell>
                  <TableCell className="align-top whitespace-normal">
                    <ExpectedFormats country={country} />
                  </TableCell>
                  <TableCell className="align-top whitespace-normal">
                    {country.structure}
                    {'note' in country && (
                      <span className="mt-1 block text-xs">{country.note}</span>
                    )}
                  </TableCell>
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
