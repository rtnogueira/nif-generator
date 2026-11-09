import { CheckIcon, CopyIcon, DownloadIcon, HashIcon } from 'lucide-react'
import { memo, useState } from 'react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardAction, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useClipboard } from '@/hooks/use-clipboard'
import { downloadXlsxColumn } from '@/lib/export-xlsx'

interface NifResultsProps {
  nifs: readonly string[]
  prefix: string
}

const EXPORT_FILE_NAME = 'nif-list'
const COPY_ALL_KEY = 'all'

export function NifResults({ nifs, prefix }: NifResultsProps) {
  const { copied, copy } = useClipboard()
  const hasResults = nifs.length > 0
  const allNifs = nifs.join('\n')

  return (
    <Card className="min-w-0 flex-1 gap-0 py-0">
      <CardHeader className="flex flex-wrap items-center gap-3 border-b py-4 [.border-b]:pb-4">
        <CardTitle className="flex items-center gap-2">
          Results
          <Badge variant="secondary" className="rounded-full tabular-nums">
            {nifs.length}
          </Badge>
        </CardTitle>
        {hasResults && (
          <CardAction className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => copy(allNifs, `Copied ${nifs.length} NIFs`, COPY_ALL_KEY)}
            >
              {copied === COPY_ALL_KEY ? <CheckIcon className="text-success" /> : <CopyIcon />}
              Copy all
            </Button>
            <ExportButton nifs={nifs} />
          </CardAction>
        )}
      </CardHeader>

      {hasResults ? (
        <div className="max-h-[32rem] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12 pl-6">#</TableHead>
                <TableHead>NIF</TableHead>
                <TableHead>Prefix</TableHead>
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
                  prefix={prefix}
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
  prefix: string
  copied: boolean
  onCopy: (nif: string, message: string) => void
}

/** Memoised so a copy only re-renders the rows whose `copied` flag changed. */
const NifRow = memo(function NifRow({ index, nif, prefix, copied, onCopy }: NifRowProps) {
  return (
    <TableRow>
      <TableCell className="pl-6 text-muted-foreground tabular-nums">{index}</TableCell>
      <TableCell className="font-mono text-[15px] tracking-wider">{nif}</TableCell>
      <TableCell>
        <Badge variant="outline" className="font-mono">
          {prefix}
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

function ExportButton({ nifs }: { nifs: readonly string[] }) {
  const [exporting, setExporting] = useState(false)

  async function handleExport() {
    setExporting(true)
    try {
      await downloadXlsxColumn('NIF', nifs, EXPORT_FILE_NAME)
    } catch {
      toast.error('Export failed, please try again')
    } finally {
      setExporting(false)
    }
  }

  return (
    <Button variant="outline" size="sm" disabled={exporting} onClick={handleExport}>
      <DownloadIcon />
      Export .xlsx
    </Button>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <HashIcon className="size-5" />
      </span>
      <p className="font-semibold">No NIFs yet</p>
      <p className="max-w-xs text-sm text-muted-foreground">
        Pick a type and quantity, then press Generate.
      </p>
    </div>
  )
}
