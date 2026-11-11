import { Link } from '@tanstack/react-router'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { useCurrentPageUrl } from '@/hooks/use-current-page-url'
import { feedbackLinks, TOOLS } from './nav-links'

/** The top-bar menus on wider screens; on phones, `MobileMenu` replaces them. */
export function MainMenu() {
  const page = useCurrentPageUrl()

  return (
    <NavigationMenu viewport={false} aria-label="Main" className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-72 gap-1">
              {TOOLS.map(tool => (
                <li key={tool.to}>
                  <NavigationMenuLink asChild>
                    <Link to={tool.to} className="flex-row items-start gap-3">
                      <MenuEntry icon={tool.icon} label={tool.label}>
                        {tool.description}
                      </MenuEntry>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Feedback</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-72 gap-1">
              {feedbackLinks(page).map(link => (
                <li key={link.label}>
                  <NavigationMenuLink asChild>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-row items-start gap-3"
                    >
                      <MenuEntry icon={link.icon} label={link.label}>
                        {link.description}
                      </MenuEntry>
                    </a>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function MenuEntry({
  icon: Icon,
  label,
  children,
}: {
  icon: LucideIcon
  label: string
  children: ReactNode
}) {
  return (
    <>
      <Icon className="mt-0.5" />
      <div className="flex flex-col gap-0.5">
        <span className="font-medium">{label}</span>
        <span className="text-xs text-muted-foreground">{children}</span>
      </div>
    </>
  )
}
