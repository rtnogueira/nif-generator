import { useEffect } from 'react'
import { pageUrl, PAGES, type PagePath } from '@/lib/pages'

function setContent(selector: string, attribute: 'content' | 'href', value: string) {
  document.head.querySelector(selector)?.setAttribute(attribute, value)
}

/**
 * Updates the title, description, canonical URL and social tags of `index.html` to the page's, as
 * the build writes them into each page's HTML file. Needed after client-side navigation.
 */
export function usePageMeta(path: PagePath): void {
  useEffect(() => {
    const { title, description } = PAGES[path]
    const url = pageUrl(path)
    document.title = title
    setContent('link[rel="canonical"]', 'href', url)
    setContent('meta[property="og:url"]', 'content', url)
    for (const name of ['og:title', 'twitter:title'])
      setContent(`meta[property="${name}"], meta[name="${name}"]`, 'content', title)
    for (const name of ['description', 'og:description', 'twitter:description'])
      setContent(`meta[property="${name}"], meta[name="${name}"]`, 'content', description)
  }, [path])
}
