/**
 * Server entry used by the build (see `vite.config.ts`) to write each page's HTML into its file,
 * so crawlers that do not run JavaScript still see the content. The app does not hydrate this
 * markup: `createRoot` in `index.tsx` replaces it.
 */
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { createAppRouter } from './router'

export async function render(url: string): Promise<string> {
  const router = createAppRouter(createMemoryHistory({ initialEntries: [url] }))
  await router.load()
  return renderToString(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
}
