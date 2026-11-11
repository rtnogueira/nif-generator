import { Link } from '@tanstack/react-router'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getTaxIdCountry, getTaxIdCountryName, isViesCountry, TAX_ID_COUNTRIES } from '@/lib/tax-id'
import { VIES_VALIDATION_URL } from '@/lib/vat'
import { About, Block, Faq } from './landing-sections'
import { NifAbout, NifTypesTable } from './nif-about'
import type { NifGeneratorProps } from './nif-generator'

const LINK_CLASS = 'font-medium text-foreground underline underline-offset-4'
const MONO = 'font-mono text-foreground'

const validatorLink = (text = 'tax ID validator') => (
  <Link to="/tax-id-validator" className={LINK_CLASS}>
    {text}
  </Link>
)

const NOT_REAL = {
  question: 'Are the generated numbers real?',
  answer:
    'They are mathematically valid, with the right structure and check digit, but randomly generated and not tied to any person or company. A generated number may coincide with one that has been assigned, so only use them in test environments, never on invoices or official documents.',
}

export const HOME_PAGE: NifGeneratorProps = {
  path: '/',
  heading: 'Tax ID Generator',
  intro: (
    <p>
      Generate valid tax identification numbers (tax IDs or TINs) with a correct check digit, for
      testing forms and systems, or deliberately invalid ones to check that they are rejected.
      Covers Portuguese NIFs of every type, the VAT numbers of all 27 EU member states, Northern
      Ireland and the United Kingdom, and tax numbers from countries such as Brazil, Switzerland,
      Norway, Australia and Japan. Free, instant and fully in your browser.
    </p>
  ),
  about: <NifAbout />,
}

export const NIF_PAGE: NifGeneratorProps = {
  path: '/nif-generator',
  heading: 'NIF Generator',
  intro: (
    <p>
      Generate valid Portuguese NIFs (<i lang="pt">número de identificação fiscal</i>, or{' '}
      <i lang="pt">número de contribuinte</i>) for testing: individuals, companies (NIPC),
      non-residents, public bodies and every other taxpayer type, each with a correct check digit.
      Or generate invalid ones to check that your forms reject them. A free{' '}
      <i lang="pt">gerador de NIF</i> that runs fully in your browser.
    </p>
  ),
  about: (
    <About id="about-nif">
      <Block id="about-nif" title="What is a NIF?">
        <p>
          The NIF is the 9-digit tax number that the Portuguese tax authority (
          <i lang="pt">Autoridade Tributária e Aduaneira</i>) gives every taxpayer. Companies and
          other legal persons also call it the NIPC (
          <i lang="pt">número de identificação de pessoa colectiva</i>). It appears on invoices,
          contracts and almost every Portuguese form, and the Portuguese VAT number is the NIF with
          the <span className={MONO}>PT</span> prefix, e.g.{' '}
          <span className={MONO}>PT123456789</span>.
        </p>
      </Block>

      <Block title="How is a NIF validated?">
        <p>
          The first digit, or the first two, identify the type of taxpayer (see the table below).
          The ninth digit is a check digit: multiply the first eight digits by 9, 8, 7 and so on
          down to 2, add the results and take the remainder of the division by 11. If the remainder
          is 0 or 1, the check digit is 0; otherwise it is 11 minus the remainder.
        </p>
        <p>
          A form that applies this rule rejects most typing mistakes. To check a NIF you already
          have, use the {validatorLink()}.
        </p>
      </Block>

      <Block title="NIF types">
        <p>Pick the type in the generator to choose the first digits of the NIFs it creates:</p>
        <NifTypesTable />
      </Block>

      <Faq
        items={[
          NOT_REAL,
          {
            question: 'Can I generate a NIPC (company NIF)?',
            answer:
              'Yes. Choose type 5 (pessoa colectiva) for companies, 6 for public administration, 71 for non-resident companies or 9 for provisional numbers.',
          },
          {
            question: 'Can I generate tax numbers from other countries?',
            answer: (
              <>
                Yes. The{' '}
                <Link to="/" className={LINK_CLASS}>
                  tax ID generator
                </Link>{' '}
                covers every EU VAT number and the tax numbers of 14 more countries.
              </>
            ),
          },
        ]}
      />
    </About>
  ),
}

const DE_VAT = getTaxIdCountry('DE').types[0]

const VIES_ROWS = TAX_ID_COUNTRIES.filter(country => isViesCountry(country.code))
  .map(country => ({
    code: country.code,
    name: getTaxIdCountryName(country.code),
    type: country.types[0],
  }))
  .sort((a, b) => a.name.localeCompare(b.name))

