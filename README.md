[![CI/CD](https://github.com/rtnogueira/nif-generator/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/rtnogueira/nif-generator/actions/workflows/ci-cd.yml)

# Tax Number Generator & Validator (NIF, EU VAT and more)

**Free online tools to generate and validate tax identification numbers for QA testing and development: Portuguese NIFs of every type, EU VAT numbers and national tax numbers of 14 more countries.**

🔗 **Live App:** https://rtnogueira.com/

## 🧾 What is a tax identification number?

Most countries give every taxpayer a tax identification number: the Portuguese NIF (Número de Identificação Fiscal, or *número de contribuinte*), the VAT numbers of EU companies, the Brazilian CPF and CNPJ, the Australian ABN and many more. Most end with a check digit computed from the other digits, so forms can reject mistyped numbers. Testing those forms needs valid numbers that belong to no one, and invalid ones that should be rejected.

## ✨ Features

### Tax number generator (`/`)

- 🇵🇹 Portuguese NIFs of every taxpayer type (individuals, companies, non-residents, public administration, investment funds and more; see [NIF types](#-nif-types-supported))
- 🌍 VAT numbers for all 27 EU member states, Northern Ireland and the UK (optionally with the country prefix), plus tax numbers from 14 more countries, all with a correct check digit. See [Supported countries](#-supported-countries)
- ❌ Deliberately invalid numbers (wrong check digit or wrong length) to test that forms reject them; invalid batches are clearly marked
- ✍️ Optionally in their usual written form (e.g. `390.533.447-05`, `CHE-113.042.942`), where python-stdnum defines one
- 🔢 Up to 50 unique numbers at once
- 📋 Copy a single number or the whole list (one per line, comma-separated or as a JSON array)
- 📄 Export to Excel (.xlsx), CSV, JSON or plain text
- 🔗 The options are kept in the URL (e.g. `/?country=BR&type=cpf&qty=20&format=1`), so a setup can be bookmarked or shared

### Tax number validator (`/tax-number-validator`)

- 🛡️ Checks EU VAT numbers (all 27 member states, Northern Ireland and the UK) against the official structure published by the European Commission ([VIES](https://ec.europa.eu/taxation_customs/vies/#/faq)), detecting the country from the prefix
- ✅ Verifies the check digit of every kind of number the generator supports, including the 14 countries outside VIES, and names the kind of number that matched
- ✍️ Accepts numbers as people write them: spaces, dots, dashes and slashes are ignored, and suffixes such as the Norwegian `MVA` or Swiss `MWST` are understood

### Everywhere

- 🔒 Everything runs in the browser; no number is sent to a server
- 🐞 Bug reports and feature requests through GitHub issue forms, linked from the footer
- 🌗 Light and dark mode, responsive layout

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
