import { useEffect } from 'react'

/** Sets `document.title` while the calling component is mounted, restoring the previous title. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    const previous = document.title
    document.title = title
    return () => {
      document.title = previous
    }
  }, [title])
}
