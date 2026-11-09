import { useState } from 'react'
import { generateNifs, type NifPrefix } from '@/lib/nif'
import { NifOptionsForm, type NifOptions } from './nif-options-form'
import { NifResults } from './nif-results'

interface GeneratedBatch {
  prefix: NifPrefix | ''
  nifs: string[]
}

const EMPTY_BATCH: GeneratedBatch = { prefix: '', nifs: [] }

export function NifGenerator() {
  const [batch, setBatch] = useState(EMPTY_BATCH)

  function handleGenerate({ prefix, quantity }: NifOptions) {
    setBatch({ prefix, nifs: generateNifs(prefix, quantity) })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">NIF Generator</h1>
        <p className="max-w-2xl text-muted-foreground">
          Generate valid Portuguese tax identification numbers (NIF) with a correct check digit, for
          testing forms and systems.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <NifOptionsForm onGenerate={handleGenerate} />
        <NifResults nifs={batch.nifs} prefix={batch.prefix} />
      </div>
    </div>
  )
}
