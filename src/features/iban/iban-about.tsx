import { Link } from '@tanstack/react-router'
import { About, Block, ExternalLink, Faq } from '@/components/page-sections'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { hasNationalCheck, IBAN_FAMILY, IBAN_REGISTRY, IBAN_REGISTRY_RELEASE } from '@/lib/iban'
import { MAX_QUANTITY } from '@/lib/numbers/quantity'

const STDNUM_URL = 'https://github.com/arthurdejong/python-stdnum'
const SWIFT_REGISTRY_URL =
  'https://www.swift.com/standards/data-standards/iban-international-bank-account-number'
const BDP_IBAN_URL =
  'https://www.bportugal.pt/sites/default/files/anexos/documentos-relacionados/international_bank_account_number_pt.pdf'

const LINK_CLASS = 'font-medium text-foreground underline underline-offset-4'
const MONO = 'font-mono text-foreground'

const COUNTRIES = [...IBAN_FAMILY.countries].sort((a, b) => a.name.localeCompare(b.name))
const COUNT = IBAN_REGISTRY.length

function Sources() {
  return (
    <p>
      The structure of each country comes from the{' '}
      <ExternalLink href={SWIFT_REGISTRY_URL}>IBAN registry</ExternalLink> that SWIFT maintains
      (release {IBAN_REGISTRY_RELEASE}), as distributed with the open-source{' '}
      <ExternalLink href={STDNUM_URL}>python-stdnum</ExternalLink> library, whose algorithms are
      ported here and tested against the registry&apos;s sample IBANs and real ones. The Portuguese
      account check digits follow{' '}
      <ExternalLink href={BDP_IBAN_URL}>Banco de Portugal&apos;s IBAN specification</ExternalLink>.
    </p>
  )
}

function HowItIsChecked() {
  return (
    <Block title="How are the check digits of an IBAN computed?">
      <p>
        An IBAN starts with a two-letter country code and two check digits, followed by the
        country&apos;s own account number (the BBAN). To check it, move the first four characters to
        the end, replace every letter by a number (A is 10, B is 11, up to Z, which is 35) and
        divide the resulting number by 97: the remainder must be 1. This is the ISO 7064 Mod 97-10
        algorithm, and it catches almost every typing mistake.
      </p>
      <p>
        Some countries also have check digits inside the account number. They are computed and
        checked for Belgium, Montenegro, Norway, Portugal and Spain. A Portuguese IBAN, for example,
        ends with the two check digits of its NIB, which is why every Portuguese IBAN starts with{' '}
        <span className={MONO}>PT50</span>.
      </p>
    </Block>
  )
}

function CountriesTable() {
  return (
    <Block title="Supported countries">
      <p>
        The {COUNT} countries of the IBAN registry. In the structure, 9 is a digit, A a letter and C
        a letter or a digit.
      </p>
      <div className="overflow-x-auto rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Country</TableHead>
              <TableHead>Length</TableHead>
              <TableHead>Structure</TableHead>
              <TableHead>Account check digits</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {COUNTRIES.map(country => {
              const [type] = country.types
              const notation = type.notations?.[0] ?? ''
              return (
                <TableRow key={country.code}>
                  <TableCell className="text-foreground">{country.name}</TableCell>
                  <TableCell className="tabular-nums">{notation.length}</TableCell>
                  <TableCell className="font-mono text-xs">{notation}</TableCell>
                  <TableCell>
                    {hasNationalCheck(country.code) ? 'Verified' : 'Not verified'}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </Block>
  )
}

const validatorLink = (
  <Link to="/iban-validator" className={LINK_CLASS}>
    IBAN validator
  </Link>
)
const generatorLink = (
  <Link to="/iban-generator" className={LINK_CLASS}>
    IBAN generator
  </Link>
)

export function IbanGeneratorAbout() {
  return (
    <About id="about-iban-generator">
      <Block id="about-iban-generator" title="About the IBAN generator">
        <p>
          It generates IBANs with the right length and structure for their country and correct check
          digits, so they pass the validation that forms, payment libraries and APIs apply. Use them
          as test data, or generate invalid ones (a wrong check digit or a wrong length) to check
          that your system rejects them. Up to {MAX_QUANTITY} unique IBANs at a time, plain or in
          groups of four characters.
        </p>
        <p>
          The account numbers are random. Outside Belgium, the bank and branch codes are random too
          and may not belong to any bank, so a system that looks the bank up can still reject a
          generated IBAN. To check an IBAN you already have, use the {validatorLink}.
        </p>
      </Block>

      <HowItIsChecked />
      <CountriesTable />

      <Block title="Where the rules come from">
        <Sources />
      </Block>

      <Faq
        items={[
          {
            question: 'Are the generated IBANs real bank accounts?',
            answer:
              'No. They are random numbers with a valid structure and valid check digits. A generated IBAN may coincide with an account that exists, so only use them in test environments and never send a payment to one.',
          },
          {
            question: 'Why do all Portuguese IBANs start with PT50?',
            answer:
              'The last two digits of a Portuguese account number (NIB) are its own Mod 97-10 check digits. A number that already passes that check always gives the same IBAN check digits, 50.',
          },
          {
            question: 'Do the bank codes exist?',
            answer:
              'Only for Belgium, where the bank code is drawn from the codes the National Bank of Belgium has assigned. For every other country the bank and branch codes are random digits or letters of the right length.',
          },
          {
            question: 'Why are some account check digits not verified?',
            answer:
              'Several countries have check digits of their own inside the account number, such as the French RIB key or the Italian CIN. They are only computed where the algorithm could be verified against a reliable source, which today is Belgium, Montenegro, Norway, Portugal and Spain.',
          },
        ]}
      />
    </About>
  )
}

export function IbanValidatorAbout() {
  return (
    <About id="about-iban-validator">
      <Block id="about-iban-validator" title="About the IBAN validator">
        <p>
          It checks that an IBAN names one of the {COUNT} countries of the IBAN registry, has that
          country&apos;s length and structure, and has correct check digits. Spaces, dots and dashes
          are ignored, so you can paste an IBAN the way it is printed. Nothing you type leaves your
          browser. For test data, use the {generatorLink}.
        </p>
      </Block>

      <HowItIsChecked />
      <CountriesTable />

      <Block title="Where the rules come from">
        <Sources />
      </Block>

      <Faq
        items={[
          {
            question: 'Does a valid result mean the account exists?',
            answer:
              'No. The validator checks the structure and the check digits. Only the bank knows whether the account exists, is open and belongs to the person you expect.',
          },
          {
            question: 'Is the bank code checked?',
            answer:
              'Only for Belgium. For other countries any bank code of the right length is accepted.',
          },
        ]}
      />
    </About>
  )
}
