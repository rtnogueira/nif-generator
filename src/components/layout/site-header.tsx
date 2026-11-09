import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { GITHUB_REPO_URL, SITE_NAME } from '@/lib/site'
import { GithubIcon } from './icons'
import { MainMenu } from './main-menu'
import { ThemeToggle } from './theme-toggle'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center gap-4 px-4 sm:gap-6 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 font-semibold">
          <img
            src={`${import.meta.env.BASE_URL}logo.svg`}
            alt=""
            width={32}
            height={32}
            className="size-8 rounded-md"
          />
          <span>{SITE_NAME}</span>
        </Link>

        <MainMenu />

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
