import { useRouterState } from '@tanstack/react-router'
import { SITE_URL } from '@/lib/pages'

/** Absolute address of the current page, including its search params (e.g. the generator options). */
export function useCurrentPageUrl(): string {
  const href = useRouterState({ select: state => state.location.href })
  // window is undefined when the build prerenders the page.
  const origin = typeof window === 'undefined' ? SITE_URL : window.location.origin
  return origin + href
}
