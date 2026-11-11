/**
 * Downloads a single-column spreadsheet. The xlsx writer is loaded on demand so it never
 * weighs on the initial bundle.
 */
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
