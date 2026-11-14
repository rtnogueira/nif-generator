/** How many numbers a generator makes at once. */
export const MIN_QUANTITY = 1
export const MAX_QUANTITY = 50

export function clampQuantity(value: number, max = MAX_QUANTITY): number {
  if (!Number.isFinite(value)) return MIN_QUANTITY
  return Math.min(max, Math.max(MIN_QUANTITY, Math.trunc(value)))
}
