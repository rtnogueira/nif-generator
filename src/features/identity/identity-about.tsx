import { Link } from '@tanstack/react-router'
import { About, Block, ExternalLink, Faq } from '@/components/page-sections'
import { STDNUM_URL, SupportedNumbers } from '@/components/supported-numbers'
import { IDENTITY_FAMILY } from '@/lib/identity'
import { MAX_QUANTITY } from '@/lib/numbers/quantity'

const LINK_CLASS = 'font-medium text-foreground underline underline-offset-4'
const MONO = 'font-mono text-foreground'
const AMA_URL =
  'https://www.autenticacao.gov.pt/documents/20126/0/Valida%C3%A7%C3%A3o+de+N%C3%BAmero+de+Documento+do+Cart%C3%A3o+de+Cidad%C3%A3o+(1).pdf/7d5745ba-2bcc-e861-3954-bafe9f7591a0'

const COUNTRY_COUNT = IDENTITY_FAMILY.countries.length

const validatorLink = (
  <Link to="/id-number-validator" className={LINK_CLASS}>
    identity number validator
  </Link>
)
const generatorLink = (
  <Link to="/id-number-generator" className={LINK_CLASS}>
    identity number generator
  </Link>
)

function Sources() {
  return (
    <Block title="Where the algorithms come from">
      <p>
        Every algorithm is ported from the open-source{' '}
        <ExternalLink href={STDNUM_URL}>python-stdnum</ExternalLink> library, the module named in
        the table, and tested against the real numbers in its documentation and test suite. The
        Portuguese Cartão de Cidadão check also follows the{' '}
        <ExternalLink href={AMA_URL}>specification published by the Portuguese State</ExternalLink>.
      </p>
      <p>
        A number is only included when its check digit can be verified that way. Numbers with no
        check digit, or whose check is no longer applied (such as the Danish CPR number), are left
        out, as are numbers that need data this site does not have, such as the Italian codice
        fiscale, which encodes the holder&apos;s name and place of birth.
      </p>
    </Block>
  )
}

function Supported() {
  return (
    <Block title="Supported identity numbers">
      <p>
        {COUNTRY_COUNT} countries. Where a number holds its holder&apos;s birth date or sex, the
        generator makes it for a random adult, and the last column says what it holds.
      </p>
      <SupportedNumbers family={IDENTITY_FAMILY} />
    </Block>
  )
}

const NOT_REAL = {
  question: 'Are the generated numbers real?',
  answer:
    'They have the right structure and check digit, but they are randomly generated and not tied to any person. A generated number may coincide with one that has been issued, so only use them in test environments, never to identify yourself or anyone else.',
}

export function IdentityGeneratorAbout() {
  return (
    <About id="about-id-generator">
      <Block id="about-id-generator" title="About the identity number generator">
        <p>
          It generates the numbers of identity cards and population registers, such as the
          Portuguese Cartão de Cidadão, the Spanish DNI, the Polish PESEL or the Swedish
          personnummer, each with a correct check digit. Use them to test forms and systems, or
          generate invalid ones (a wrong check digit or a wrong length) to check that they are
          rejected. Up to {MAX_QUANTITY} unique numbers at a time, with the options kept in the page
          address. To check a number you already have, use the {validatorLink}.
        </p>
      </Block>
      <Supported />
      <Sources />
      <Faq
        items={[
          NOT_REAL,
          {
            question: 'Why is my country missing?',
            answer:
              'Many identity numbers have no check digit, or their rules are not published. Only numbers whose check digit python-stdnum verifies are generated, so that a generated number is one a real validation accepts.',
          },
          {
            question: 'Does a number with a birth date in it match a real person?',
            answer:
              'No. The birth date is a random date and, where the number says so, a random sex. The rest of the number is random.',
          },
        ]}
      />
    </About>
  )
}

export function IdentityValidatorAbout() {
  return (
    <About id="about-id-validator">
      <Block id="about-id-validator" title="About the identity number validator">
        <p>
          It checks that an identity number has the right format and check digit for its country,
          and names the kind of number that matched. Spaces, dots, dashes and slashes are ignored.
          Nothing you type leaves your browser. For test data, use the {generatorLink}.
        </p>
      </Block>
      <Supported />
      <Sources />
      <Faq
        items={[
          {
            question: 'Does a valid result mean the number was issued?',
            answer:
              'No. The validator checks the structure and the check digit. Only the authority that issues the number knows whether it exists and who holds it.',
          },
          {
            question: 'Is my number sent anywhere?',
            answer: 'No. The check runs in your browser and the number is not stored or sent.',
          },
        ]}
      />
    </About>
  )
}

export function CartaoCidadaoAbout() {
  return (
    <About id="about-cc">
      <Block id="about-cc" title="What is the Cartão de Cidadão number?">
        <p>
          The <i lang="pt">número de documento</i> printed on a Portuguese Cartão de Cidadão has 12
          characters, written <span className={MONO}>DDDDDDDD C AAT</span>, e.g.{' '}
          <span className={MONO}>00000000 0 ZZ4</span>. The first eight digits are the{' '}
          <i lang="pt">número de identificação civil</i> (the number of the old{' '}
          <i lang="pt">bilhete de identidade</i>), followed by its check digit. The two characters
          that follow are the version of the card, which changes every time a new card is issued,
          and the last digit is the check digit of the whole document number.
        </p>
      </Block>
      <Block title="How is it validated?">
        <p>
          Replace each letter by a number (A is 10, B is 11, up to Z, which is 35). Starting from
          the second character from the right and moving left, double every other value, and
          subtract 9 from the result when it is 10 or more. Add everything, including the values
          that were not doubled: the total must be a multiple of 10. This is the rule in the{' '}
          <ExternalLink href={AMA_URL}>
            specification published by the Agência para a Modernização Administrativa
          </ExternalLink>
          .
        </p>
        <p>
          The specification does not say how the check digit of the civil identification number (the
          ninth character) is computed, so the generator draws it at random and the validator does
          not check it. To check a number you already have, use the {validatorLink}.
        </p>
      </Block>
      <Faq items={[NOT_REAL]} />
    </About>
  )
}
