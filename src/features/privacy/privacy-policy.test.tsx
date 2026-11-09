import { createMemoryHistory, RouterProvider } from '@tanstack/react-router'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { createAppRouter } from '@/router'

describe('Privacy policy page', () => {
  it('is reachable from the footer and sets the page title', async () => {
    const user = userEvent.setup()
    const router = createAppRouter(createMemoryHistory({ initialEntries: ['/'] }))
    render(<RouterProvider router={router} />)

    await user.click(await screen.findByRole('link', { name: 'Privacy policy' }))

    expect(await screen.findByRole('heading', { level: 1, name: 'Privacy Policy' })).toBeVisible()
    expect(screen.getByRole('heading', { name: 'Advertising (Google AdSense)' })).toBeVisible()
    expect(document.title).toBe('Privacy Policy | rtnogueira')
  })
})
