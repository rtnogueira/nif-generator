import { useNavigate, useSearch } from '@tanstack/react-router'
import { useState, type ReactNode } from 'react'
import { RelatedTools } from '@/components/related-tools'
import { usePageMeta } from '@/hooks/use-page-meta'
import { trackEvent } from '@/lib/analytics'
import type { NumberFamily } from '@/lib/numbers/family'
import type { GeneratedBatch } from '@/lib/numbers/variants'
import { categoryLabel, type PagePath } from '@/lib/pages'
import {
  defaultOptions,
  generateBatch,
  optionsFromSearch,
  searchFromOptions,
  validateGeneratorSearch,
  type NifOptions,
} from './generator-options'
import { NifOptionsForm } from './nif-options-form'
import { NifResults } from './nif-results'

export interface NifGeneratorProps {
  path: PagePath
  /** The numbers the page generates. */
  family: NumberFamily
  heading: string
  intro: ReactNode
  /** Options the form starts with when the URL has none (e.g. Brazil for the CPF page). */
  preset?: Partial<NifOptions>
  /** Explanations shown below the generator. */
  about: ReactNode
}

/** The generator page (`/`) and its landing pages for one kind of number, e.g. `/cpf-generator`. */
export function NifGenerator({ path, family, heading, intro, preset, about }: NifGeneratorProps) {
  usePageMeta(path)
  const search = validateGeneratorSearch(useSearch({ strict: false }))
  const navigate = useNavigate()
  // Read once: a link with options (e.g. ?country=BR&type=cpf&qty=20) fills the form and shows a
  // batch straight away. Computed in the initializers, not an effect, so it runs once.
  const [fromUrl] = useState(() => optionsFromSearch(family, search))
  const [batch, setBatch] = useState<GeneratedBatch | null>(() =>
    fromUrl ? generateBatch(family, fromUrl) : null
  )

  function handleGenerate(options: NifOptions) {
    setBatch(generateBatch(family, options))
    trackEvent('generate_numbers', {
      tool: family.id,
      country: options.country,
      number_type: options.typeId,
      quantity: options.quantity,
      validity: options.validity,
      formatted: options.formatted,
      with_prefix: options.withPrefix,
    })
    // Keep the URL in step, so the current options can be bookmarked or shared.
    void navigate({
      to: '.',
      search: searchFromOptions(options),
      replace: true,
      resetScroll: false,
    })
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">{categoryLabel(path)}</p>
        <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
        <div className="flex max-w-2xl flex-col gap-2 text-muted-foreground">{intro}</div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <NifOptionsForm
          family={family}
          initialOptions={fromUrl ?? { ...defaultOptions(family), ...preset }}
          onGenerate={handleGenerate}
        />
        <NifResults batch={batch} />
      </div>

      {about}

      <RelatedTools current={path} />
    </div>
  )
}
