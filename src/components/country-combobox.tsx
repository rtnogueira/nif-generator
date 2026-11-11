import { CheckIcon, ChevronDownIcon } from 'lucide-react'
import { Fragment, useState } from 'react'
import { CountryFlag } from '@/components/country-flag'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export interface CountryOption {
  code: string
  name: string
}

export interface CountryOptionGroup {
  /** Shown above the group; omit for an untitled group. */
  heading?: string
  countries: readonly CountryOption[]
}

/** An extra entry listed before the countries, e.g. "Detect from prefix". */
export interface ExtraOption {
  value: string
  label: string
}

interface CountryComboboxProps {
  id?: string
  value: string
  onValueChange: (value: string) => void
  groups: readonly CountryOptionGroup[]
  extraOptions?: readonly ExtraOption[]
}

const normalize = (text: string) =>
  text
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()

/** Matches when the search appears in the item's value (country code) or keywords (name). */
function filter(value: string, search: string, keywords: string[] = []) {
  const query = normalize(search.trim())
  return [value, ...keywords].some(text => normalize(text).includes(query)) ? 1 : 0
}

/** A searchable country picker: filters by country name or code as you type. */
export function CountryCombobox({
  id,
  value,
  onValueChange,
  groups,
  extraOptions = [],
}: CountryComboboxProps) {
  const [open, setOpen] = useState(false)
  const selectedCountry = groups.flatMap(g => g.countries).find(c => c.code === value)
  const selectedExtra = extraOptions.find(o => o.value === value)

  function select(next: string) {
    onValueChange(next)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          role="combobox"
          aria-expanded={open}
          className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30 dark:hover:bg-input/50"
        >
          <span className="flex min-w-0 items-center gap-2">
            {selectedCountry ? (
              <CountryLabel country={selectedCountry} />
            ) : (
              <span className="truncate">{selectedExtra?.label}</span>
            )}
          </span>
          <ChevronDownIcon className="size-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
        <Command filter={filter} label="Search countries">
          <CommandInput placeholder="Search country or code…" />
          <CommandList className="max-h-80">
            <CommandEmpty>No country found.</CommandEmpty>
            {extraOptions.length > 0 && (
              <CommandGroup>
                {extraOptions.map(option => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    keywords={[option.label]}
                    onSelect={() => select(option.value)}
                  >
                    <CountryFlag />
                    <span className="truncate">{option.label}</span>
                    <SelectedIcon visible={option.value === value} />
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {groups.map((group, index) => (
              <Fragment key={group.heading ?? index}>
                {(index > 0 || extraOptions.length > 0) && <CommandSeparator />}
                <CommandGroup heading={group.heading}>
                  {group.countries.map(country => (
                    <CommandItem
                      key={country.code}
                      value={country.code}
                      keywords={[country.name]}
                      onSelect={() => select(country.code)}
                    >
                      <CountryLabel country={country} />
                      <SelectedIcon visible={country.code === value} />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Fragment>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function CountryLabel({ country }: { country: CountryOption }) {
  return (
    <>
      <CountryFlag code={country.code} />
      <span className="w-7 shrink-0 rounded bg-muted px-1.5 text-center font-mono text-xs">
        {country.code}
      </span>
      <span className="truncate">{country.name}</span>
    </>
  )
}

function SelectedIcon({ visible }: { visible: boolean }) {
  return <CheckIcon className={cn('ml-auto size-4', visible ? 'opacity-100' : 'opacity-0')} />
}
