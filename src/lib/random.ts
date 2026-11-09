/** Uniform-enough random integer in [0, max). 32-bit values keep the modulo bias negligible. */
export function randomInt(max: number): number {
  return crypto.getRandomValues(new Uint32Array(1))[0] % max
}

/** `length` random decimal digits (leading zeros allowed). */
export function randomDigits(length: number): string {
  const values = crypto.getRandomValues(new Uint32Array(length))
  let digits = ''
  for (const value of values) digits += value % 10
  return digits
}

/** One random character of `chars`. */
export function randomChar(chars: string): string {
  return chars[randomInt(chars.length)]
}

/** One random element of `items`. */
export function randomChoice<T>(items: readonly T[]): T {
  return items[randomInt(items.length)]
}
