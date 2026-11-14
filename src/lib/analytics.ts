declare global {
  interface Window {
    dataLayer?: unknown[]
  }
}

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID

function gtag(..._args: unknown[]) {
  // gtag.js expects the raw `arguments` object, not an array.
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer?.push(arguments)
}

/** Loads Google Analytics 4 only when a measurement ID is configured. */
export function initAnalytics(): void {
  if (!measurementId || window.dataLayer) return

  window.dataLayer = []
  gtag('js', new Date())
  gtag('config', measurementId, { send_page_view: false })

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
  document.head.appendChild(script)
}

export function trackPageView(path: string): void {
  if (!measurementId) return
  gtag('event', 'page_view', { page_path: path, page_location: window.location.href })
}

/**
 * What visitors do in the tools. Events only carry choices (which tool, country, kind of number,
 * how many): never a generated value or a number someone validates.
 */
export interface UsageEvents {
  /** A batch of numbers was generated. */
  generate_numbers: {
    tool: string
    country: string
    number_type: string
    quantity: number
    validity: string
    formatted: boolean
    with_prefix: boolean
  }
  /** A number was validated; `country` is "auto" when it was taken from the number. */
  validate_number: { tool: string; country: string; result: string }
  /** A table of people was generated. */
  generate_table: {
    tool: string
    country: string
    rows: number
    column_count: number
    /** Ids of the selected columns, comma-separated (cut to the 100 characters GA4 keeps). */
    columns: string
    formatted: boolean
  }
  /** Results were copied: one value or row, or all of them in a format. */
  copy_results: { tool: string; scope: 'single' | 'all'; format: string }
  /** Results were exported to a file. */
  export_results: { tool: string; format: string }
}

/** GA4 keeps at most 100 characters of an event parameter. */
const MAX_PARAMETER_LENGTH = 100

/** Records a usage event; does nothing when analytics is not configured. */
export function trackEvent<Name extends keyof UsageEvents>(
  name: Name,
  params: UsageEvents[Name]
): void {
  if (!measurementId) return
  const trimmed = Object.fromEntries(
    Object.entries(params).map(([key, value]) => [
      key,
      typeof value === 'string' ? value.slice(0, MAX_PARAMETER_LENGTH) : value,
    ])
  )
  gtag('event', name, trimmed)
}
