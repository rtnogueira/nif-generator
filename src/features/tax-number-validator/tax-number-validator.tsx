import { useState, type ReactNode } from 'react'
import { RelatedTools } from '@/components/related-tools'
import { usePageMeta } from '@/hooks/use-page-meta'
import type { NumberFamily, NumberValidation } from '@/lib/numbers/family'
import { categoryLabel, type PagePath } from '@/lib/pages'
import { ValidationResult } from './validation-result'
import { AUTO_DETECT, ValidatorForm, type ValidatorInput } from './validator-form'

export interface NumberValidatorProps {
  path: PagePath
  /** The numbers the page validates. */
  family: NumberFamily
  heading: string
  intro: ReactNode
  /** Under the form's title: how to enter a number. */
  formHint: string
  /** Example shown in the empty number field. */
  placeholder: string
  /** Explains how to name the country, when it could not be found in the number. */
  unknownCountry: ReactNode
  /** Explanations shown below the validator. */
  about: ReactNode
}

/** A validator page: the tax ID validator, and the validators of the other number families. */
export function NumberValidator({
  path,
  family,
  heading,
  intro,
  formHint,
  placeholder,
  unknownCountry,
  about,
}: NumberValidatorProps) {
  usePageMeta(path)
  const [result, setResult] = useState<NumberValidation | null>(null)

  function handleValidate({ country, number }: ValidatorInput) {
    setResult(family.validate(number, country === AUTO_DETECT ? undefined : country))
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">{categoryLabel(path)}</p>
        <h1 className="text-3xl font-bold tracking-tight">{heading}</h1>
        <div className="flex max-w-2xl flex-col gap-2 text-muted-foreground">{intro}</div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <ValidatorForm
          family={family}
          hint={formHint}
          placeholder={placeholder}
          onValidate={handleValidate}
        />
        <ValidationResult family={family} result={result} unknownCountry={unknownCountry} />
      </div>

      {about}

      <RelatedTools current={path} />
    </div>
  )
}
