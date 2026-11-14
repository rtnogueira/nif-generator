import { clampQuantity } from '@/lib/numbers/quantity'
import { randomDigits } from '@/lib/random'
import type { NifPrefix } from './nif-types'

export const NIF_LENGTH = 9

const BODY_LENGTH = NIF_LENGTH - 1

/** Modulo-11 check digit used by the Portuguese tax authority (weights 9..2). */
function checkDigit(body: string): number {
  let sum = 0
  for (let i = 0; i < body.length; i++) {
    sum += Number(body[i]) * (body.length + 1 - i)
  }
  const remainder = sum % 11
  return remainder < 2 ? 0 : 11 - remainder
}

export function generateNif(prefix: NifPrefix): string {
  const body = prefix + randomDigits(BODY_LENGTH - prefix.length)
  return body + checkDigit(body)
}

/** Generates `count` distinct NIFs (count is clamped to the supported range). */
export function generateNifs(prefix: NifPrefix, count: number): string[] {
  const unique = new Set<string>()
  const target = clampQuantity(count)
  while (unique.size < target) unique.add(generateNif(prefix))
  return [...unique]
}

export function isValidNif(nif: string): boolean {
  if (!/^\d{9}$/.test(nif)) return false
  return checkDigit(nif.slice(0, BODY_LENGTH)) === Number(nif[BODY_LENGTH])
}
