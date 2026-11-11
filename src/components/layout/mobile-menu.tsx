import { Link } from '@tanstack/react-router'
import { MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useCurrentPageUrl } from '@/hooks/use-current-page-url'
import { feedbackLinks, TOOLS } from './nav-links'

/** Burger menu with the tools and feedback links, shown instead of `MainMenu` on phones. */
export function MobileMenu() {
  const page = useCurrentPageUrl()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
          <MenuIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Tools</DropdownMenuLabel>
        {TOOLS.map(tool => (
          <DropdownMenuItem key={tool.to} asChild>
            <Link to={tool.to}>
              <tool.icon />
              {tool.label}
            </Link>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Feedback</DropdownMenuLabel>
        {feedbackLinks(page).map(link => (
          <DropdownMenuItem key={link.label} asChild>
            <a href={link.href} target="_blank" rel="noreferrer">
              <link.icon />
              {link.label}
            </a>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
