import { getRouteApi } from '@tanstack/react-router'
import { useState } from 'react'
import type { GeneratedBatch } from '@/lib/tax-id'
import {
  DEFAULT_OPTIONS,
  generateBatch,
  optionsFromSearch,
  searchFromOptions,
  type NifOptions,
} from './generator-options'
import { NifAbout } from './nif-about'
import { NifOptionsForm } from './nif-options-form'
import { NifResults } from './nif-results'

const route = getRouteApi('/')

export function NifGenerator() {
  const search = route.useSearch()
  const navigate = route.useNavigate()
  // Read once: a link with options (e.g. ?country=BR&type=cpf&qty=20) fills the form and shows a
  // batch straight away. Computed in the initializers, not an effect, so it runs once.
  const [initialOptions] = useState(() => optionsFromSearch(search))
  const [batch, setBatch] = useState<GeneratedBatch | null>(() =>
    initialOptions ? generateBatch(initialOptions) : null
  )

  function handleGenerate(options: NifOptions) {
    setBatch(generateBatch(options))
    // Keep the URL in step, so the current options can be bookmarked or shared.
    void navigate({ search: searchFromOptions(options), replace: true, resetScroll: false })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Tools</p>
        <h1 className="text-3xl font-bold tracking-tight">Tax Number Generator</h1>
        <p className="max-w-2xl text-muted-foreground">
          Generate valid tax identification numbers with a correct check digit, for testing forms
          and systems, or deliberately invalid ones to check that they are rejected. Covers
          Portuguese NIFs of every type, the VAT numbers of all 27 EU member states, Northern
          Ireland and the United Kingdom, and tax numbers from countries such as Brazil,
          Switzerland, Norway, Australia and Japan. Free, instant and fully in your browser.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <NifOptionsForm
          initialOptions={initialOptions ?? DEFAULT_OPTIONS}
          onGenerate={handleGenerate}
        />
        <NifResults batch={batch} />
      </div>

      <NifAbout />
    </div>
  )
}
