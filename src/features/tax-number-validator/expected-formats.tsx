import type { VatCountry } from '@/lib/vat'

/** Lists a country's formats in VIES notation, e.g. "BE0999999999 or BE1999999999". */
export function ExpectedFormats({ country }: { country: VatCountry }) {
  return country.formats.map((format, index) => (
    <span key={format.notation}>
      {index > 0 && ' or '}
      <span className="font-mono whitespace-nowrap text-foreground">
        {country.code}
        {format.notation}
      </span>
    </span>
  ))
}
