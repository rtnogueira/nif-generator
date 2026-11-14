import { Link } from '@tanstack/react-router'
import { About, Block, ExternalLink, Faq } from '@/components/page-sections'
import { STDNUM_URL, SupportedNumbers } from '@/components/supported-numbers'
import { MAX_QUANTITY } from '@/lib/numbers/quantity'
import { SOCIAL_SECURITY_FAMILY } from '@/lib/social-security'

const LINK_CLASS = 'font-medium text-foreground underline underline-offset-4'
const MONO = 'font-mono text-foreground'
const VALIDATORS_PT_URL = 'https://gist.github.com/dreispt/024dd11c160af58268e2b44019080bbf'

const COUNTRY_COUNT = SOCIAL_SECURITY_FAMILY.countries.length

const validatorLink = (
  <Link to="/social-security-number-validator" className={LINK_CLASS}>
    social security number validator
  </Link>
)
const generatorLink = (
  <Link to="/social-security-number-generator" className={LINK_CLASS}>
    social security number generator
  </Link>
)

function Sources() {
  return (
    <Block title="Where the algorithms come from">
      <p>
        The algorithms are ported from the open-source{' '}
        <ExternalLink href={STDNUM_URL}>python-stdnum</ExternalLink> library, the module named in
        the table, and tested against the numbers in its documentation and test suite. The
        Portuguese NISS is not part of python-stdnum: its check digit follows the rule of the{' '}
        <ExternalLink href={VALIDATORS_PT_URL}>validators_pt</ExternalLink> module.
      </p>
      <p>
        Numbers without a check digit cannot be told apart from a typing mistake, so they are not
        included. That is the case of the United States Social Security number.
      </p>
    </Block>
  )
}

function Supported() {
  return (
    <Block title="Supported social security numbers">
      <p>
        {COUNTRY_COUNT} countries. Where a number holds its holder&apos;s birth date or sex, the
        generator makes it for a random adult, and the last column says what it holds.
      </p>
      <SupportedNumbers family={SOCIAL_SECURITY_FAMILY} />
    </Block>
  )
}

const NOT_REAL = {
  question: 'Are the generated numbers real?',
  answer:
    'They have the right structure and check digit, but they are randomly generated and not tied to any person. A generated number may coincide with one that has been issued, so only use them in test environments, never on a real form or claim.',
}

export function SocialSecurityGeneratorAbout() {
  return (
    <About id="about-ss-generator">
      <Block id="about-ss-generator" title="About the social security number generator">
        <p>
          It generates social security, social insurance and health insurance numbers with a correct
          check digit, such as the Portuguese NISS, the French NIR, the Swiss AHV number or the
          Canadian SIN. Use them to test forms and systems, or generate invalid ones (a wrong check
          digit or a wrong length) to check that they are rejected. Up to {MAX_QUANTITY} unique
          numbers at a time, with the options kept in the page address. To check a number you
          already have, use the {validatorLink}.
        </p>
      </Block>
      <Supported />
      <Sources />
      <Faq
        items={[
          NOT_REAL,
          {
            question: 'Why is the US Social Security number not here?',
            answer:
              'It has no check digit, so any nine digits in the allowed ranges look valid and there is nothing to verify. Only numbers with a check digit are generated.',
          },
        ]}
      />
    </About>
  )
}

export function SocialSecurityValidatorAbout() {
  return (
    <About id="about-ss-validator">
      <Block id="about-ss-validator" title="About the social security number validator">
        <p>
          It checks that a social security number has the right format and check digit for its
          country. Spaces, dots, dashes and slashes are ignored. Nothing you type leaves your
          browser. For test data, use the {generatorLink}.
        </p>
      </Block>
      <Supported />
      <Sources />
      <Faq
        items={[
          {
            question: 'Does a valid result mean the number was issued?',
            answer:
              'No. The validator checks the structure and the check digit. Only the social security institution knows whether the number exists and who holds it.',
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

export function NissAbout() {
  return (
    <About id="about-niss">
      <Block id="about-niss" title="What is the NISS?">
        <p>
          The NISS (<i lang="pt">Número de Identificação de Segurança Social</i>) is the 11-digit
          number that identifies a person or a company in the Portuguese social security system. It
          is needed to work, to pay contributions and to receive benefits. Numbers of people start
          with <span className={MONO}>1</span> and those of companies and other entities with{' '}
          <span className={MONO}>2</span>.
        </p>
      </Block>
      <Block title="How is a NISS validated?">
        <p>
          Multiply the first ten digits by 29, 23, 19, 17, 13, 11, 7, 5, 3 and 2, in that order, and
          add the results. The eleventh digit is 9 minus the last digit of that sum. For{' '}
          <span className={MONO}>1123456789</span> the sum is 367, so the check digit is 9 − 7 = 2
          and the number is <span className={MONO}>11234567892</span>.
        </p>
        <p>
          The generator makes numbers of people (starting with 1). To check a number you already
          have, use the {validatorLink}.
        </p>
      </Block>
      <Faq items={[NOT_REAL]} />
    </About>
  )
}
