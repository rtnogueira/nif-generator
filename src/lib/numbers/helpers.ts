/** Building blocks shared by the number definitions of every family. */

/** Splits `number` at `positions` and joins the parts with `separators` (one per split). */
export function split(
  number: string,
  positions: readonly number[],
  separators: string | readonly string[]
) {
  let result = ''
  let start = 0
  positions.forEach((end, i) => {
    result +=
      number.slice(start, end) + (typeof separators === 'string' ? separators : separators[i])
    start = end
  })
  return result + number.slice(start)
}

/**
 * Builds a generator from a candidate factory: candidates are drawn until one is valid. This
 * rejects the bodies for which an algorithm has no valid check digit (e.g. a mod-11 remainder of
 * 10), instead of mapping them to a wrong digit.
 */
export function rejectionSampler<Args extends unknown[]>(
  candidate: (...args: Args) => string,
  isValid: (n: string) => boolean
) {
  return (...args: Args) => {
    for (;;) {
      const number = candidate(...args)
      if (isValid(number)) return number
    }
  }
}
