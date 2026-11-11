/**
 * Title, description and structured data of every page, shared by the app (which updates the head
 * on client-side navigation) and the build (which writes them into each page's HTML file, see
 * `vite.config.ts`). Keep this file free of `@/` imports: the Vite config imports it directly.
 */

export const SITE_URL = 'https://rtnogueira.com'
const SITE_NAME = 'rtnogueira'
const OG_IMAGE = `${SITE_URL}/og-image.jpg`

export type PagePath =
  | '/'
  | '/tax-id-validator'
  | '/nif-generator'
  | '/vat-number-generator'
  | '/cpf-generator'
  | '/privacy'

export interface PageMeta {
  path: PagePath
  /** Full `<title>`, ending with the site name. */
  title: string
  /** Meta description: about 150 characters, written for the search result snippet. */
  description: string
  /** Name of the page in breadcrumbs and structured data. */
  name: string
  /** For tools: the `WebApplication` of the page's structured data. */
  app?: {
    alternateName?: string[]
    description: string
    featureList?: string[]
  }
  sitemap: { changefreq: 'monthly' | 'yearly'; priority: number }
}

const AUTHOR = { '@type': 'Person', name: 'Tiago Nogueira', url: 'https://github.com/rtnogueira' }

export const PAGES: Record<PagePath, PageMeta> = {
  '/': {
    path: '/',
    title: `Tax ID Generator: EU VAT, NIF, CPF & more | ${SITE_NAME}`,
    description:
      'Free tax ID generator for QA testing: valid or invalid Portuguese NIFs, EU VAT numbers, CPF, CNPJ, ABN and other TINs. Copy or export to Excel, CSV or JSON.',
    name: 'Tax ID Generator',
    app: {
      alternateName: [
        'Tax Number Generator',
        'TIN Generator',
        'Tax Identification Number Generator',
        'NIF Generator',
        'EU VAT Number Generator',
      ],
      description:
        'Free online tool to generate valid or deliberately invalid tax identification numbers (TINs) for QA testing and development: Portuguese NIFs, EU VAT numbers and the national tax IDs of 14 more countries.',
      featureList: [
        'Portuguese NIFs of every taxpayer type',
        'VAT numbers for all 27 EU member states, Northern Ireland and the United Kingdom',
        'Tax IDs of 14 more countries, such as the Brazilian CPF and CNPJ and the Australian ABN',
        'Deliberately invalid numbers (wrong check digit or wrong length)',
        'Numbers in their usual written form',
        'Up to 50 unique numbers at once',
        'Copy to clipboard as lines, a comma-separated list or a JSON array',
        'Export to Excel (.xlsx), CSV, JSON or text',
        'Shareable options in the page address',
      ],
    },
    sitemap: { changefreq: 'monthly', priority: 1 },
  },
  '/tax-id-validator': {
    path: '/tax-id-validator',
    title: `Tax ID Validator: Check EU VAT, NIF, CPF & more | ${SITE_NAME}`,
    description:
      'Free tax ID validator: check the format and check digit of EU VAT numbers from all 27 member states and the UK, Portuguese NIFs, CPF, CNPJ, ABN and more.',
    name: 'Tax ID Validator',
    app: {
      alternateName: [
        'Tax Number Validator',
        'VAT Number Validator',
        'TIN Validator',
        'NIF Validator',
      ],
      description:
        'Free online tool that checks the format and check digit of tax identification numbers: EU VAT numbers of all 27 member states, Northern Ireland and the UK, and the tax IDs of 14 more countries.',
      featureList: [
        'Official VAT number structure of every VIES country',
        'Country detection from the VAT prefix',
        'Check-digit verification for every supported number',
        'Accepts spaces, dots, dashes and suffixes such as MVA or MWST',
      ],
    },
    sitemap: { changefreq: 'monthly', priority: 0.9 },
  },
  '/nif-generator': {
    path: '/nif-generator',
    title: `NIF Generator (Gerador de NIF): Portuguese tax numbers | ${SITE_NAME}`,
    description:
      'Generate valid Portuguese NIFs (número de contribuinte) for testing: individuals, companies (NIPC), non-residents and every other type, with a correct check digit.',
    name: 'NIF Generator',
    app: {
      alternateName: ['Gerador de NIF', 'Portuguese NIF Generator', 'NIPC Generator'],
      description:
        'Free online generator of valid or deliberately invalid Portuguese NIFs (número de identificação fiscal) of every taxpayer type, for QA testing.',
    },
    sitemap: { changefreq: 'monthly', priority: 0.9 },
  },
  '/vat-number-generator': {
    path: '/vat-number-generator',
    title: `EU VAT Number Generator: all 27 EU countries & UK | ${SITE_NAME}`,
    description:
      'Generate random, valid EU VAT numbers for testing, with a correct check digit and optional country prefix: Germany, France, Italy, Spain, all 27 EU countries and the UK.',
    name: 'VAT Number Generator',
    app: {
      alternateName: ['EU VAT Number Generator', 'VAT ID Generator', 'Random VAT Number Generator'],
      description:
        'Free online generator of valid or deliberately invalid VAT identification numbers for every EU member state, Northern Ireland and the United Kingdom, for QA testing.',
    },
    sitemap: { changefreq: 'monthly', priority: 0.9 },
  },
  '/cpf-generator': {
    path: '/cpf-generator',
    title: `CPF Generator: valid Brazilian CPF & CNPJ numbers | ${SITE_NAME}`,
    description:
      'Generate valid Brazilian CPF and CNPJ numbers for testing, plain or formatted (000.000.000-00), with both check digits computed. Gerador de CPF for QA and developers.',
    name: 'CPF Generator',
    app: {
      alternateName: ['Gerador de CPF', 'CNPJ Generator', 'Gerador de CNPJ'],
      description:
        'Free online generator of valid or deliberately invalid Brazilian CPF and CNPJ numbers, plain or formatted, for QA testing.',
    },
    sitemap: { changefreq: 'monthly', priority: 0.9 },
  },
  '/privacy': {
    path: '/privacy',
    title: `Privacy Policy | ${SITE_NAME}`,
    description:
      'How rtnogueira.com handles your data: tools run in your browser, plus information about Google AdSense, analytics cookies and your GDPR rights.',
    name: 'Privacy Policy',
    sitemap: { changefreq: 'yearly', priority: 0.3 },
  },
}

export const pageUrl = (path: PagePath) => `${SITE_URL}${path}`

/** schema.org structured data of a page, as the content of a JSON-LD script. */
export function pageJsonLd(page: PageMeta): object {
  const url = pageUrl(page.path)
  const graph: object[] = [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      inLanguage: 'en',
      image: `${SITE_URL}/logo.png`,
      author: AUTHOR,
    },
  ]
  if (page.app) {
    graph.push({
      '@type': 'WebApplication',
      name: page.name,
      ...(page.app.alternateName && { alternateName: page.app.alternateName }),
      url,
      isPartOf: { '@id': `${SITE_URL}/#website` },
      description: page.app.description,
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      browserRequirements: 'Requires JavaScript.',
      isAccessibleForFree: true,
      inLanguage: 'en',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
      author: AUTHOR,
      ...(page.app.featureList && { featureList: page.app.featureList }),
      image: OG_IMAGE,
    })
  }
  if (page.path !== '/') {
    graph.push({
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: PAGES['/'].name, item: `${SITE_URL}/` },
        { '@type': 'ListItem', position: 2, name: page.name, item: url },
      ],
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}
