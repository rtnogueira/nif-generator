import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

/**
 * Copies text to the clipboard, confirms with a toast and remembers the `key` of the last copy
 * (defaults to the text itself) for `resetAfterMs`, so callers can show a transient "copied" state.
 */
export function useClipboard(resetAfterMs = 1000) {
  const [copied, setCopied] = useState<string | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(
    async (text: string, message = 'Copied to clipboard', key = text) => {
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        toast.error('Could not access the clipboard')
        return
      }
      toast.success(message)
      setCopied(key)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(null), resetAfterMs)
    },
    [resetAfterMs]
  )

  return { copied, copy }
}
