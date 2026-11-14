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

const MAX_DRAWS = 100_000

/**
 * Builds a generator from a candidate factory: candidates are drawn until one is valid. This
 * rejects the bodies for which an algorithm has no valid check digit (e.g. a mod-11 remainder of
 * 10), instead of mapping them to a wrong digit. It gives up, rather than hang, when no candidate
 * can be valid (e.g. a number that cannot hold the birth date it was asked for).
 */
export function rejectionSampler<Args extends unknown[]>(
  candidate: (...args: Args) => string,
  isValid: (n: string) => boolean
) {
  return (...args: Args) => {
    for (let draw = 0; draw < MAX_DRAWS; draw++) {
      const number = candidate(...args)
      if (isValid(number)) return number
    }
    throw new Error('No valid number could be generated')
  }
}
