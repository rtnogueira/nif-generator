import { RefreshCwIcon } from 'lucide-react'
import { useId, useState, type SubmitEvent } from 'react'
import { CountryCombobox } from '@/components/country-combobox'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { QuantityInput } from '@/features/nif-generator/quantity-input'
import {
  COLUMN_GROUPS,
  hasFormattedNumbers,
  MAX_ROWS,
  MIN_ROWS,
  type ColumnGroupId,
} from '@/lib/dataset'
import { clampAges, MAX_AGE, MIN_AGE, PERSON_LOCALES, SEXES, type SexOption } from '@/lib/person'
import { defaultColumns, offeredColumns, type TestDataOptions } from './test-data-options'

const COUNTRY_GROUPS = [{ countries: PERSON_LOCALES }]
const SEX_LABELS: Record<SexOption, string> = { any: 'Any', female: 'Female', male: 'Male' }

interface TestDataFormProps {
  /** The groups of columns the page offers. */
  groups: readonly ColumnGroupId[]
  initialOptions: TestDataOptions
  /** True while the names and addresses of the country are loading. */
  busy: boolean
  onGenerate: (options: TestDataOptions) => void
}

export function TestDataForm({ groups, initialOptions, busy, onGenerate }: TestDataFormProps) {
  const id = useId()
  const [country, setCountry] = useState(initialOptions.country)
  const [rows, setRows] = useState(initialOptions.rows)
  const [columns, setColumns] = useState(initialOptions.columns)
  const [sex, setSex] = useState<SexOption>(initialOptions.sex)
  const [minAge, setMinAge] = useState(String(initialOptions.minAge))
  const [maxAge, setMaxAge] = useState(String(initialOptions.maxAge))
  const [formatted, setFormatted] = useState(initialOptions.formatted)

  const offered = offeredColumns(country, groups)
  const canFormat = hasFormattedNumbers(country, groups)

  function handleCountryChange(value: string) {
    if (!PERSON_LOCALES.some(locale => locale.code === value)) return
    // Keep the columns that exist for the new country, and add the ones that only it has.
    const kept = offeredColumns(value, groups)
      .map(column => column.id)
      .filter(columnId => columns.includes(columnId))
    const previous = new Set(offeredColumns(country, groups).map(column => column.id))
    const added = defaultColumns(value, groups).filter(columnId => !previous.has(columnId))
    setCountry(value)
    setColumns([...kept, ...added])
  }

  function toggleColumn(columnId: string, checked: boolean) {
    setColumns(current =>
      checked ? [...current, columnId] : current.filter(other => other !== columnId)
    )
  }

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    const ages = clampAges(Number.parseInt(minAge, 10), Number.parseInt(maxAge, 10))
    setMinAge(String(ages.minAge))
    setMaxAge(String(ages.maxAge))
    onGenerate({ country, rows, columns, sex, ...ages, formatted: canFormat && formatted })
  }

  return (
    <Card className="w-full gap-0">
      <CardHeader>
        <CardTitle>Options</CardTitle>
        <CardDescription>
          Choose a country, who to generate and the columns to show.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-country`}>Country</Label>
              <CountryCombobox
                id={`${id}-country`}
                value={country}
                onValueChange={handleCountryChange}
                groups={COUNTRY_GROUPS}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-rows`}>Rows</Label>
              <QuantityInput
                id={`${id}-rows`}
                value={rows}
                min={MIN_ROWS}
                max={MAX_ROWS}
                onValueChange={setRows}
              />
              <p className="text-xs text-muted-foreground">
                Between {MIN_ROWS} and {MAX_ROWS}.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-sex`}>Sex</Label>
              <Select value={sex} onValueChange={value => setSex(value as SexOption)}>
                <SelectTrigger id={`${id}-sex`} className="w-full data-[size=default]:h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent position="popper">
                  {SEXES.map(option => (
                    <SelectItem key={option} value={option}>
                      {SEX_LABELS[option]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <fieldset className="flex flex-col gap-2">
              <legend className="mb-2 text-sm leading-none font-medium">Age</legend>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  inputMode="numeric"
                  aria-label="Minimum age"
                  min={MIN_AGE}
                  max={MAX_AGE}
                  value={minAge}
                  onChange={event => setMinAge(event.target.value)}
                  className="h-10 text-center tabular-nums"
                />
                <span className="text-sm text-muted-foreground">to</span>
                <Input
                  type="number"
                  inputMode="numeric"
                  aria-label="Maximum age"
                  min={MIN_AGE}
                  max={MAX_AGE}
                  value={maxAge}
                  onChange={event => setMaxAge(event.target.value)}
                  className="h-10 text-center tabular-nums"
                />
              </div>
              <p className="text-xs text-muted-foreground">In years, today.</p>
            </fieldset>
          </div>

          {COLUMN_GROUPS.filter(group => groups.includes(group.id)).map(group => {
            const groupColumns = offered.filter(column => column.group === group.id)
            if (groupColumns.length === 0) return null
            return (
              <fieldset key={group.id} className="flex flex-col gap-3">
                <legend className="mb-3 text-sm leading-none font-medium">
                  {groups.length > 1 ? `${group.label} columns` : 'Columns'}
                </legend>
                <div className="grid gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-4">
                  {groupColumns.map(column => (
                    <div key={column.id} className="flex items-center gap-2.5">
                      <input
                        id={`${id}-column-${column.id}`}
                        type="checkbox"
                        checked={columns.includes(column.id)}
                        onChange={event => toggleColumn(column.id, event.target.checked)}
                        className="size-4 shrink-0 accent-primary"
                      />
                      <Label htmlFor={`${id}-column-${column.id}`} className="font-normal">
                        {column.header}
                      </Label>
                    </div>
                  ))}
                </div>
              </fieldset>
            )
          })}

          {canFormat && (
            <div className="flex items-start gap-2.5">
              <input
                id={`${id}-formatted`}
                type="checkbox"
                checked={formatted}
                onChange={event => setFormatted(event.target.checked)}
                className="mt-0.5 size-4 shrink-0 accent-primary"
              />
              <div className="flex flex-col gap-1">
                <Label htmlFor={`${id}-formatted`}>Formatted numbers</Label>
                <p className="text-xs text-muted-foreground">
                  Write numbers the usual way, e.g. an IBAN in groups of four characters.
                </p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="submit"
              size="lg"
              className="h-11"
              disabled={busy || columns.length === 0}
            >
              <RefreshCwIcon className={busy ? 'animate-spin' : undefined} />
              Generate
            </Button>
            {columns.length === 0 && (
              <p className="text-sm text-muted-foreground">Select at least one column.</p>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
