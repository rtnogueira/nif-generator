import {
  AR,
  AT,
  AU,
  BE,
  BG,
  BR,
  CA,
  CH,
  CL,
  CO,
  CY,
  CZ,
  DE,
  DK,
  EE,
  ES,
  FI,
  FR,
  GB,
  GR,
  HR,
  HU,
  IE,
  IT,
  JP,
  LT,
  LU,
  LV,
  MT,
  NL,
  NO,
  NZ,
  PE,
  PL,
  PT,
  RO,
  SE,
  SI,
  SK,
  TR,
  UY,
  ZA,
} from 'country-flag-icons/react/3x2'
import { cn } from '@/lib/utils'

type FlagComponent = typeof PT

/**
 * Flags for the country codes the app supports. Imported one by one so only
 * these end up in the bundle. Non-ISO codes map to the country's flag:
 * EL (Greece in EU VAT) → GR, XI (Northern Ireland in EU VAT) → GB.
 */
const FLAGS: Record<string, FlagComponent> = {
  AR,
  AT,
  AU,
  BE,
  BG,
  BR,
  CA,
  CH,
  CL,
  CO,
  CY,
  CZ,
  DE,
  DK,
  EE,
  EL: GR,
  ES,
  FI,
  FR,
  GB,
  GR,
  HR,
  HU,
  IE,
  IT,
  JP,
  LT,
  LU,
  LV,
  MT,
  NL,
  NO,
  NZ,
  PE,
  PL,
  PT,
  RO,
  SE,
  SI,
  SK,
  TR,
  UY,
  XI: GB,
  ZA,
}

const SIZE = 'h-3.5 w-5 shrink-0'

/** A decorative flag for a country code; renders a same-size spacer when unknown. */
export function CountryFlag({ code, className }: { code?: string; className?: string }) {
  const Flag = code ? FLAGS[code.toUpperCase()] : undefined
  if (!Flag) return <span aria-hidden="true" className={cn(SIZE, className)} />
  return (
    <Flag
      aria-hidden="true"
      focusable="false"
      className={cn(SIZE, 'rounded-xs ring-1 ring-border', className)}
    />
  )
}
