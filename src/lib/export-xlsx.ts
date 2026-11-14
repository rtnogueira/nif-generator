/**
 * Spreadsheet downloads. The xlsx writer is loaded on demand so it never weighs on the initial
 * bundle.
 */

/** Downloads a spreadsheet with a bold header row; every value is written as text. */
export async function downloadXlsxTable(
  headers: readonly string[],
  rows: readonly (readonly string[])[],
  fileName: string
): Promise<void> {
  const { default: writeXlsxFile } = await import('write-excel-file/browser')

  await writeXlsxFile(
    [
      headers.map(value => ({ value, fontWeight: 'bold' as const })),
      ...rows.map(row => row.map(value => ({ value, type: String }))),
    ],
    { columns: headers.map(() => ({ width: 22 })) }
  ).toFile(`${fileName}.xlsx`)
}

/** Downloads a single-column spreadsheet. */
export async function downloadXlsxColumn(
  header: string,
  values: readonly string[],
  fileName: string
): Promise<void> {
  const { default: writeXlsxFile } = await import('write-excel-file/browser')

  await writeXlsxFile([[{ value: header, fontWeight: 'bold' }], ...values.map(value => [value])], {
    columns: [{ width: 22 }],
  }).toFile(`${fileName}.xlsx`)
}
