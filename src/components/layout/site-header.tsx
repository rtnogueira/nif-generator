import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { GITHUB_REPO_URL } from '@/lib/site'
import { GithubIcon } from './icons'
import { ThemeToggle } from './theme-toggle'

/** Generators listed in the header. Add an entry here when a new generator route is created. */
const NAV_ITEMS = [{ to: '/', label: 'NIF' }] as const

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4 sm:gap-6 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 font-semibold">
          <img
            src={`${import.meta.env.BASE_URL}logo.png`}
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-md"
          />
          <span className="hidden sm:inline">Generator of Things</span>
        </Link>

        <nav aria-label="Generators" className="flex gap-1">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:bg-accent data-[status=active]:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild>
            <a
              href={GITHUB_REPO_URL}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub repository"
            >
              <GithubIcon />
            </a>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
