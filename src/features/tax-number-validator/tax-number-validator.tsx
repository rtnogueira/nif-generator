import { useState } from 'react'
import { useDocumentTitle } from '@/hooks/use-document-title'
import { SITE_NAME } from '@/lib/site'
import { validateVatNumber, type VatValidation } from '@/lib/vat'
import { ValidationResult } from './validation-result'
import { ValidatorAbout } from './validator-about'
import { AUTO_DETECT, ValidatorForm, type ValidatorInput } from './validator-form'

export function TaxNumberValidator() {
  useDocumentTitle(`Tax Number Validator (EU VAT & NIF) | ${SITE_NAME}`)
  const [result, setResult] = useState<VatValidation | null>(null)

  function handleValidate({ country, number }: ValidatorInput) {
    setResult(validateVatNumber(number, country === AUTO_DETECT ? undefined : country))
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">Tools</p>
        <h1 className="text-3xl font-bold tracking-tight">Tax Number Validator</h1>
        <p className="max-w-2xl text-muted-foreground">
          Check whether a VAT identification number has the official format for its country. Covers
          all 27 EU member states, Northern Ireland and the United Kingdom, plus the check digit of
          Portuguese NIFs. Free, instant and fully in your browser.
        </p>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        <ValidatorForm onValidate={handleValidate} />
        <ValidationResult result={result} />
      </div>

      <ValidatorAbout />
    </div>
  )
}
