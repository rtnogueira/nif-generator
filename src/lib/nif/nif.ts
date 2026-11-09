import type { NifPrefix } from './nif-types'

export const NIF_LENGTH = 9
export const MIN_QUANTITY = 1
export const MAX_QUANTITY = 50

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

function randomDigits(length: number): string {
  // 32-bit values keep the modulo bias negligible (vs. Uint8, where 0–5 would be favoured).
  const values = crypto.getRandomValues(new Uint32Array(length))
  let digits = ''
  for (const value of values) digits += value % 10
  return digits
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

export function clampQuantity(value: number): number {
  if (!Number.isFinite(value)) return MIN_QUANTITY
  return Math.min(MAX_QUANTITY, Math.max(MIN_QUANTITY, Math.trunc(value)))
}
