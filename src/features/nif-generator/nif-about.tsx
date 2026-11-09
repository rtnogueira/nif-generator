import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { MAX_QUANTITY, NIF_TYPES } from '@/lib/nif'

const FAQ = [
  {
    question: 'Are the generated NIFs real?',
    answer:
      'They are mathematically valid — the prefix and check digit follow the official rules — but they are randomly generated and not tied to any person or company. A generated number may coincide with one that has been assigned, so never use them outside of test environments.',
  },
  {
    question: 'Can I use a generated NIF on an invoice or official document?',
    answer:
      'No. These numbers exist only to test forms, validations and databases. Using them for invoices, contracts, tax returns or to impersonate someone is illegal.',
  },
  {
    question: 'How many NIFs can I generate at once?',
    answer: `Up to ${MAX_QUANTITY} unique NIFs per batch. You can copy them one by one, copy the whole list, or export it to Excel (.xlsx).`,
  },
  {
    question: 'Is any data sent to a server?',
    answer:
      'No. NIFs are generated entirely in your browser using a cryptographically secure random number generator.',
  },
] as const

export function NifAbout() {
  return (
    <section
      aria-labelledby="about-nif"
      className="flex max-w-3xl flex-col gap-10 text-muted-foreground"
    >
      <div className="flex flex-col gap-3">
        <h2 id="about-nif" className="text-2xl font-semibold tracking-tight text-foreground">
          What is a NIF?
        </h2>
        <p>
          The NIF (<i lang="pt">Número de Identificação Fiscal</i>), also known as the{' '}
          <i lang="pt">número de contribuinte</i>, is the 9-digit tax identification number issued
          by the Portuguese Tax and Customs Authority (<i lang="pt">Autoridade Tributária</i>) to
          individuals, companies and other entities. Almost every Portuguese form, invoice and
          e-commerce checkout asks for one, which is why QA engineers and developers need valid test
          NIFs.
        </p>
        <p>
          This free <i lang="pt">gerador de NIF</i> creates valid Portuguese NIFs for any taxpayer
          type, so you can test validations without using real people&apos;s data.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          How is a NIF validated?
        </h2>
        <p>
          A NIF has 9 digits: a prefix that identifies the taxpayer type, followed by a sequence
          number and a final check digit computed with a modulo-11 algorithm:
        </p>
        <ol className="list-decimal space-y-1 pl-6">
          <li>Multiply the first 8 digits by the weights 9, 8, 7, 6, 5, 4, 3 and 2.</li>
          <li>Add the results and compute the remainder of dividing the sum by 11.</li>
          <li>
            If the remainder is 0 or 1, the check digit is 0; otherwise it is 11 minus the
            remainder.
          </li>
        </ol>
        <p>
          For example, for <span className="font-mono text-foreground">12345678</span> the weighted
          sum is 156, the remainder is 2, so the check digit is 9 and the full NIF is{' '}
          <span className="font-mono text-foreground">123456789</span>.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">NIF prefixes</h2>
        <p>The first digit (or first two digits) of a NIF identify the type of taxpayer:</p>
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Prefix</TableHead>
                <TableHead>Taxpayer type</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {NIF_TYPES.map(type => (
                <TableRow key={type.prefix}>
                  <TableCell className="font-mono text-foreground">{type.prefix}</TableCell>
                  <TableCell lang="pt" className="whitespace-normal">
                    {type.label}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        <h2 className="text-2xl font-semibold tracking-tight text-foreground">
          Frequently asked questions
        </h2>
        {FAQ.map(item => (
          <div key={item.question} className="flex flex-col gap-1.5">
            <h3 className="font-medium text-foreground">{item.question}</h3>
            <p>{item.answer}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
