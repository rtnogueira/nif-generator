import { Fragment } from 'react'
import { getExpectedFormats, type ValidatorCountry } from '@/lib/tax-id'

/** A notation such as "99999999-X", as opposed to a description in words. */
const isNotation = (format: string) => !format.includes(' ')

/** Lists formats joined with "or", e.g. "99999999-X or 9999999-X". */
export function FormatList({ formats }: { formats: readonly string[] }) {
  return formats.map((format, index) => (
    <Fragment key={format}>
      {index > 0 && ' or '}
      {isNotation(format) ? (
        <span className="font-mono whitespace-nowrap text-foreground">{format}</span>
      ) : (
        format
      )}
    </Fragment>
  ))
}

/** Lists a country's formats, e.g. "BE0999999999 or BE1999999999", or "CPF 99999999999 or …". */
export function ExpectedFormats({ country }: { country: ValidatorCountry }) {
  return getExpectedFormats(country).map(({ label, formats }, index) => (
    <Fragment key={label ?? index}>
      {index > 0 && ' or '}
      {label && `${label} `}
      <FormatList formats={formats} />
    </Fragment>
  ))
}
