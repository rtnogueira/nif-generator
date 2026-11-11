/**
 * Copy and download formats for a list of generated numbers. Only the xlsx writer is heavy, so it
 * is loaded on demand (see `export-xlsx.ts`); the plain-text formats are built here.
 */

export type TextFormat = 'lines' | 'csv' | 'json' | 'comma'

/** Quotes a CSV field, doubling inner quotes (RFC 4180). */
const csvField = (value: string) => `"${value.replaceAll('"', '""')}"`

/** The numbers in a text format: one per line, CSV with a header, a JSON array, or comma-separated. */
export function formatNumbers(format: TextFormat, header: string, numbers: readonly string[]) {
  switch (format) {
    case 'lines':
      return numbers.join('\n')
    case 'comma':
      return numbers.join(', ')
    case 'json':
      return JSON.stringify(numbers, null, 2)
    case 'csv':
      return [header, ...numbers].map(csvField).join('\r\n') + '\r\n'
  }
}

const MIME_TYPES = {
  csv: 'text/csv',
  json: 'application/json',
  txt: 'text/plain',
} as const

export type TextFileExtension = keyof typeof MIME_TYPES

/** Downloads `content` as `fileName.extension`. */
export function downloadTextFile(content: string, fileName: string, extension: TextFileExtension) {
  const url = URL.createObjectURL(
    new Blob([content], { type: `${MIME_TYPES[extension]};charset=utf-8` })
  )
  const link = document.createElement('a')
  link.href = url
  link.download = `${fileName}.${extension}`
  link.click()
  // Revoked on the next tick, once the browser has started the download.
  setTimeout(() => URL.revokeObjectURL(url), 0)
}
