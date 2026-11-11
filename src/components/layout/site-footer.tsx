import { Link, useRouterState } from '@tanstack/react-router'
import { BugIcon, CoffeeIcon, HeartIcon, LightbulbIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { AUTHOR_NAME, AUTHOR_URL, BUY_ME_A_COFFEE_URL, newIssueUrl } from '@/lib/site'

const FOOTER_LINK = 'inline-flex items-center gap-1.5 hover:text-foreground hover:underline'

export function SiteFooter() {
  // The page and its options (e.g. ?country=BR&type=cpf), so a bug report says how to reproduce it.
  const href = useRouterState({ select: state => state.location.href })
  const page = window.location.origin + href

  return (
    <footer className="border-t">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-5 text-sm text-muted-foreground sm:px-6">
        <p className="flex items-center gap-1.5">
          Made with
          <HeartIcon className="size-3.5 fill-heart text-heart" aria-label="love" role="img" />
          by
          <a
            href={AUTHOR_URL}
            target="_blank"
            rel="noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            {AUTHOR_NAME}
          </a>
        </p>
        <p>For QA testing purposes only. Not for fraudulent use.</p>
        <Link to="/privacy" className="hover:text-foreground hover:underline">
          Privacy policy
        </Link>
        <a
          href={newIssueUrl('bug', page)}
          target="_blank"
          rel="noreferrer"
          className={FOOTER_LINK}
          title="Opens an issue on GitHub (a GitHub account is needed)"
        >
          <BugIcon className="size-3.5" />
          Report a bug
        </a>
        <a
          href={newIssueUrl('feature', page)}
          target="_blank"
          rel="noreferrer"
          className={FOOTER_LINK}
          title="Opens an issue on GitHub (a GitHub account is needed)"
        >
          <LightbulbIcon className="size-3.5" />
          Suggest a feature
        </a>
        <Button variant="outline" size="sm" className="sm:ml-auto" asChild>
          <a href={BUY_ME_A_COFFEE_URL} target="_blank" rel="noreferrer">
            <CoffeeIcon />
            Buy me a coffee
          </a>
        </Button>
      </div>
    </footer>
  )
}
