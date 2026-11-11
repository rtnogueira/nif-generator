import { createFileRoute, redirect } from '@tanstack/react-router'

/** The validator's former address, kept so bookmarks and old links still work. */
export const Route = createFileRoute('/tax-number-validator')({
  beforeLoad: () => {
    throw redirect({ to: '/tax-id-validator', replace: true })
  },
})
