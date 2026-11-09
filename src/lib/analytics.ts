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
