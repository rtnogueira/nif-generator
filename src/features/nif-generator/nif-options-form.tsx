import { RefreshCwIcon } from 'lucide-react'
import { useId, useState, type ReactNode, type SubmitEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MAX_QUANTITY, MIN_QUANTITY } from '@/lib/nif'
import {
  DEFAULT_TAX_ID_COUNTRY,
  DEFAULT_TAX_ID_TYPE,
  getTaxIdCountry,
  getTaxIdCountryName,
  isTaxIdCountryCode,
  isValidity,
  isViesCountry,
  TAX_ID_COUNTRIES,
  type TaxIdCountryCode,
  type TaxIdType,
  type Validity,
} from '@/lib/tax-id'
import type { NifOptions } from './generator-options'
import { QuantityInput } from './quantity-input'

const FORMAT_EXAMPLES = new Map<TaxIdType, string>()

/** A formatted example number, generated once per type so it does not change on every render. */
function formatExample(type: TaxIdType): string | undefined {
  if (!type.format) return undefined
  let example = FORMAT_EXAMPLES.get(type)
  if (!example) {
    example = type.format(type.generate())
    FORMAT_EXAMPLES.set(type, example)
  }
  return example
}

interface NifOptionsFormProps {
  initialOptions: NifOptions
  onGenerate: (options: NifOptions) => void
}

const VALIDITY_OPTIONS: { value: Validity; label: string; description: string }[] = [
  { value: 'valid', label: 'Valid', description: 'Correct format and check digit.' },
  {
    value: 'invalid-check-digit',
    label: 'Invalid check digit',
    description: 'Right format, wrong check digit: forms should reject these.',
  },
  {
    value: 'invalid-length',
    label: 'Invalid length',
    description: 'Digits added or removed: forms should reject these.',
  },
]

const COUNTRIES_BY_NAME = [...TAX_ID_COUNTRIES]
  .map(country => ({ code: country.code, name: getTaxIdCountryName(country.code) }))
  .sort((a, b) => a.name.localeCompare(b.name))

export function NifOptionsForm({ initialOptions, onGenerate }: NifOptionsFormProps) {
  const id = useId()
  const [country, setCountry] = useState<TaxIdCountryCode>(initialOptions.country)
  const [typeId, setTypeId] = useState(initialOptions.typeId)
  const [quantity, setQuantity] = useState(initialOptions.quantity)
  const [withPrefix, setWithPrefix] = useState(initialOptions.withPrefix)
  const [formatted, setFormatted] = useState(initialOptions.formatted)
  const [validity, setValidity] = useState<Validity>(initialOptions.validity)

  const types = getTaxIdCountry(country).types
  const type = types.find(t => t.id === typeId) ?? types[0]
  const isPortugal = country === 'PT'
  const vies = isViesCountry(country)
  const canFormat = Boolean(type.format) && validity !== 'invalid-length'
  const validityOption = VALIDITY_OPTIONS.find(option => option.value === validity)
  const example = formatExample(type)

  function handleCountryChange(value: string) {
    if (!isTaxIdCountryCode(value)) return
    setCountry(value)
    setTypeId(
      value === DEFAULT_TAX_ID_COUNTRY ? DEFAULT_TAX_ID_TYPE : getTaxIdCountry(value).types[0].id
    )
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    onGenerate({
      country,
      typeId: type.id,
      quantity,
      withPrefix: vies && withPrefix,
      // Numbers of the wrong length have no written form.
      formatted: canFormat && formatted,
      validity,
    })
  }

  return (
    <Card className="w-full gap-0 lg:max-w-sm">
      <CardHeader>
        <CardTitle>Options</CardTitle>
        <CardDescription>Choose a country, a number type and how many to generate.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-country`}>Country</Label>
            <Select value={country} onValueChange={handleCountryChange}>
              <SelectTrigger id={`${id}-country`} className="w-full data-[size=default]:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" className="max-h-80">
                {COUNTRIES_BY_NAME.map(c => (
                  <SelectItem key={c.code} value={c.code}>
                    <span className="w-7 rounded bg-muted px-1.5 text-center font-mono text-xs">
                      {c.code}
                    </span>
                    <span className="truncate">{c.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-type`}>Type</Label>
            <Select value={type.id} onValueChange={setTypeId}>
              <SelectTrigger id={`${id}-type`} className="w-full data-[size=default]:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" className="max-h-80">
                {types.map(t => (
                  <SelectItem key={t.id} value={t.id}>
                    <span className="min-w-7 shrink-0 rounded bg-muted px-1.5 text-center font-mono text-xs">
                      {t.badge}
                    </span>
                    <span className="truncate">{t.label}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              {isPortugal ? (
                <>
                  NIFs will start with{' '}
                  <span className="font-mono text-foreground">{type.badge}</span>
                </>
              ) : (
                <>Check digit: {type.algorithm}.</>
              )}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-quantity`}>Quantity</Label>
            <QuantityInput
              id={`${id}-quantity`}
              value={quantity}
              min={MIN_QUANTITY}
              max={MAX_QUANTITY}
              onValueChange={setQuantity}
            />
            <p className="text-xs text-muted-foreground">
              Between {MIN_QUANTITY} and {MAX_QUANTITY}.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-validity`}>Validity</Label>
            <Select
              value={validity}
              onValueChange={value => isValidity(value) && setValidity(value)}
            >
              <SelectTrigger id={`${id}-validity`} className="w-full data-[size=default]:h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper">
                {VALIDITY_OPTIONS.map(option => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">{validityOption?.description}</p>
          </div>

          {vies && (
            <CheckboxField
              id={`${id}-prefix`}
              label={`Include the ${country} prefix`}
              checked={withPrefix}
              onChange={setWithPrefix}
            >
              VAT number format: <span className="font-mono text-foreground">{country}</span>{' '}
              followed by the national number.
            </CheckboxField>
          )}

          {canFormat && example && (
            <CheckboxField
              id={`${id}-formatted`}
              label="Formatted"
              checked={formatted}
              onChange={setFormatted}
            >
              Written the usual way, e.g.{' '}
              <span className="font-mono whitespace-nowrap text-foreground">{example}</span>
            </CheckboxField>
          )}

          <Button type="submit" size="lg" className="h-11">
            <RefreshCwIcon />
            Generate
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

interface CheckboxFieldProps {
  id: string
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  children: ReactNode
}

function CheckboxField({ id, label, checked, onChange, children }: CheckboxFieldProps) {
  return (
    <div className="flex items-start gap-2.5">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={event => onChange(event.target.checked)}
        className="mt-0.5 size-4 shrink-0 accent-primary"
      />
      <div className="flex flex-col gap-1">
        <Label htmlFor={id}>{label}</Label>
        <p className="text-xs text-muted-foreground">{children}</p>
      </div>
    </div>
  )
}
