import { ShieldCheckIcon } from 'lucide-react'
import { useId, useState, type SubmitEvent } from 'react'
import { CountryCombobox, type CountryOptionGroup } from '@/components/country-combobox'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { getExpectedFormats, type NumberFamily } from '@/lib/numbers/family'
import { ExpectedFormats } from './expected-formats'

/** Select value meaning "take the country from the number's prefix". */
export const AUTO_DETECT = 'auto'

export interface ValidatorInput {
  /** A country code, or `AUTO_DETECT`. */
  country: string
  number: string
}

interface ValidatorFormProps {
  family: NumberFamily
  /** Under the form's title: how to enter a number. */
  hint: string
  /** Example shown in the empty field when no country is picked. */
  placeholder: string
  onValidate: (input: ValidatorInput) => void
}

const EXTRA_OPTIONS = [{ value: AUTO_DETECT, label: 'Detect from prefix' }]
const COUNTRY_GROUPS = new Map<NumberFamily, CountryOptionGroup[]>()

/** The family's countries by name, with the VIES countries in a group of their own. */
function countryGroups(family: NumberFamily): CountryOptionGroup[] {
  let groups = COUNTRY_GROUPS.get(family)
  if (!groups) {
    const countries = [...family.countries].sort((a, b) => a.name.localeCompare(b.name))
    const vies = countries.filter(c => c.vat)
    groups =
      vies.length > 0
        ? [
            { heading: 'EU VAT (VIES)', countries: vies },
            { heading: 'Other countries', countries: countries.filter(c => !c.vat) },
          ]
        : [{ countries }]
    COUNTRY_GROUPS.set(family, groups)
  }
  return groups
}

export function ValidatorForm({ family, hint, placeholder, onValidate }: ValidatorFormProps) {
  const id = useId()
  const [country, setCountry] = useState(
    family.detectsCountry ? AUTO_DETECT : family.defaultCountry
  )
  const [number, setNumber] = useState('')
  const selected = family.getCountry(country)

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    onValidate({ country, number })
  }

  return (
    <Card className="w-full gap-0 lg:max-w-sm">
      <CardHeader>
        <CardTitle>{family.noun.charAt(0).toUpperCase() + family.noun.slice(1)}</CardTitle>
        <CardDescription>{hint}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-country`}>Country</Label>
            <CountryCombobox
              id={`${id}-country`}
              value={country}
              onValueChange={value =>
                (value === AUTO_DETECT || family.getCountry(value)) && setCountry(value)
              }
              groups={countryGroups(family)}
              extraOptions={family.detectsCountry ? EXTRA_OPTIONS : undefined}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`${id}-number`}>Number</Label>
            <Input
              id={`${id}-number`}
              value={number}
              onChange={event => setNumber(event.target.value)}
              placeholder={selected ? getExpectedFormats(selected)[0].formats[0] : placeholder}
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
