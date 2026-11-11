import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// jsdom gaps used by next-themes and Radix primitives.
const noop = () => undefined
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: noop,
    removeEventListener: noop,
    addListener: noop,
    removeListener: noop,
    dispatchEvent: () => false,
  }),
})
Element.prototype.scrollIntoView = noop
Element.prototype.hasPointerCapture = () => false
Element.prototype.releasePointerCapture = noop
window.scrollTo = noop
// Used by cmdk (the searchable country picker).
window.ResizeObserver = class {
  observe = noop
  unobserve = noop
  disconnect = noop
}
