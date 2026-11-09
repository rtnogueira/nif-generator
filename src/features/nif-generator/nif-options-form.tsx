import { RefreshCwIcon } from 'lucide-react'
import { useId, useState, type SubmitEvent } from 'react'
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
  TAX_ID_COUNTRIES,
  type TaxIdCountryCode,
} from '@/lib/tax-id'
import { QuantityInput } from './quantity-input'

export interface NifOptions {
  country: TaxIdCountryCode
  typeId: string
  quantity: number
  withPrefix: boolean
}

interface NifOptionsFormProps {
  onGenerate: (options: NifOptions) => void
}

const COUNTRIES_BY_NAME = [...TAX_ID_COUNTRIES]
  .map(country => ({ code: country.code, name: getTaxIdCountryName(country.code) }))
  .sort((a, b) => a.name.localeCompare(b.name))

export function NifOptionsForm({ onGenerate }: NifOptionsFormProps) {
  const id = useId()
  const [country, setCountry] = useState<TaxIdCountryCode>(DEFAULT_TAX_ID_COUNTRY)
  const [typeId, setTypeId] = useState(DEFAULT_TAX_ID_TYPE)
  const [quantity, setQuantity] = useState(MIN_QUANTITY)
  const [withPrefix, setWithPrefix] = useState(false)

  const types = getTaxIdCountry(country).types
  const type = types.find(t => t.id === typeId) ?? types[0]
  const isPortugal = country === 'PT'

  function handleCountryChange(value: string) {
    if (!isTaxIdCountryCode(value)) return
    setCountry(value)
    setTypeId(
      value === DEFAULT_TAX_ID_COUNTRY ? DEFAULT_TAX_ID_TYPE : getTaxIdCountry(value).types[0].id
    )
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    onGenerate({ country, typeId: type.id, quantity, withPrefix })
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
                    <span className="min-w-7 rounded bg-muted px-1.5 text-center font-mono text-xs">
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

          <div className="flex items-start gap-2.5">
            <input
              id={`${id}-prefix`}
              type="checkbox"
              checked={withPrefix}
              onChange={event => setWithPrefix(event.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-primary"
            />
            <div className="flex flex-col gap-1">
              <Label htmlFor={`${id}-prefix`}>Include the {country} prefix</Label>
              <p className="text-xs text-muted-foreground">
                VAT number format: <span className="font-mono text-foreground">{country}</span>{' '}
                followed by the national number.
              </p>
            </div>
          </div>

          <Button type="submit" size="lg" className="h-11">
            <RefreshCwIcon />
            Generate
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
