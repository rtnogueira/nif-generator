import { Link } from '@tanstack/react-router'
import { PAGES, toolGroups, type PagePath } from '@/lib/pages'

/** Links to the other tools, those of the current page's category first. */
export function RelatedTools({ current }: { current: PagePath }) {
  const category = PAGES[current].tool?.category
  // Every tool of the page's category, then the main tools of the other categories.
  const tools = toolGroups(page => page.tool?.category === category || Boolean(page.tool?.menu))
    .sort((a, b) => Number(b.id === category) - Number(a.id === category))
    .flatMap(group => group.pages)
    .filter(page => page.path !== current)

  return (
    <nav aria-labelledby="related-tools" className="flex max-w-3xl flex-col gap-3">
      <h2 id="related-tools" className="text-2xl font-semibold tracking-tight">
        Related tools
      </h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {tools.map(page => (
          <li key={page.path}>
            <Link
              to={page.path}
              className="flex h-full flex-col gap-1 rounded-lg border p-4 transition-colors hover:bg-muted/50"
            >
              <span className="font-medium">{page.tool?.label}</span>
              <span className="text-sm text-muted-foreground">{page.tool?.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
