import { CircleCheckIcon, CircleXIcon, ScanSearchIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { VIES_VALIDATION_URL, type VatCountry, type VatValidation } from '@/lib/vat'
import { ExpectedFormats } from './expected-formats'

interface ValidationResultProps {
  result: VatValidation | null
}

export function ValidationResult({ result }: ValidationResultProps) {
  return (
    <Card className="min-w-0 flex-1 py-0" aria-live="polite">
      <ResultContent result={result} />
    </Card>
  )
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
          Start the number with a supported country prefix (such as PT, ES or DE), or pick the
          country from the list.
        </Invalid>
      )
    case 'invalid-format':
      return (
        <Invalid title="Invalid format" country={result.country} number={result.number}>
          This number does not match the official structure for {result.country.name}. Expected{' '}
          <ExpectedFormats country={result.country} />.
        </Invalid>
      )
    case 'invalid-check-digit':
      return (
        <Invalid title="Invalid check digit" country={result.country} number={result.number}>
          The format is right, but the last digit does not match the modulo-11 check digit, so this
          is not a valid Portuguese NIF.
        </Invalid>
      )
    case 'valid':
      return result.country.checkDigit ? (
        <Valid title="Valid tax number" country={result.country} number={result.number}>
          Both the format and the check digit are correct.
        </Valid>
      ) : (
        <Valid title="Valid format" country={result.country} number={result.number}>
          This number matches the official structure for {result.country.name}. To confirm it is
          registered, check it on{' '}
          <a
            href={VIES_VALIDATION_URL}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground underline underline-offset-4"
          >
            VIES
          </a>
          .
        </Valid>
      )
  }
}

interface OutcomeProps {
  title: string
  country?: VatCountry
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
          {country.code}
          {number}
        </p>
      )}
      <p className="max-w-sm text-sm text-muted-foreground">{children}</p>
    </div>
  )
}
