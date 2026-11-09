import './index.css'
import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { initAnalytics, trackPageView } from './lib/analytics'
import { createAppRouter } from './router'

const router = createAppRouter()

initAnalytics()
router.subscribe('onResolved', ({ toLocation }) => trackPageView(toLocation.href))

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Root element not found')

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
