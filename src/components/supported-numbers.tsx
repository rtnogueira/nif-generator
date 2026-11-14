import { ExternalLink } from '@/components/page-sections'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { NumberFamily } from '@/lib/numbers/family'
import type { NumberSource } from '@/lib/numbers/types'

export const STDNUM_URL = 'https://github.com/arthurdejong/python-stdnum'

/** Link to the python-stdnum module an algorithm is ported from, e.g. `stdnum.pt.cc`. */
function stdnumUrl(module: string) {
  return `${STDNUM_URL}/blob/master/${module.replaceAll('.', '/')}.py`
}

function Source({ source }: { source?: NumberSource }) {
  return (
    <>
      {source?.stdnum && (
        <ExternalLink href={stdnumUrl(source.stdnum)}>{source.stdnum}</ExternalLink>
      )}
      {source?.stdnum && source.document && ', '}
      {source?.document && (
        <ExternalLink href={source.document.url}>official specification</ExternalLink>
      )}
    </>
  )
}

/** Every kind of number of a family: what it is, how it is checked and where the rule comes from. */
export function SupportedNumbers({ family }: { family: NumberFamily }) {
  const countries = [...family.countries].sort((a, b) => a.name.localeCompare(b.name))
  return (
    <div className="overflow-x-auto rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Country</TableHead>
            <TableHead>Number</TableHead>
            <TableHead>Check digit</TableHead>
            <TableHead>Matches the person</TableHead>
            <TableHead>Source</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {countries.flatMap(country =>
            country.types.map(type => (
              <TableRow key={`${country.code}-${type.id}`}>
                <TableCell className="text-foreground">{country.name}</TableCell>
                <TableCell className="whitespace-normal">
                  <span className="text-foreground">{type.name}</span>
                  <span className="block text-xs">{type.label}</span>
                </TableCell>
                <TableCell className="text-xs whitespace-normal">{type.algorithm}</TableCell>
                <TableCell className="text-xs">
                  {type.encodes
                    ? type.encodes
                        .map(what => (what === 'birthDate' ? 'birth date' : what))
                        .join(', ')
                    : '–'}
                </TableCell>
                <TableCell className="text-xs">
                  <Source source={type.source} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
