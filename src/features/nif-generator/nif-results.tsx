import { CheckIcon, ChevronDownIcon, CopyIcon, DownloadIcon, HashIcon } from 'lucide-react'
import { memo, useState } from 'react'
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
import { downloadTextFile, formatNumbers, type TextFileExtension } from '@/lib/export'
import { downloadXlsxColumn } from '@/lib/export-xlsx'
import type { GeneratedBatch, Validity } from '@/lib/tax-id'

interface NifResultsProps {
  batch: GeneratedBatch | null
}

const COPY_ALL_KEY = 'all'
const NO_NUMBERS: readonly string[] = []

const INVALID_LABELS: Partial<Record<Validity, string>> = {
  'invalid-check-digit': 'Invalid check digit',
  'invalid-length': 'Invalid length',
}

/** e.g. `tax-numbers-pt`, or `tax-numbers-pt-invalid-check-digit` for an invalid batch. */
const fileName = (batch: GeneratedBatch) =>
  `tax-numbers-${batch.country.toLowerCase()}${batch.validity === 'valid' ? '' : `-${batch.validity}`}`

export function NifResults({ batch }: NifResultsProps) {
  const { copied, copy } = useClipboard()
  const nifs = batch?.numbers ?? NO_NUMBERS
  const hasResults = batch !== null && nifs.length > 0
  const allNifs = nifs.join('\n')
  const invalidLabel = batch && INVALID_LABELS[batch.validity]

  return (
    <Card className="min-w-0 flex-1 gap-0 py-0">
      <CardHeader className="flex flex-wrap items-center gap-3 border-b py-4 [.border-b]:pb-4">
        <CardTitle className="flex items-center gap-2">
          Results
          <Badge variant="secondary" className="rounded-full tabular-nums">
            {nifs.length}
          </Badge>
          {hasResults && invalidLabel && <Badge variant="destructive">{invalidLabel}</Badge>}
        </CardTitle>
        {hasResults && (
          <CardAction className="flex gap-2">
            <div className="flex">
              <Button
                variant="outline"
                size="sm"
                className="rounded-r-none"
                onClick={() => copy(allNifs, `Copied ${nifs.length} numbers`, COPY_ALL_KEY)}
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
                  <DropdownMenuItem
                    onSelect={() =>
                      copy(
                        formatNumbers('comma', '', nifs),
                        `Copied ${nifs.length} numbers`,
                        COPY_ALL_KEY
                      )
                    }
                  >
                    Comma-separated list
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() =>
                      copy(
                        formatNumbers('json', '', nifs),
                        `Copied ${nifs.length} numbers`,
                        COPY_ALL_KEY
                      )
                    }
                  >
                    JSON array
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <ExportMenu batch={batch} />
          </CardAction>
        )}
      </CardHeader>

      {hasResults ? (
        <div className="max-h-[32rem] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 pl-6">#</TableHead>
                <TableHead>{batch.type.name}</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="pr-6 text-right">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {nifs.map((nif, index) => (
                <NifRow
                  key={nif}
                  index={index + 1}
                  nif={nif}
                  badge={batch.type.badge}
                  copied={copied === nif}
                  onCopy={copy}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <EmptyState />
      )}
    </Card>
  )
}

interface NifRowProps {
  index: number
  nif: string
  badge: string
  copied: boolean
  onCopy: (nif: string, message: string) => void
}

/** Memoised so a copy only re-renders the rows whose `copied` flag changed. */
const NifRow = memo(function NifRow({ index, nif, badge, copied, onCopy }: NifRowProps) {
  return (
    <TableRow>
      <TableCell className="pl-6 text-muted-foreground tabular-nums">{index}</TableCell>
      <TableCell className="font-mono text-[15px] tracking-wider">{nif}</TableCell>
      <TableCell>
        <Badge variant="outline" className="font-mono">
          {badge}
        </Badge>
      </TableCell>
      <TableCell className="pr-6 text-right">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={`Copy ${nif}`}
          onClick={() => onCopy(nif, `Copied ${nif}`)}
        >
          {copied ? <CheckIcon className="text-success" /> : <CopyIcon />}
        </Button>
      </TableCell>
    </TableRow>
  )
})

const TEXT_EXPORTS: { extension: TextFileExtension; label: string }[] = [
  { extension: 'csv', label: 'CSV (.csv)' },
  { extension: 'json', label: 'JSON (.json)' },
  { extension: 'txt', label: 'Text, one per line (.txt)' },
]

const TEXT_FORMATS = { csv: 'csv', json: 'json', txt: 'lines' } as const

function ExportMenu({ batch }: { batch: GeneratedBatch }) {
  const [exporting, setExporting] = useState(false)

  async function exportXlsx() {
    setExporting(true)
    try {
      await downloadXlsxColumn(batch.type.name, batch.numbers, fileName(batch))
    } catch {
      toast.error('Export failed, please try again')
    } finally {
      setExporting(false)
    }
  }

  function exportText(extension: TextFileExtension) {
    const content = formatNumbers(TEXT_FORMATS[extension], batch.type.name, batch.numbers)
    downloadTextFile(content, fileName(batch), extension)
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
        {TEXT_EXPORTS.map(({ extension, label }) => (
          <DropdownMenuItem key={extension} onSelect={() => exportText(extension)}>
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <HashIcon className="size-5" />
      </span>
      <p className="font-semibold">No numbers yet</p>
      <p className="max-w-xs text-sm text-muted-foreground">
        Pick a country, type and quantity, then press Generate.
      </p>
    </div>
  )
}
