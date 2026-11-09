import { describe, expect, it } from 'vitest'
import {
  clampQuantity,
  generateNif,
  generateNifs,
  isNifPrefix,
  isValidNif,
  MAX_QUANTITY,
  NIF_TYPES,
} from '.'

describe('generateNif', () => {
  it.each(NIF_TYPES.map(type => type.prefix))('creates a valid NIF for prefix %s', prefix => {
    for (let i = 0; i < 200; i++) {
      const nif = generateNif(prefix)
      expect(nif).toMatch(/^\d{9}$/)
      expect(nif.startsWith(prefix)).toBe(true)
      expect(isValidNif(nif)).toBe(true)
    }
  })
})

describe('generateNifs', () => {
  it('returns the requested number of distinct NIFs', () => {
    const nifs = generateNifs('99', MAX_QUANTITY)
    expect(nifs).toHaveLength(MAX_QUANTITY)
    expect(new Set(nifs).size).toBe(MAX_QUANTITY)
  })

  it('clamps the quantity to the supported range', () => {
    expect(generateNifs('5', 0)).toHaveLength(1)
    expect(generateNifs('5', 500)).toHaveLength(MAX_QUANTITY)
  })
})

describe('isValidNif', () => {
  it.each(['123456789', '501442600', '999999990'])('accepts %s', nif => {
    expect(isValidNif(nif)).toBe(true)
  })

  it.each(['123456780', '12345678', '1234567890', 'abcdefghi', ''])('rejects %s', nif => {
    expect(isValidNif(nif)).toBe(false)
  })
})

describe('clampQuantity', () => {
  it.each([
    [Number.NaN, 1],
    [-3, 1],
    [7.9, 7],
    [51, 50],
  ])('clamps %s to %s', (input, expected) => {
    expect(clampQuantity(input)).toBe(expected)
  })
})

describe('isNifPrefix', () => {
  it('recognises known prefixes only', () => {
    expect(isNifPrefix('45')).toBe(true)
    expect(isNifPrefix('4')).toBe(false)
  })
})
