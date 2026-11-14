import {
  BadgeCheckIcon,
  BugIcon,
  LandmarkIcon,
  LightbulbIcon,
  ReceiptTextIcon,
  ShieldCheckIcon,
  WrenchIcon,
  type LucideIcon,
} from 'lucide-react'
import { toolGroups, type PagePath } from '@/lib/pages'
import { newIssueUrl } from '@/lib/site'

/** Menu icon of each tool. Add an entry here when a tool is added to `PAGES` with `menu: true`. */
const TOOL_ICONS: Partial<Record<PagePath, LucideIcon>> = {
  '/': ReceiptTextIcon,
  '/tax-id-validator': ShieldCheckIcon,
  '/iban-generator': LandmarkIcon,
  '/iban-validator': BadgeCheckIcon,
}

/** Tools listed in the main menu, grouped by category. They come from `PAGES` in `@/lib/pages`. */
export const TOOL_GROUPS = toolGroups(page => Boolean(page.tool?.menu)).map(group => ({
  id: group.id,
  label: group.label,
  tools: group.pages.map(page => ({
    to: page.path,
    label: page.tool?.label ?? page.name,
    description: page.tool?.description ?? '',
    icon: TOOL_ICONS[page.path] ?? WrenchIcon,
  })),
}))

/** GitHub issue forms, with `page` (the page the visitor is on) filled in. */
export function feedbackLinks(page: string) {
  return [
    {
      href: newIssueUrl('bug', page),
      label: 'Report a bug',
      description: 'Something wrong or not working? Opens a form on GitHub.',
      icon: BugIcon,
    },
    {
      href: newIssueUrl('feature', page),
      label: 'Suggest a feature',
      description: 'A new country, number type or tool. Opens a form on GitHub.',
      icon: LightbulbIcon,
    },
  ] as const
}
