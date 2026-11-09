import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath, URL } from 'node:url'
import { visualizer } from 'rollup-plugin-visualizer'
import type { Plugin } from 'vite'
import { defineConfig } from 'vitest/config'

const SITE_URL = 'https://rtnogueira.com'

interface StaticPage {
  /** Route path without leading slash; emitted as `<path>.html`, which GitHub Pages serves at `/<path>`. */
  path: string
  title: string
  description: string
}

/** Routes other than `/` that need their own HTML file (so they return 200, not 404) and head tags. */
const STATIC_PAGES: StaticPage[] = [
  {
    path: 'tax-number-validator',
    title: 'Tax Number Validator (EU VAT & NIF) | rtnogueira',
    description:
      'Free online VAT number validator. Check the official format of tax numbers from all 27 EU countries, Northern Ireland and the UK, and the check digit of Portuguese NIFs.',
  },
  {
    path: 'privacy',
    title: 'Privacy Policy | rtnogueira',
    description:
      'How rtnogueira.com handles your data: tools run in your browser, plus information about Google AdSense, analytics cookies and your GDPR rights.',
  },
]

function setTag(html: string, pattern: RegExp, value: string): string {
  if (!pattern.test(html)) throw new Error(`static-pages: tag not found in index.html: ${pattern}`)
  return html.replace(pattern, `$1${value}$2`)
}

function staticPages(pages: StaticPage[]): Plugin {
  return {
    name: 'static-pages',
    apply: 'build',
    writeBundle({ dir = 'dist' }) {
      const index = readFileSync(join(dir, 'index.html'), 'utf8')
      for (const page of pages) {
        const url = `${SITE_URL}/${page.path}`
        let html = index
        html = setTag(html, /(<title>)[^<]*(<\/title>)/, page.title)
        html = setTag(html, /(<link rel="canonical" href=")[^"]*(")/, url)
        html = setTag(html, /(<meta property="og:url" content=")[^"]*(")/, url)
        for (const name of ['og:title', 'twitter:title'])
          html = setTag(html, new RegExp(`(<meta (?:property|name)="${name}" content=")[^"]*(")`), page.title)
        for (const name of ['description', 'og:description', 'twitter:description'])
          html = setTag(
            html,
            new RegExp(`(<meta (?:property|name)="${name}" content=")[^"]*(")`),
            page.description
          )
        writeFileSync(join(dir, `${page.path}.html`), html)
      }
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
    staticPages(STATIC_PAGES),
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
