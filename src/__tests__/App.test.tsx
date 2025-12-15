import { createRoot } from 'react-dom/client'
import { vi } from 'vitest'
import App from '../App'

vi.mock('react-ga')

it('renders without crashing', () => {
  const div = document.createElement('div')
  const root = createRoot(div)
  root.render(<App />)
  root.unmount()
})
