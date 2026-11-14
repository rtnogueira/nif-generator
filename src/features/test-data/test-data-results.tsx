import { CheckIcon, ChevronDownIcon, CopyIcon, DownloadIcon, TableIcon } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardHeader, CardTitle } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useClipboard } from '@/hooks/use-clipboard'
import type { Dataset } from '@/lib/dataset'
import { downloadTextFile, formatTable, type TableFormat } from '@/lib/export'
import { downloadXlsxTable } from '@/lib/export-xlsx'
import { cn } from '@/lib/utils'

interface TestDataResultsProps {
  dataset: Dataset | null
  /** Start of export file names, e.g. "people". */
  slug: string
  /** Shown instead of the table when the data could not be generated. */
  error: string | null
}

const COPY_ALL_KEY = 'all'
const COPY_FORMATS: { format: TableFormat; label: string }[] = [
  { format: 'csv', label: 'CSV' },
  { format: 'json', label: 'JSON' },
]
const TEXT_EXPORTS: { format: 'csv' | 'json'; label: string }[] = [
  { format: 'csv', label: 'CSV (.csv)' },
  { format: 'json', label: 'JSON (.json)' },
]

export function TestDataResults({ dataset, slug, error }: TestDataResultsProps) {
  const { copied, copy } = useClipboard()
  const rows = dataset?.rows ?? []
  const headers = dataset?.columns.map(column => column.header) ?? []
  const hasResults = dataset !== null && rows.length > 0
  const copiedMessage = `Copied ${rows.length} rows`

  return (
    <Card className="min-w-0 gap-0 py-0">
      <CardHeader className="flex flex-wrap items-center gap-3 border-b py-4 [.border-b]:pb-4">
        <CardTitle className="flex items-center gap-2">
          Results
          <Badge variant="secondary" className="rounded-full tabular-nums">
            {rows.length}
          </Badge>
        </CardTitle>
        {hasResults && (
          <CardAction className="flex gap-2">
            <div className="flex">
              <Button
                variant="outline"
                size="sm"
                className="rounded-r-none"
                onClick={() => copy(formatTable('tsv', headers, rows), copiedMessage, COPY_ALL_KEY)}
              >
                {copied === COPY_ALL_KEY ? <CheckIcon className="text-success" /> : <CopyIcon />}
                Copy all
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-l-none border-l-0 px-2"
                    aria-label="More copy formats"
                  >
                    <ChevronDownIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Copy all as</DropdownMenuLabel>
                  {COPY_FORMATS.map(({ format, label }) => (
                    <DropdownMenuItem
                      key={format}
                      onSelect={() =>
                        copy(formatTable(format, headers, rows), copiedMessage, COPY_ALL_KEY)
                      }
                    >
                      {label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <ExportMenu dataset={dataset} fileName={`${slug}-${dataset.country.toLowerCase()}`} />
          </CardAction>
        )}
      </CardHeader>

      {hasResults ? (
        <div className="max-h-[36rem] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 pl-6">#</TableHead>
                {dataset.columns.map(column => (
                  <TableHead key={column.id}>{column.header}</TableHead>
                ))}
                <TableHead className="pr-6 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => {
                const key = `row-${index}`
                return (
                  <TableRow key={key}>
                    <TableCell className="pl-6 text-muted-foreground tabular-nums">
                      {index + 1}
                    </TableCell>
                    {row.map((value, i) => (
                      <TableCell
                        key={dataset.columns[i].id}
                        className={cn(dataset.columns[i].mono && 'font-mono text-[13px]')}
                      >
                        {value}
                      </TableCell>
                    ))}
                    <TableCell className="pr-6 text-right">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`Copy row ${index + 1}`}
                        onClick={() => copy(row.join('\t'), `Copied row ${index + 1}`, key)}
                      >
                        {copied === key ? <CheckIcon className="text-success" /> : <CopyIcon />}
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState error={error} />
      )}
    </Card>
  )
}

function ExportMenu({ dataset, fileName }: { dataset: Dataset; fileName: string }) {
  const [exporting, setExporting] = useState(false)
  const headers = dataset.columns.map(column => column.header)

  async function exportXlsx() {
    setExporting(true)
    try {
      await downloadXlsxTable(headers, dataset.rows, fileName)
    } catch {
      toast.error('Export failed, please try again')
    } finally {
      setExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={exporting}>
          <DownloadIcon />
          Export
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onSelect={() => void exportXlsx()}>Excel (.xlsx)</DropdownMenuItem>
        {TEXT_EXPORTS.map(({ format, label }) => (
          <DropdownMenuItem
            key={format}
            onSelect={() =>
              downloadTextFile(formatTable(format, headers, dataset.rows), fileName, format)
            }
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function EmptyState({ error }: { error: string | null }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <TableIcon className="size-5" />
      </span>
      <p className="font-semibold">{error ? 'Could not generate the data' : 'No rows yet'}</p>
      <p className="max-w-xs text-sm text-muted-foreground">
        {error ?? 'Pick a country and the columns you need, then press Generate.'}
      </p>
    </div>
  )
}
