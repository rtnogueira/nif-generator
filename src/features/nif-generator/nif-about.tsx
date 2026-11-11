import { Link } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MAX_QUANTITY, NIF_TYPES } from '@/lib/nif'
import { getTaxIdCountryName, isViesCountry, TAX_ID_COUNTRIES } from '@/lib/tax-id'

const STDNUM_URL = 'https://github.com/arthurdejong/python-stdnum'
const LINK_CLASS = 'font-medium text-foreground underline underline-offset-4'

const SUPPORTED_OUTSIDE_VIES = TAX_ID_COUNTRIES.filter(c => !isViesCountry(c.code)).length

/** One row per country and number type, sorted by country name. Portugal is summarised in one row. */
const SUPPORTED = TAX_ID_COUNTRIES.flatMap(country =>
  (country.code === 'PT' ? country.types.slice(0, 1) : country.types).map(type => ({
    key: `${country.code}-${type.id}`,
    code: country.code,
    country: getTaxIdCountryName(country.code),
    name: type.name,
    label: country.code === 'PT' ? 'All taxpayer types (see the NIF types below)' : type.label,
    algorithm: type.algorithm,
  }))
).sort((a, b) => a.country.localeCompare(b.country))

const FAQ = [
  {
    question: 'Are the generated numbers real?',
    answer:
      'They are mathematically valid — the structure and check digit follow the official rules — but they are randomly generated and not tied to any person or company. A generated number may coincide with one that has been assigned, so never use them outside of test environments.',
  },
  {
    question: 'What are invalid numbers for?',
    answer:
      'To check that a form rejects bad input. "Invalid check digit" numbers have the right format but a wrong check digit, and "Invalid length" numbers have digits added or removed; the validator on this site reports them as such. Invalid batches are marked in the results and their files are named accordingly (e.g. tax-numbers-pt-invalid-check-digit.csv), so they are not mistaken for valid test data.',
  },
  {
    question: 'Can I use a generated number on an invoice or official document?',
    answer:
      'No. These numbers exist only to test forms, validations and databases. Using them for invoices, contracts, tax returns or to impersonate someone is illegal.',
  },
  {
    question: 'How many numbers can I generate at once?',
    answer: `Up to ${MAX_QUANTITY} unique numbers per batch. You can copy them one by one, copy the whole list (one per line, comma-separated or as a JSON array), or export it to Excel (.xlsx), CSV, JSON or a text file.`,
  },
  {
    question: 'Why do some numbers lose their leading zeros in Excel?',
    answer:
      'Excel reads CSV values as numbers, dropping leading zeros and showing long numbers in scientific notation. Use the .xlsx export to open the numbers in Excel: it stores them as text.',
  },
  {
    question: 'Can I get numbers with dots, dashes or spaces?',
    answer:
      'Yes, for numbers that have a usual written form, such as 390.533.447-05 for a Brazilian CPF or CHE-113.042.942 for a Swiss UID: tick "Formatted". The option only appears where python-stdnum defines that form; other numbers are always shown as plain digits.',
  },
  {
    question: 'Can I share or bookmark a set of options?',
    answer:
      'Yes. The page address keeps the country, type, quantity and other options of the last batch (for example ?country=BR&type=cpf&qty=20&format=1). Opening it fills in the form and generates a new batch with those options.',
  },
  {
    question: 'Where do the check-digit algorithms come from?',
    answer: (
      <>
        Each algorithm is ported from{' '}
        <a
          href={STDNUM_URL}
          target="_blank"
          rel="noreferrer"
          className="font-medium text-foreground underline underline-offset-4"
        >
          python-stdnum
        </a>
        , a widely used open-source library of identifier validators, and is tested against real,
        registered numbers. Countries are only included when their algorithm is verified that way.
      </>
    ),
  },
  {
    question: 'Is any data sent to a server?',
    answer:
      'No. Numbers are generated entirely in your browser using a cryptographically secure random number generator.',
  },
]

/** The Portuguese NIF prefixes and the type of taxpayer each identifies. */
export function NifTypesTable() {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-24">Prefix</TableHead>
            <TableHead>Taxpayer type</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {NIF_TYPES.map(type => (
            <TableRow key={type.prefix}>
              <TableCell className="font-mono text-foreground">{type.prefix}</TableCell>
              <TableCell lang="pt" className="whitespace-normal">
                {type.label}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function NifAbout() {
  return (
    <section
      aria-labelledby="about-nif"
      className="flex max-w-3xl flex-col gap-10 text-muted-foreground"
    >
      <div className="flex flex-col gap-3">
        <h2 id="about-nif" className="text-2xl font-semibold tracking-tight text-foreground">
          What is a tax ID?
        </h2>
        <p>
          Most countries give every taxpayer a tax identification number (tax ID, or TIN): the
          Portuguese NIF (<i lang="pt">número de contribuinte</i>), the VAT numbers of EU companies,
          the Brazilian CPF and CNPJ, the Australian ABN and many more. Forms, invoices and
          checkouts ask for them, and usually check that they are well formed, which is why QA
          engineers and developers need valid test numbers that belong to no one.
        </p>
        <p>
          This generator creates such numbers for {TAX_ID_COUNTRIES.length} countries and regions,
          including every type of Portuguese NIF (it is also a <i lang="pt">gerador de NIF</i>), so
          you can test validations without using real people&apos;s or companies&apos; data.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          How do check digits work?
        </h2>
        <p>
          Most tax numbers end with a check digit (sometimes two, or a letter) computed from the
          other digits. A typical algorithm multiplies each digit by a weight, adds the results and
          takes the remainder of a division, often by 11 or 97; others use the Luhn algorithm or a
          lookup table. When someone mistypes a digit, the check digit no longer matches, so a form
          can reject the number without contacting the tax authority.
        </p>
        <p>
          Each country uses its own algorithm, named for every number in the table below. A valid
          check digit only means the number is well formed, not that it has been assigned. To check
          a number you already have, use the{' '}
          <Link to="/tax-id-validator" className={LINK_CLASS}>
            tax ID validator
          </Link>
          .
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Supported countries
        </h2>
        <p>
          Besides Portugal, the generator creates VAT identification numbers for every country in
          the EU&apos;s VIES system, plus the main tax numbers of {SUPPORTED_OUTSIDE_VIES} other
          countries. Only numbers with a published check digit are included, so numbers such as the
          US SSN or EIN, which have none, are not. VIES numbers are shown without the country prefix
          by default; tick &ldquo;Include the prefix&rdquo; to get the full VAT format (e.g.{' '}
          <span className="font-mono text-foreground">DE</span> followed by 9 digits).
        </p>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-40">Country</TableHead>
                <TableHead>Number</TableHead>
                <TableHead>Check digit</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SUPPORTED.map(row => (
                <TableRow key={row.key}>
                  <TableCell className="text-foreground">
                    <span className="mr-2 font-mono text-xs text-muted-foreground">{row.code}</span>
                    {row.country}
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    <span className="font-medium text-foreground">{row.name}</span> — {row.label}
                  </TableCell>
                  <TableCell className="whitespace-normal">{row.algorithm}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Portuguese NIF types
        </h2>
        <p>
          For Portugal, the Type option sets the first digit (or first two digits) of the NIF, which
          identify the type of taxpayer:
        </p>
        <NifTypesTable />
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
