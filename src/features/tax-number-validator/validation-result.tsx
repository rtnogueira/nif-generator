import { CircleCheckIcon, CircleXIcon, ScanSearchIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import type { TaxIdType, TaxNumberValidation, ValidatorCountry } from '@/lib/tax-id'
import { cn } from '@/lib/utils'
import { VIES_VALIDATION_URL } from '@/lib/vat'
import { ExpectedFormats } from './expected-formats'

interface ValidationResultProps {
  result: TaxNumberValidation | null
}

export function ValidationResult({ result }: ValidationResultProps) {
  return (
    <Card className="min-w-0 flex-1 py-0" aria-live="polite">
      <ResultContent result={result} />
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
function describeType(type: TaxIdType) {
  return type.label.includes(type.name) ? type.label : `${type.name} · ${type.label}`
}

function ResultContent({ result }: ValidationResultProps) {
  if (!result) {
    return (
      <Message icon={<ScanSearchIcon className="size-5" />} title="Nothing validated yet">
        Enter a tax number and press Validate.
      </Message>
    )
  }

  switch (result.status) {
    case 'empty':
      return (
        <Message icon={<ScanSearchIcon className="size-5" />} title="Enter a tax number">
          The number field is empty.
        </Message>
      )
    case 'unknown-country':
      return (
        <Invalid title="Country not recognised">
          Start the number with an EU VAT prefix (such as PT, ES or DE), or pick the country from
          the list. Numbers from outside the EU need the country picked.
        </Invalid>
      )
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
        <Valid title="Valid tax number" country={result.country} number={result.number}>
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
  country?: ValidatorCountry
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
