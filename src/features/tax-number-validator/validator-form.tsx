import { ShieldCheckIcon } from 'lucide-react'
import { useId, useState, type SubmitEvent } from 'react'
import { CountryCombobox } from '@/components/country-combobox'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  getExpectedFormats,
  getValidatorCountry,
  VALIDATOR_COUNTRIES,
  type ValidatorCountry,
} from '@/lib/tax-id'
import { ExpectedFormats } from './expected-formats'

/** Select value meaning "take the country from the number's prefix". */
export const AUTO_DETECT = 'auto'

export interface ValidatorInput {
  /** A country code, or `AUTO_DETECT`. */
  country: string
  number: string
}

interface ValidatorFormProps {
  onValidate: (input: ValidatorInput) => void
}

const byName = (a: ValidatorCountry, b: ValidatorCountry) => a.name.localeCompare(b.name)
const VIES_COUNTRIES = VALIDATOR_COUNTRIES.filter(c => c.vat).sort(byName)
const OTHER_COUNTRIES = VALIDATOR_COUNTRIES.filter(c => !c.vat).sort(byName)
const COUNTRY_GROUPS = [
  { heading: 'EU VAT (VIES)', countries: VIES_COUNTRIES },
  { heading: 'Other countries', countries: OTHER_COUNTRIES },
]
const EXTRA_OPTIONS = [{ value: AUTO_DETECT, label: 'Detect from prefix' }]

export function ValidatorForm({ onValidate }: ValidatorFormProps) {
  const id = useId()
  const [country, setCountry] = useState(AUTO_DETECT)
  const [number, setNumber] = useState('')
  const selected = getValidatorCountry(country)

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    onValidate({ country, number })
  }

  return (
    <Card className="w-full gap-0 lg:max-w-sm">
      <CardHeader>
        <CardTitle>Tax number</CardTitle>
        <CardDescription>
          Pick a country, or type an EU VAT number with its country prefix.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-country`}>Country</Label>
            <CountryCombobox
              id={`${id}-country`}
              value={country}
              onValueChange={value =>
                (value === AUTO_DETECT || getValidatorCountry(value)) && setCountry(value)
              }
              groups={COUNTRY_GROUPS}
              extraOptions={EXTRA_OPTIONS}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-number`}>Number</Label>
            <Input
              id={`${id}-number`}
              value={number}
              onChange={event => setNumber(event.target.value)}
              placeholder={selected ? getExpectedFormats(selected)[0].formats[0] : 'PT123456789'}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              className="h-10 font-mono"
            />
            <p className="text-xs text-muted-foreground">
              {selected ? (
                <>
                  Expected: <ExpectedFormats country={selected} />
                </>
              ) : (
                'Spaces, dots, dashes and slashes are ignored.'
              )}
            </p>
          </div>

          <Button type="submit" size="lg" className="h-11">
            <ShieldCheckIcon />
            Validate
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
