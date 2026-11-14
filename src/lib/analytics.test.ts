import { afterEach, describe, expect, it, vi } from 'vitest'

/** The module reads the measurement ID when it loads, so it is imported after the ID is set. */
async function loadAnalytics(measurementId: string) {
  vi.resetModules()
  vi.stubEnv('VITE_GA_MEASUREMENT_ID', measurementId)
  delete window.dataLayer
  return import('./analytics')
}

/** The events pushed to gtag's data layer, as [command, name, params]. */
const events = () =>
  (window.dataLayer ?? [])
    .map(entry => Array.from(entry as ArrayLike<unknown>))
    .filter(entry => entry[0] === 'event')

afterEach(() => {
  vi.unstubAllEnvs()
  delete window.dataLayer
  document.head.querySelectorAll('script[src*="googletagmanager"]').forEach(s => s.remove())
})

describe('trackEvent', () => {
  it('sends the event with its parameters once analytics is loaded', async () => {
    const { initAnalytics, trackEvent } = await loadAnalytics('G-TEST')
    initAnalytics()

    trackEvent('export_results', { tool: 'iban', format: 'csv' })
    expect(events()).toEqual([['event', 'export_results', { tool: 'iban', format: 'csv' }]])
  })

  it('cuts long text parameters to the 100 characters GA4 keeps', async () => {
    const { initAnalytics, trackEvent } = await loadAnalytics('G-TEST')
    initAnalytics()

    trackEvent('generate_table', {
      tool: 'test-data',
      country: 'PT',
      rows: 10,
      column_count: 40,
      columns: 'first-name,'.repeat(40),
      formatted: false,
    })
    const [, , params] = events()[0] as [string, string, { columns: string; rows: number }]
    expect(params.columns).toHaveLength(100)
    expect(params.rows).toBe(10)
  })

  it('does nothing when no measurement ID is configured', async () => {
    const { initAnalytics, trackEvent } = await loadAnalytics('')
    initAnalytics()

    trackEvent('export_results', { tool: 'iban', format: 'csv' })
    expect(window.dataLayer).toBeUndefined()
  })
})
