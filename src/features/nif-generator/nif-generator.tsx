import { useState } from 'react'
import { generateTaxIds, getTaxIdType, type GeneratedBatch } from '@/lib/tax-id'
import { NifAbout } from './nif-about'
import { NifOptionsForm, type NifOptions } from './nif-options-form'
import { NifResults } from './nif-results'

export function NifGenerator() {
  const [batch, setBatch] = useState<GeneratedBatch | null>(null)

  function handleGenerate({ country, typeId, quantity, withPrefix }: NifOptions) {
    const type = getTaxIdType(country, typeId)
    if (!type) return
    const numbers = generateTaxIds(type, quantity)
    setBatch({
      country,
      type,
      numbers: withPrefix ? numbers.map(number => country + number) : numbers,
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Tools</p>
        <h1 className="text-3xl font-bold tracking-tight">Tax Number Generator</h1>
        <p className="max-w-2xl text-muted-foreground">
          Generate valid tax identification numbers with a correct check digit, for testing forms
          and systems. Covers Portuguese NIFs of every type, the VAT numbers of all 27 EU member
          states, Northern Ireland and the United Kingdom, and tax numbers from countries such as
          Brazil, Switzerland, Norway, Australia and Japan. Free, instant and fully in your browser.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <NifOptionsForm onGenerate={handleGenerate} />
        <NifResults batch={batch} />
      </div>

      <NifAbout />
    </div>
  )
}
