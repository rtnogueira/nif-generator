import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const nextTheme = resolvedTheme === 'dark' ? 'light' : 'dark'

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={`Switch to ${nextTheme} mode`}
      onClick={() => setTheme(nextTheme)}
    >
      <SunIcon className="hidden dark:block" />
      <MoonIcon className="dark:hidden" />
    </Button>
  )
}