export const VAT_PAGE: NifGeneratorProps = {
  path: '/vat-number-generator',
  heading: 'VAT Number Generator',
  preset: { country: 'DE', typeId: DE_VAT.id, withPrefix: true },
  intro: (
    <p>
      Generate random, valid VAT identification numbers for testing: Germany, France, Italy, Spain,
      the Netherlands and every other EU member state, plus Northern Ireland and the United Kingdom.
      Each number has a correct check digit and, optionally, its country prefix (e.g.{' '}
      <span className={MONO}>DE</span> followed by 9 digits). Or generate invalid ones to check that
      your checkout rejects them.
    </p>
  ),
  about: (
    <About id="about-vat">
      <Block id="about-vat" title="What is a VAT number?">
        <p>
          A VAT identification number identifies a business registered for value added tax in the
          European Union. It starts with a two-letter country prefix (
          <span className={MONO}>EL</span> for Greece, <span className={MONO}>XI</span> for Northern
          Ireland) followed by the national number, whose length, format and check digit differ from
          country to country. Online shops, invoicing tools and B2B checkouts ask for it to apply
          the reverse charge, and usually check its format before anything else.
        </p>
        <p>
          A generated number only passes the format and check-digit rules: it is not registered, so
          the European Commission&apos;s{' '}
          <a href={VIES_VALIDATION_URL} target="_blank" rel="noreferrer" className={LINK_CLASS}>
            VIES
          </a>{' '}
          service reports it as invalid. To check the format of a VAT number you already have, use
          the {validatorLink('VAT number validator')}.
        </p>
      </Block>

      <Block title="Supported countries">
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
              {VIES_ROWS.map(row => (
                <TableRow key={row.code}>
                  <TableCell className="text-foreground">
                    <span className="mr-2 font-mono text-xs text-muted-foreground">{row.code}</span>
                    {row.name}
                  </TableCell>
                  <TableCell className="whitespace-normal">
                    <span className="font-medium text-foreground">{row.type.name}</span>
                  </TableCell>
                  <TableCell className="whitespace-normal">{row.type.algorithm}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Block>

      <Faq
        items={[
          NOT_REAL,
          {
            question: 'Can I get VAT numbers with the country prefix?',
            answer:
              'Yes. Tick "Include the prefix" to get the full VAT format, such as DE123456789; untick it for the national number alone.',
          },
          {
            question: 'Why is a generated VAT number rejected by VIES?',
            answer:
              'VIES checks whether a number is registered, not only whether it is well formed. Generated numbers are well formed but registered to no one, which is what makes them safe test data.',
          },
        ]}
      />
    </About>
  ),
}

export const CPF_PAGE: NifGeneratorProps = {
  path: '/cpf-generator',
  heading: 'CPF Generator',
  preset: { country: 'BR', typeId: 'cpf', formatted: true },
  intro: (
    <p>
      Generate valid Brazilian CPF numbers for testing, formatted (
      <span className={MONO}>000.000.000-00</span>) or as plain digits, with both check digits
      computed. Switch the type to generate CNPJ numbers for companies, or generate invalid numbers
      to check that your forms reject them. A free <i lang="pt">gerador de CPF</i> that runs fully
      in your browser.
    </p>
  ),
  about: (
    <About id="about-cpf">
      <Block id="about-cpf" title="What is a CPF?">
        <p>
          The CPF (<i lang="pt">Cadastro de Pessoas Físicas</i>) is the 11-digit tax number the
          Brazilian Receita Federal gives every individual taxpayer. It is asked for when opening a
          bank account, buying online, signing a contract and on most Brazilian forms, which is why
          it is one of the most common numbers to test. Companies have a CNPJ (
          <i lang="pt">Cadastro Nacional da Pessoa Jurídica</i>) instead.
        </p>
      </Block>

      <Block title="How are the CPF check digits calculated?">
        <p>
          The last two digits of a CPF are check digits. For the first, multiply the first nine
          digits by 10, 9, 8 and so on down to 2, add the results and take the remainder of the
          division by 11: the check digit is 0 if the remainder is 0 or 1, and 11 minus the
          remainder otherwise. The second check digit is computed the same way over the first ten
          digits, with weights 11 to 2.
        </p>
        <p>
          The Receita Federal does not issue CPFs made of a single repeated digit, such as{' '}
          <span className={MONO}>111.111.111-11</span>, so the generator never creates them, even
          though their check digits are correct.
        </p>
      </Block>

      <Block title="CNPJ numbers">
        <p>
          A CNPJ has 14 digits, written <span className={MONO}>00.000.000/0001-00</span>: eight
          digits for the company, four for the branch (<span className={MONO}>0001</span> is the
          head office) and two check digits, computed with modulo 11 and weights 2 to 9. Pick
          &ldquo;CNPJ&rdquo; as the type to generate head-office numbers. To check a CPF or CNPJ you
          already have, use the {validatorLink()}.
        </p>
      </Block>

      <Faq
        items={[
          NOT_REAL,
          {
            question: 'Can I get CPFs without dots and dashes?',
            answer:
              'Yes. Untick "Formatted" to get the 11 digits alone, the form most databases store.',
          },
          {
            question: 'Can I export the generated CPFs?',
            answer:
              'Yes. Copy them one by one or all at once, or export up to 50 numbers to Excel (.xlsx), CSV, JSON or a text file. The .xlsx export keeps leading zeros, which Excel drops when it opens a CSV.',
          },
        ]}
      />
    </About>
  ),
}
