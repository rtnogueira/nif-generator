import { useState } from 'react'
import { RelatedTools } from '@/components/related-tools'
import { usePageMeta } from '@/hooks/use-page-meta'
import { validateTaxNumber, type TaxNumberValidation } from '@/lib/tax-id'
import { ValidationResult } from './validation-result'
import { ValidatorAbout } from './validator-about'
import { AUTO_DETECT, ValidatorForm, type ValidatorInput } from './validator-form'

export function TaxNumberValidator() {
  usePageMeta('/tax-id-validator')
  const [result, setResult] = useState<TaxNumberValidation | null>(null)

  function handleValidate({ country, number }: ValidatorInput) {
    setResult(validateTaxNumber(number, country === AUTO_DETECT ? undefined : country))
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Tools</p>
        <h1 className="text-3xl font-bold tracking-tight">Tax ID Validator</h1>
        <p className="max-w-2xl text-muted-foreground">
          Check whether a tax ID (tax identification number, or TIN) has the right format and check
          digit for its country. Covers the VAT numbers of all 27 EU member states, Northern Ireland
          and the United Kingdom, Portuguese NIFs, and tax numbers from countries such as Brazil,
          Switzerland, Norway, Australia and Japan. Free, instant and fully in your browser.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <ValidatorForm onValidate={handleValidate} />
        <ValidationResult result={result} />
      </div>

      <ValidatorAbout />

      <RelatedTools current="/tax-id-validator" />
    </div>
  )
}
