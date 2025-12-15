import '@testing-library/jest-dom/vitest'
import { afterEach, expect, vi, beforeEach } from 'vitest'
import * as matchers from 'vitest-dom/matchers'
import { cleanup } from '@testing-library/react'

expect.extend(matchers)

beforeEach(() => {
  vi.clearAllMocks()
})

afterEach(() => {
  cleanup()
})
