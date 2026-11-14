import { CircleCheckIcon, CircleXIcon, ScanSearchIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import type { FamilyCountry, NumberFamily, NumberValidation } from '@/lib/numbers/family'
import type { NumberType } from '@/lib/numbers/types'
import { cn } from '@/lib/utils'
import { VIES_VALIDATION_URL } from '@/lib/vat'
import { ExpectedFormats } from './expected-formats'

interface ValidationResultProps {
  family: NumberFamily
  result: NumberValidation | null
  /** Explains how to name the country, when it could not be found. */
  unknownCountry: ReactNode
}

/** "a tax number", "an IBAN". */
const withArticle = (noun: string) => `${/^[aeiou]/i.test(noun) ? 'an' : 'a'} ${noun}`

export function ValidationResult(props: ValidationResultProps) {
  return (
    <Card className="min-w-0 flex-1 py-0" aria-live="polite">
      <ResultContent {...props} />
    </Card>
  )
}

const ViesLink = () => (
  <a
    href={VIES_VALIDATION_URL}
    target="_blank"
    rel="noreferrer"
    className="font-medium text-foreground underline underline-offset-4"
  >
    VIES
  </a>
)

/** The kind of number that matched, e.g. "NIF · Pessoa singular" or "Partita IVA (VAT number)". */
function describeType(type: NumberType) {
  return type.label.includes(type.name) ? type.label : `${type.name} · ${type.label}`
}

function ResultContent({ family, result, unknownCountry }: ValidationResultProps) {
  if (!result) {
    return (
      <Message icon={<ScanSearchIcon className="size-5" />} title="Nothing validated yet">
        Enter {withArticle(family.noun)} and press Validate.
      </Message>
    )
  }

  switch (result.status) {
    case 'empty':
      return (
        <Message
          icon={<ScanSearchIcon className="size-5" />}
          title={`Enter ${withArticle(family.noun)}`}
        >
          The number field is empty.
        </Message>
      )
    case 'unknown-country':
      return <Invalid title="Country not recognised">{unknownCountry}</Invalid>
    case 'invalid-format':
      return (
        <Invalid title="Invalid format" country={result.country} number={result.number}>
          This number does not match the {result.country.vat ? 'official structure' : 'format'} for{' '}
          {result.country.name}. Expected <ExpectedFormats country={result.country} />.
        </Invalid>
      )
    case 'invalid-check-digit':
      return (
        <Invalid title="Invalid check digit" country={result.country} number={result.number}>
          The format is right, but the check digit is wrong, so this is not a valid{' '}
          {result.types.map(type => type.name).join(' or ')} (
          {result.types.map(type => type.algorithm).join('; ')}).
        </Invalid>
      )
    case 'valid':
      if (!result.verified) {
        return (
          <Valid title="Valid format" country={result.country} number={result.number}>
            This number matches the official structure for {result.country.name}. Its check digit is
            not verified, as this kind of number is not covered. To confirm it is registered, check
            it on <ViesLink />.
          </Valid>
        )
      }
      return (
        <Valid title={`Valid ${family.noun}`} country={result.country} number={result.number}>
          {result.type && (
            <span className="mb-1 block font-medium text-foreground">
              {describeType(result.type)}
            </span>
          )}
          Both the format and the check digit are correct.
          {result.country.vat && (
            <>
              {' '}
              To confirm it is registered, check it on <ViesLink />.
            </>
          )}
        </Valid>
      )
  }
}

interface OutcomeProps {
  title: string
  country?: FamilyCountry
  number?: string
  children: ReactNode
}

function Valid(props: OutcomeProps) {
  return (
    <Message
      icon={<CircleCheckIcon className="size-6 text-success" />}
      iconClassName="bg-success/10"
      {...props}
    />
  )
}

function Invalid(props: OutcomeProps) {
  return (
    <Message
      icon={<CircleXIcon className="size-6 text-destructive" />}
      iconClassName="bg-destructive/10"
      {...props}
    />
  )
}

function Message({
  icon,
  iconClassName = 'bg-muted text-muted-foreground',
  title,
  country,
  number,
  children,
}: OutcomeProps & { icon: ReactNode; iconClassName?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className={cn('flex size-12 items-center justify-center rounded-full', iconClassName)}>
        {icon}
      </span>
      <p className="font-semibold">{title}</p>
      {country && (
        <p className="font-mono text-lg tracking-wider break-all">
          {country.vat && country.code}
          {number}
        </p>
      )}
      <div className="max-w-sm text-sm text-muted-foreground">{children}</div>
    </div>
  )
}
