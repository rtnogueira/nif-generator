[![CI/CD](https://github.com/rtnogueira/nif-generator/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/rtnogueira/nif-generator/actions/workflows/ci-cd.yml)

# Test data tools: tax IDs, IBANs, identity and social security numbers, people

**Free online tools to generate and validate test data for QA and development: tax identification numbers (Portuguese NIFs of every type, EU VAT numbers and the tax numbers of 14 more countries), IBANs, identity numbers, social security numbers, made-up people, and tables that combine them.**

🔗 **Live App:** https://rtnogueira.com/

## 🧾 What is a tax ID?

Most countries give every taxpayer a tax identification number: the Portuguese NIF (Número de Identificação Fiscal, or *número de contribuinte*), the VAT numbers of EU companies, the Brazilian CPF and CNPJ, the Australian ABN and many more. Most end with a check digit computed from the other digits, so forms can reject mistyped numbers. Testing those forms needs valid numbers that belong to no one, and invalid ones that should be rejected.

## ✨ Features

### Tax ID generator (`/`)

- 🇵🇹 Portuguese NIFs of every taxpayer type (individuals, companies, non-residents, public administration, investment funds and more; see [NIF types](#-nif-types-supported))
- 🌍 VAT numbers for all 27 EU member states, Northern Ireland and the UK (optionally with the country prefix), plus tax numbers from 14 more countries, all with a correct check digit. See [Supported countries](#-supported-countries)
- ❌ Deliberately invalid numbers (wrong check digit or wrong length) to test that forms reject them; invalid batches are clearly marked
- ✍️ Optionally in their usual written form (e.g. `390.533.447-05`, `CHE-113.042.942`), where python-stdnum defines one
- 🔢 Up to 50 unique numbers at once
- 📋 Copy a single number or the whole list (one per line, comma-separated or as a JSON array)
- 📄 Export to Excel (.xlsx), CSV, JSON or plain text
- 🔗 The options are kept in the URL (e.g. `/?country=BR&type=cpf&qty=20&format=1`), so a setup can be bookmarked or shared
- 🎯 Landing pages for the most searched numbers, with the form preset and their own explanations: [`/nif-generator`](https://rtnogueira.com/nif-generator), [`/vat-number-generator`](https://rtnogueira.com/vat-number-generator) and [`/cpf-generator`](https://rtnogueira.com/cpf-generator)

### Tax ID validator (`/tax-id-validator`)

The former address, `/tax-number-validator`, redirects here.

- 🛡️ Checks EU VAT numbers (all 27 member states, Northern Ireland and the UK) against the official structure published by the European Commission ([VIES](https://ec.europa.eu/taxation_customs/vies/#/faq)), detecting the country from the prefix
- ✅ Verifies the check digit of every kind of number the generator supports, including the 14 countries outside VIES, and names the kind of number that matched
- ✍️ Accepts numbers as people write them: spaces, dots, dashes and slashes are ignored, and suffixes such as the Norwegian `MVA` or Swiss `MWST` are understood

### IBAN generator (`/iban-generator`) and validator (`/iban-validator`)

- 🏦 IBANs for the 89 countries of the SWIFT IBAN registry, with the country's structure and correct ISO 7064 Mod 97-10 check digits
- 🔐 Check digits inside the account number are computed and verified for Belgium (with an assigned bank code), Montenegro, Norway, Portugal (NIB, so every IBAN starts with `PT50`) and Spain (CCC). For other countries the bank codes are random and national keys are not computed
- ❌ Deliberately invalid IBANs, the printed form in groups of four, copy and export, as in the tax ID generator
- 🛡️ The validator takes the country from the IBAN and ignores spaces, dots and dashes

The structures come from python-stdnum's `iban.dat` (SWIFT IBAN Registry, release 101) and the algorithms from `stdnum.iban`; the Portuguese NIB check follows [Banco de Portugal's IBAN specification](https://www.bportugal.pt/sites/default/files/anexos/documentos-relacionados/international_bank_account_number_pt.pdf). They are tested against the registry's sample IBANs (`src/lib/iban`).

### Identity number generator (`/id-number-generator`) and validator (`/id-number-validator`)

- 🪪 Identity card and population register numbers of 22 countries, each with a correct check digit: the Portuguese Cartão de Cidadão, Belgian national number and eID card, Bulgarian EGN and PNF, Croatian OIB, Czech and Slovak birth numbers, Estonian isikukood, Finnish henkilötunnus, Icelandic kennitala, Indian Aadhaar and VID, Israeli identity number, Japanese My Number, Lithuanian asmens kodas, Norwegian fødselsnummer, Peruvian DNI, Polish PESEL, South African ID number, South Korean RRN, Spanish DNI and NIE, Swedish personnummer, Thai PIN, Turkish T.C. Kimlik No. and Brazilian CPF
- 🎂 Numbers that hold a birth date or sex are generated for a random adult (or for a given person, see the test data generator)
- 🇵🇹 A landing page for the Cartão de Cidadão: [`/cartao-de-cidadao-generator`](https://rtnogueira.com/cartao-de-cidadao-generator)

Every algorithm (`src/lib/identity/countries.ts`) is ported from the python-stdnum module named next to it and tested against the numbers of its documentation and tests; the Cartão de Cidadão check also follows the [specification published by AMA](https://www.autenticacao.gov.pt/documents/20126/0/Valida%C3%A7%C3%A3o+de+N%C3%BAmero+de+Documento+do+Cart%C3%A3o+de+Cidad%C3%A3o+(1).pdf/7d5745ba-2bcc-e861-3954-bafe9f7591a0). Numbers whose check digit python-stdnum does not verify (e.g. the Danish CPR) are not included.

### Social security number generator (`/social-security-number-generator`) and validator (`/social-security-number-validator`)

- 🏥 Social security, social insurance and health insurance numbers of 9 countries, each with a correct check digit: the Portuguese NISS, Austrian Versicherungsnummer, Belgian INSZ/NISS, Canadian SIN, French NIR, Greek AMKA, Irish PPS number, Swiss AHV number and the NHS number
- 🇵🇹 A landing page for the NISS: [`/niss-generator`](https://rtnogueira.com/niss-generator)

The algorithms (`src/lib/social-security/countries.ts`) are ported from the python-stdnum module named next to each and tested against the numbers of its documentation and tests. The Portuguese NISS is not in python-stdnum: its check digit follows the [validators_pt](https://gist.github.com/dreispt/024dd11c160af58268e2b44019080bbf) module. Numbers without a check digit (e.g. the US SSN) are not included.

### Person generator (`/person-generator`)

- 🧑 Made-up people for 36 countries: first and last name matching the sex, birth date within an age range, and an address (street, postal code, city, region) written the way the country writes it
- 🧱 Choice of columns, up to 1000 rows, options kept in the URL (e.g. `/person-generator?country=ES&rows=50&sex=female&min=30&max=40`)
- 📋 Copy the table (tab-separated, so it pastes into a spreadsheet), or as CSV or JSON; export to Excel, CSV or JSON

Names and address data come from [Faker](https://fakerjs.dev/) (`src/lib/person`), loaded per country on demand. They are realistic, not real: the street, city and postal code are drawn separately and do not belong together.

### Test data generator (`/test-data-generator`)

- 🗃️ One made-up person per row, with the numbers they would have in the chosen country: tax number, identity number, social security number and IBAN, each with a correct check digit. For Portugal: name, birth date, address, NIF, Cartão de Cidadão, NISS and IBAN
- 🔗 Every value of a row is made for the same person: numbers that hold a birth date or sex (personnummer, PESEL, NIR...) hold the row's, and two columns that are one number in real life (the Belgian national number and INSZ) show the same value
- 🧱 Choice of columns per country, up to 1000 rows, plain or formatted numbers, options kept in the URL (e.g. `/test-data-generator?country=PT&rows=100&cols=first-name,last-name,tax-2,bank-iban`)
- 📋 Copy as a table, CSV or JSON; export to Excel, CSV or JSON (one object per row)

### Everywhere

- 🔒 Everything runs in the browser; no number is sent to a server
- 🗂️ Tools are grouped by category in the menu (`src/lib/pages.ts`)
- 🐞 Bug reports and feature requests through GitHub issue forms, linked from the footer
- 🌗 Light and dark mode, responsive layout
- 🔎 Every page is prerendered at build time with its own title, description, canonical URL and structured data (`src/lib/pages.ts`), so crawlers that do not run JavaScript see the full content; the build also writes `sitemap.xml`

## 🎯 Use Cases

Perfect for:
- QA engineers testing forms, checkouts and invoicing that ask for a tax number
- Developers implementing or debugging tax number validation
- Negative testing with numbers that must be rejected
- Seeding development and staging databases with realistic test data

## 🛠️ Technology Stack

- **React 19** + **TypeScript**
- **Vite** - Build tool and dev server
- **Tailwind CSS v4** + **shadcn/ui** (Radix primitives, lucide icons, sonner toasts)
- **TanStack Router** - Type-safe file-based routing with automatic code splitting
- **write-excel-file** - Excel export, lazy-loaded on demand
- **Vitest** + **Testing Library** - Tests

## 🚀 Getting Started

### Prerequisites

- Node.js 22.12 or higher
- pnpm 10

### Configuration

Analytics is optional. To enable Google Analytics 4, set `VITE_GA_MEASUREMENT_ID` (e.g. `G-XXXXXXX`) in a `.env.local` file or in the build environment.

### Installation

```bash
# Clone the repository
git clone https://github.com/rtnogueira/nif-generator.git

# Navigate to project directory
cd nif-generator

# Install dependencies
pnpm install

# Start development server
pnpm start

# Run tests, type check and lint
pnpm test
pnpm tscheck
pnpm lint

# Build for production (ANALYZE=1 pnpm build, or pnpm analyze, for a bundle report)
pnpm build

# Deploy to GitHub Pages
pnpm deploy
```

## 📝 NIF Types Supported

The generator supports all official Portuguese NIF categories:
- **1, 2, 3, 38, 39** - Individual (pessoa singular)
- **45** - Non-resident individual
- **5** - Corporate entity (pessoa colectiva)
- **6** - Public administration
- **71** - Non-resident corporate entity
- **70, 74, 75** - Undivided inheritance
- **72** - Investment funds
- **77, 78** - Official attribution
- **79** - Exceptional regime
- **8** - Individual entrepreneur (extinct)
- **9, 90, 91** - Irregular entities
- **98** - Non-residents without permanent establishment
- **99** - Civil societies

## 🌍 Supported Countries

Besides every Portuguese NIF type, the generator creates VAT identification numbers for each country in the EU's VIES system: Austria, Belgium, Bulgaria, Croatia, Cyprus, Czechia, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Ireland, Italy, Latvia, Lithuania, Luxembourg, Malta, the Netherlands, Poland, Romania, Slovakia, Slovenia, Spain (DNI, NIE and CIF), Sweden, Northern Ireland and the United Kingdom.

It also generates national tax numbers for Argentina (CUIT), Australia (ABN, TFN, ACN), Brazil (CPF, CNPJ), Canada (BN), Chile (RUT), Colombia (NIT), Japan (Corporate Number), New Zealand (IRD), Norway (organisasjonsnummer), Peru (RUC), South Africa (tax reference number), Switzerland (UID), Turkey (VKN, T.C. Kimlik No.) and Uruguay (RUT). Numbers without a check digit (e.g. the US SSN or EIN) are not included.

The check-digit algorithms (`src/lib/tax-id/countries.ts`) are ported from [python-stdnum](https://github.com/arthurdejong/python-stdnum). They are tested against real, registered numbers taken from its test suite, and every generated VIES number must also pass the site's own validator. Where a country issues several kinds of VAT number, only the kind named in the UI is generated (e.g. 8-digit legal-entity DIČ for Czechia).

## ⚠️ Disclaimer

**This tool generates tax numbers for testing purposes only.** These are randomly generated numbers that follow each country's validation algorithm (or deliberately break it, for invalid batches). They should **NEVER** be used for:
- Real tax declarations
- Official documents
- Identity fraud
- Any illegal activities

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- [Report a bug](https://github.com/rtnogueira/nif-generator/issues/new?template=bug_report.yml)
- [Suggest a feature](https://github.com/rtnogueira/nif-generator/issues/new?template=feature_request.yml), such as a new country or number type (a link to its official check-digit specification helps a lot)
- Submit pull requests

The site links to the same forms from its footer, with the page you were on filled in.

## 📬 Contact

For questions, please [open an issue](https://github.com/rtnogueira/nif-generator/issues/new/choose) on GitHub.

## 🌟 Show Your Support

If you find this tool useful, please consider giving it a ⭐ on GitHub!

---

**Keywords:** tax number generator, tax number validator, NIF generator, Portuguese NIF, gerador de NIF, número de contribuinte, EU VAT number generator, VAT number validator, VIES, CPF generator, CNPJ generator, ABN generator, tax identification number, check digit, QA testing, test data generator
