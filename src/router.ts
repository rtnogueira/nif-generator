import {
  createRouter,
  parseSearchWith,
  stringifySearchWith,
  type RouterHistory,
} from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'

export function createAppRouter(history?: RouterHistory) {
  return createRouter({
    routeTree,
    history,
    basepath: import.meta.env.BASE_URL,
    defaultPreload: 'intent',
    scrollRestoration: true,
    // Search params stay plain strings (e.g. `type=2`, not `type=%222%22`); routes parse them.
    parseSearch: parseSearchWith(value => value),
    stringifySearch: stringifySearchWith(JSON.stringify),
  })
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createAppRouter>
  }
}
