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
  | '/iban-generator'
  | '/iban-validator'
  | '/id-number-generator'
  | '/id-number-validator'
  | '/cartao-de-cidadao-generator'
  | '/social-security-number-generator'
  | '/social-security-number-validator'
  | '/niss-generator'
  | '/person-generator'
  | '/privacy'

/** Groups of tools, in the order the menus list them. */
export const CATEGORIES = [
  { id: 'tax', label: 'Tax IDs' },
  { id: 'banking', label: 'Banking' },
  { id: 'identity', label: 'Identity documents' },
  { id: 'social-security', label: 'Social security' },
  { id: 'data', label: 'People & test data' },
] as const

export type CategoryId = (typeof CATEGORIES)[number]['id']

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
  /** For tools: how the menus and the related tools list the page. */
  tool?: {
    category: CategoryId
    label: string
    /** One line shown under the label. */
    description: string
    /** Listed in the main menu, not only among the related tools. */
    menu?: boolean
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
    tool: {
      category: 'tax',
      label: 'Tax ID generator',
      description: 'Valid or invalid NIFs, EU VAT and other tax IDs for testing.',
      menu: true,
    },
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
  '/nif-generator': {
    path: '/nif-generator',
    title: `NIF Generator (Gerador de NIF): Portuguese tax numbers | ${SITE_NAME}`,
    description:
      'Generate valid Portuguese NIFs (número de contribuinte) for testing: individuals, companies (NIPC), non-residents and every other type, with a correct check digit.',
    name: 'NIF Generator',
    tool: {
      category: 'tax',
      label: 'NIF generator',
      description: 'Portuguese NIFs of every type.',
    },
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
    tool: {
      category: 'tax',
      label: 'VAT number generator',
      description: 'All 27 EU member states, Northern Ireland and the UK.',
    },
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
    tool: {
      category: 'tax',
      label: 'CPF generator',
      description: 'Brazilian CPF and CNPJ numbers.',
    },
    app: {
      alternateName: ['Gerador de CPF', 'CNPJ Generator', 'Gerador de CNPJ'],
      description:
        'Free online generator of valid or deliberately invalid Brazilian CPF and CNPJ numbers, plain or formatted, for QA testing.',
    },
    sitemap: { changefreq: 'monthly', priority: 0.9 },
  },
  '/tax-id-validator': {
    path: '/tax-id-validator',
    title: `Tax ID Validator: Check EU VAT, NIF, CPF & more | ${SITE_NAME}`,
    description:
      'Free tax ID validator: check the format and check digit of EU VAT numbers from all 27 member states and the UK, Portuguese NIFs, CPF, CNPJ, ABN and more.',
    name: 'Tax ID Validator',
    tool: {
      category: 'tax',
      label: 'Tax ID validator',
      description: 'Check the check digit of NIFs, EU VAT and other tax IDs.',
      menu: true,
    },
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
  '/iban-generator': {
    path: '/iban-generator',
    title: `IBAN Generator: valid test IBANs for 89 countries | ${SITE_NAME}`,
    description:
      'Free IBAN generator for QA testing: valid or deliberately invalid IBANs for 89 countries, with correct check digits. Copy or export to Excel, CSV or JSON.',
    name: 'IBAN Generator',
    tool: {
      category: 'banking',
      label: 'IBAN generator',
      description: 'Valid or invalid IBANs of 89 countries for testing.',
      menu: true,
    },
    app: {
      alternateName: ['Gerador de IBAN', 'Random IBAN Generator', 'Test IBAN Generator'],
      description:
        'Free online tool to generate valid or deliberately invalid IBANs (International Bank Account Numbers) for QA testing and development, for every country of the IBAN registry.',
      featureList: [
        'IBANs for the 89 countries of the IBAN registry',
        'Correct ISO 7064 Mod 97-10 check digits',
        'National check digits for Belgium, Montenegro, Norway, Portugal and Spain',
        'Deliberately invalid IBANs (wrong check digit or wrong length)',
        'Printed form, in groups of four characters',
        'Up to 50 unique IBANs at once',
        'Export to Excel (.xlsx), CSV, JSON or text',
      ],
    },
    sitemap: { changefreq: 'monthly', priority: 0.9 },
  },
  '/iban-validator': {
    path: '/iban-validator',
    title: `IBAN Validator: check the structure and check digits | ${SITE_NAME}`,
    description:
      'Free IBAN validator: check the country, length, structure and check digits of an IBAN from any of the 89 countries of the IBAN registry, in your browser.',
    name: 'IBAN Validator',
    tool: {
      category: 'banking',
      label: 'IBAN validator',
      description: 'Check the structure and check digits of an IBAN.',
      menu: true,
    },
    app: {
      alternateName: ['IBAN Checker', 'Validador de IBAN'],
      description:
        'Free online tool that checks the country, length, structure and check digits of an IBAN (International Bank Account Number), for every country of the IBAN registry.',
      featureList: [
        'Structure of every country of the IBAN registry',
        'ISO 7064 Mod 97-10 check digits',
        'National check digits for Belgium, Montenegro, Norway, Portugal and Spain',
        'Accepts IBANs written with spaces, dots or dashes',
      ],
    },
    sitemap: { changefreq: 'monthly', priority: 0.9 },
  },
  '/id-number-generator': {
    path: '/id-number-generator',
    title: `Identity Number Generator: Cartão de Cidadão, DNI, PESEL & more | ${SITE_NAME}`,
    description:
      'Free identity number generator for QA testing: valid or invalid Cartão de Cidadão, DNI, PESEL, personnummer and other national ID numbers, with a correct check digit.',
    name: 'Identity Number Generator',
    tool: {
      category: 'identity',
      label: 'Identity number generator',
      description: 'Cartão de Cidadão, DNI, PESEL and other national ID numbers.',
      menu: true,
    },
    app: {
      alternateName: ['National ID Number Generator', 'ID Card Number Generator'],
      description:
        'Free online tool to generate valid or deliberately invalid identity card and population register numbers for QA testing and development, with a correct check digit.',
      featureList: [
        'Identity numbers of 22 countries, such as the Portuguese Cartão de Cidadão, the Spanish DNI and the Polish PESEL',
        'Numbers that hold a birth date and sex, for a random adult',
        'Deliberately invalid numbers (wrong check digit or wrong length)',
        'Numbers in their usual written form',
        'Export to Excel (.xlsx), CSV, JSON or text',
      ],
    },
    sitemap: { changefreq: 'monthly', priority: 0.9 },
  },
  '/id-number-validator': {
    path: '/id-number-validator',
    title: `Identity Number Validator: Cartão de Cidadão, DNI, PESEL & more | ${SITE_NAME}`,
    description:
      'Free identity number validator: check the format and check digit of a Cartão de Cidadão, DNI, NIE, PESEL, personnummer and other national ID numbers, in your browser.',
    name: 'Identity Number Validator',
    tool: {
      category: 'identity',
      label: 'Identity number validator',
      description: 'Check the check digit of national ID numbers.',
      menu: true,
    },
    app: {
      alternateName: ['National ID Number Validator', 'ID Card Number Checker'],
      description:
        'Free online tool that checks the format and check digit of identity card and population register numbers of 22 countries.',
    },
    sitemap: { changefreq: 'monthly', priority: 0.9 },
  },
  '/cartao-de-cidadao-generator': {
    path: '/cartao-de-cidadao-generator',
    title: `Cartão de Cidadão Number Generator (Gerador de CC) | ${SITE_NAME}`,
    description:
      'Generate valid Portuguese Cartão de Cidadão document numbers for testing, with the check digit computed as the official specification sets, plain or formatted.',
    name: 'Cartão de Cidadão Generator',
    tool: {
      category: 'identity',
      label: 'Cartão de Cidadão generator',
      description: 'Portuguese citizen card document numbers.',
    },
    app: {
      alternateName: ['Gerador de Cartão de Cidadão', 'Gerador de número de CC'],
      description:
        'Free online generator of valid or deliberately invalid Portuguese Cartão de Cidadão document numbers, for QA testing.',
    },
    sitemap: { changefreq: 'monthly', priority: 0.9 },
  },
  '/social-security-number-generator': {
    path: '/social-security-number-generator',
    title: `Social Security Number Generator: NISS, NIR, AHV & more | ${SITE_NAME}`,
    description:
      'Free social security number generator for QA testing: valid or invalid Portuguese NISS, French NIR, Belgian INSZ, Swiss AHV, Canadian SIN and more, with a correct check digit.',
    name: 'Social Security Number Generator',
    tool: {
      category: 'social-security',
      label: 'Social security number generator',
      description: 'NISS, NIR, AHV, SIN and other social security numbers.',
      menu: true,
    },
    app: {
      alternateName: ['Social Insurance Number Generator', 'SSN Generator'],
      description:
        'Free online tool to generate valid or deliberately invalid social security, social insurance and health insurance numbers of 9 countries for QA testing and development.',
      featureList: [
        'Portuguese NISS, French NIR, Belgian INSZ, Swiss AHV number, Canadian SIN, Greek AMKA, Irish PPS number, Austrian insurance number and the NHS number',
        'Numbers that hold a birth date and sex, for a random adult',
        'Deliberately invalid numbers (wrong check digit or wrong length)',
        'Export to Excel (.xlsx), CSV, JSON or text',
      ],
    },
    sitemap: { changefreq: 'monthly', priority: 0.9 },
  },
  '/social-security-number-validator': {
    path: '/social-security-number-validator',
    title: `Social Security Number Validator: NISS, NIR, AHV & more | ${SITE_NAME}`,
    description:
      'Free social security number validator: check the format and check digit of a Portuguese NISS, French NIR, Belgian INSZ, Swiss AHV number, Canadian SIN and more.',
    name: 'Social Security Number Validator',
    tool: {
      category: 'social-security',
      label: 'Social security number validator',
      description: 'Check the check digit of social security numbers.',
      menu: true,
    },
    app: {
      alternateName: ['Social Insurance Number Validator', 'Validador de NISS'],
      description:
        'Free online tool that checks the format and check digit of social security, social insurance and health insurance numbers of 9 countries.',
    },
    sitemap: { changefreq: 'monthly', priority: 0.9 },
  },
  '/niss-generator': {
    path: '/niss-generator',
    title: `NISS Generator (Gerador de NISS): Portuguese social security numbers | ${SITE_NAME}`,
    description:
      'Generate valid Portuguese social security numbers (NISS, Número de Identificação de Segurança Social) for testing, with a correct check digit, or invalid ones.',
    name: 'NISS Generator',
    tool: {
      category: 'social-security',
      label: 'NISS generator',
      description: 'Portuguese social security numbers.',
    },
    app: {
      alternateName: ['Gerador de NISS', 'Gerador de número de Segurança Social'],
      description:
        'Free online generator of valid or deliberately invalid Portuguese social security numbers (NISS), for QA testing.',
    },
    sitemap: { changefreq: 'monthly', priority: 0.9 },
  },
  '/person-generator': {
    path: '/person-generator',
    title: `Person Generator: fake names, birth dates & addresses | ${SITE_NAME}`,
    description:
      'Free person generator for test data: made-up names, birth dates and addresses for 36 countries. Choose the columns, then copy or export to Excel, CSV or JSON.',
    name: 'Person Generator',
    tool: {
      category: 'data',
      label: 'Person generator',
      description: 'Made-up names, birth dates and addresses for testing.',
      menu: true,
    },
    app: {
      alternateName: ['Fake Name Generator', 'Random Person Generator', 'Fake Address Generator'],
      description:
        'Free online tool to generate made-up people for QA testing and development: names, birth dates and addresses written the way each country writes them.',
      featureList: [
        'Names and addresses of 36 countries',
        'Names that match the chosen sex and birth dates within an age range',
        'Choice of columns',
        'Up to 1000 rows at once',
        'Copy as a table, CSV or JSON, or export to Excel (.xlsx), CSV or JSON',
      ],
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

/** The tools of each category that has any, in menu order. */
export function toolGroups(include: (page: PageMeta) => boolean = () => true) {
  return CATEGORIES.map(category => ({
    ...category,
    pages: Object.values(PAGES).filter(
      page => page.tool?.category === category.id && include(page)
    ),
  })).filter(group => group.pages.length > 0)
}

/** Label of the category a tool page belongs to, shown above its heading. */
export function categoryLabel(path: PagePath): string {
  const id = PAGES[path].tool?.category
  return CATEGORIES.find(category => category.id === id)?.label ?? 'Tools'
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
