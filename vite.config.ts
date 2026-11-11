import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'
import { createServer, type Plugin } from 'vite'
import { defineConfig } from 'vitest/config'
import { pageJsonLd, PAGES, pageUrl, type PageMeta, type PagePath } from './src/lib/pages'

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

function setTag(html: string, pattern: RegExp, value: string): string {
  if (!pattern.test(html)) throw new Error(`prerender: tag not found in index.html: ${pattern}`)
  return html.replace(pattern, (_, before: string, after: string) => before + value + after)
}

/** `index.html` with the head tags and structured data of `page`, and `body` inside `#root`. */
function pageHtml(index: string, page: PageMeta, body: string): string {
  const title = escapeHtml(page.title)
  const description = escapeHtml(page.description)
  const url = pageUrl(page.path)
  let html = index
  html = setTag(html, /(<title>)[^<]*(<\/title>)/, title)
  html = setTag(html, /(<link rel="canonical" href=")[^"]*(")/, url)
  html = setTag(html, /(<meta property="og:url" content=")[^"]*(")/, url)
  for (const name of ['og:title', 'twitter:title'])
    html = setTag(html, new RegExp(`(<meta (?:property|name)="${name}" content=")[^"]*(")`), title)
  for (const name of ['description', 'og:description', 'twitter:description'])
    html = setTag(
      html,
      new RegExp(`(<meta (?:property|name)="${name}" content=")[^"]*(")`),
      description
    )
  const jsonLd = JSON.stringify(pageJsonLd(page), null, 2).replace(/</g, '\\u003c')
  html = setTag(html, /(<script type="application\/ld\+json">)[^<]*(<\/script>)/, `\n${jsonLd}\n`)
  html = setTag(html, /(<div id="root">)(<\/div>)/, body)
  return html
}

/** A page at a former address that sends visitors, and search engines, to its new one. */
function redirectHtml(to: PagePath): string {
  const url = pageUrl(to)
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Moved to ${url}</title>
    <link rel="canonical" href="${url}" />
    <meta http-equiv="refresh" content="0; url=${to}" />
    <script>location.replace(${JSON.stringify(to)} + location.search + location.hash)</script>
  </head>
  <body>
    <p>This page has moved to <a href="${to}">${url}</a>.</p>
  </body>
</html>
`
}

function sitemapXml(pages: PageMeta[], lastmod: string): string {
  const urls = pages.map(
    page => `  <url>
    <loc>${pageUrl(page.path)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.sitemap.changefreq}</changefreq>
    <priority>${page.sitemap.priority.toFixed(1)}</priority>
  </url>`
  )
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`
}

/** Former addresses of pages, kept working for bookmarks and old links. */
const REDIRECTS: Partial<Record<string, PagePath>> = {
  'tax-number-validator': '/tax-id-validator',
}

/**
 * Writes one HTML file per page (`/` is `index.html`, `/privacy` is `privacy.html`, which GitHub
 * Pages serves at `/privacy`), with the page's head tags and its prerendered content, plus the
 * redirects and the sitemap.
 */
function prerender(): Plugin {
  return {
    name: 'prerender',
    apply: 'build',
    async writeBundle({ dir = 'dist' }) {
      const index = readFileSync(join(dir, 'index.html'), 'utf8')
      const server = await createServer({
        server: { middlewareMode: true, hmr: false, ws: false },
        appType: 'custom',
        logLevel: 'error',
      })
      try {
        const { render } = (await server.ssrLoadModule('/src/prerender.tsx')) as {
          render: (url: string) => Promise<string>
        }
        for (const page of Object.values(PAGES)) {
          const file = page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`
          writeFileSync(join(dir, file), pageHtml(index, page, await render(page.path)))
        }
      } finally {
        await server.close()
      }
      for (const [from, to] of Object.entries(REDIRECTS))
        if (to) writeFileSync(join(dir, `${from}.html`), redirectHtml(to))
      const today = new Date().toISOString().slice(0, 10)
      writeFileSync(join(dir, 'sitemap.xml'), sitemapXml(Object.values(PAGES), today))
    },
  }
}

// https://vite.dev/config/
export default defineConfig(() => ({
  // Served from the root of the custom domain (rtnogueira.com) on GitHub Pages.
  base: '/',
  plugins: [
    tanstackRouter({ target: 'react', autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    prerender(),
    !!process.env.ANALYZE && visualizer({ filename: 'stats.html', open: true, gzipSize: true }),
  ],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      reportsDirectory: './coverage',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/routeTree.gen.ts', 'src/components/ui/**', 'src/**/*.test.{ts,tsx}'],
    },
  },
}))
