import { BugIcon, LightbulbIcon, ReceiptTextIcon, ShieldCheckIcon } from 'lucide-react'
import { newIssueUrl } from '@/lib/site'

/** Tools listed in the main menu. Add an entry here when a new tool route is created. */
export const TOOLS = [
  {
    to: '/',
    label: 'Tax number generator',
    description: 'Valid or invalid NIFs, EU VAT and other tax numbers for testing.',
    icon: ReceiptTextIcon,
  },
  {
    to: '/tax-number-validator',
    label: 'Tax number validator',
    description: 'Check the check digit of NIFs, EU VAT and other tax numbers.',
    icon: ShieldCheckIcon,
  },
] as const

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
