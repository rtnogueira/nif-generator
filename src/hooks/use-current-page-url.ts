import { useRouterState } from '@tanstack/react-router'

/** Absolute address of the current page, including its search params (e.g. the generator options). */
export function useCurrentPageUrl(): string {
  const href = useRouterState({ select: state => state.location.href })
  return window.location.origin + href
}
