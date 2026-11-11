import { Link } from '@tanstack/react-router'
import type { PagePath } from '@/lib/pages'

const TOOLS: { to: PagePath; label: string; description: string }[] = [
  { to: '/', label: 'Tax ID generator', description: 'Every supported country and number type.' },
  { to: '/nif-generator', label: 'NIF generator', description: 'Portuguese NIFs of every type.' },
  {
    to: '/vat-number-generator',
    label: 'VAT number generator',
    description: 'All 27 EU member states, Northern Ireland and the UK.',
  },
  { to: '/cpf-generator', label: 'CPF generator', description: 'Brazilian CPF and CNPJ numbers.' },
  {
    to: '/tax-id-validator',
    label: 'Tax ID validator',
    description: 'Check the format and check digit of a number.',
  },
]

/** Links to the other generator pages and the validator. */
export function RelatedTools({ current }: { current: PagePath }) {
  return (
    <nav aria-labelledby="related-tools" className="flex max-w-3xl flex-col gap-3">
      <h2 id="related-tools" className="text-2xl font-semibold tracking-tight">
        Related tools
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {TOOLS.filter(tool => tool.to !== current).map(tool => (
          <li key={tool.to}>
            <Link
              to={tool.to}
              className="flex h-full flex-col gap-1 rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <span className="font-medium">{tool.label}</span>
              <span className="text-sm text-muted-foreground">{tool.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
