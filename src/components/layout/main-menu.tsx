import { Link } from '@tanstack/react-router'
import { ReceiptTextIcon, ShieldCheckIcon } from 'lucide-react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'

/** Tools listed under "Tools" in the main menu. Add an entry here when a new tool route is created. */
const TOOLS = [
  {
    to: '/',
    label: 'Tax number generator',
    description: 'Valid NIFs, EU VAT and other tax numbers for testing.',
    icon: ReceiptTextIcon,
  },
  {
    to: '/tax-number-validator',
    label: 'Tax number validator',
    description: 'Check the check digit of NIFs, EU VAT and other tax numbers.',
    icon: ShieldCheckIcon,
  },
] as const

export function MainMenu() {
  return (
    <NavigationMenu viewport={false} aria-label="Main">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Tools</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-72 gap-1">
              {TOOLS.map(tool => (
                <li key={tool.to}>
                  <NavigationMenuLink asChild>
                    <Link to={tool.to} className="flex-row items-start gap-3">
                      <tool.icon className="mt-0.5" />
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium">{tool.label}</span>
                        <span className="text-xs text-muted-foreground">{tool.description}</span>
                      </div>
                    </Link>
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
