[![CI/CD](https://github.com/rtnogueira/nif-generator/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/rtnogueira/nif-generator/actions/workflows/ci-cd.yml)

# NIF Generator - Portuguese Tax Number Generator

**Free online tool to generate valid Portuguese NIF (Número de Identificação Fiscal) for QA testing and development purposes.**

🔗 **Live App:** https://rtnogueira.com/

## 🇵🇹 What is a NIF?

NIF (Número de Identificação Fiscal) is the Portuguese Tax Identification Number, similar to:
- SSN (Social Security Number) in the United States
- NIE (Número de Identidad de Extranjero) in Spain
- Tax Identification Number (TIN) in other countries

## ✨ Features

- ✅ Generate valid Portuguese NIF numbers for QA testing
- 📋 Support for multiple NIF types:
  - Individual tax numbers (pessoa singular)
  - Corporate tax numbers (pessoa colectiva)
  - Non-resident tax numbers
  - Government entities
  - Investment funds
  - And many more...
- 🌍 VAT numbers for all 27 EU member states, Northern Ireland and the UK (optionally with the country prefix), plus tax numbers from 14 more countries, all with a correct check digit. See [Supported countries](#-supported-countries)
- 🔢 Generate up to 50 numbers at once
- ✍️ Optionally in their usual written form (e.g. `390.533.447-05`, `CHE-113.042.942`), where python-stdnum defines one
- ❌ Deliberately invalid numbers (wrong check digit or wrong length) to test that forms reject them
- 🔗 The options are kept in the URL (e.g. `/?country=BR&type=cpf&qty=20&format=1`), so a setup can be bookmarked or shared
- 📄 Export to Excel (.xlsx), CSV, JSON or plain text
- 📋 Copy a single number or the whole list (one per line, comma-separated or as a JSON array)
- 🛡️ Tax number validator (`/tax-number-validator`): checks VAT numbers from all 27 EU member states, Northern Ireland and the UK against the official structure published by the European Commission ([VIES](https://ec.europa.eu/taxation_customs/vies/#/faq)), and verifies the check digit of every kind of number the generator supports, including the 14 countries outside VIES
- 🌗 Light and dark mode
- 🎨 Modern and responsive UI
- 🚀 Fast and lightweight

## 🎯 Use Cases

Perfect for:
- QA Engineers testing Portuguese applications
- Developers building Portugal-specific features
- Software testers needing test data
- Development and staging environments

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

**This tool generates valid tax numbers for testing purposes only.** These are randomly generated numbers that follow each country's validation algorithm. They should **NEVER** be used for:
- Real tax declarations
- Official documents
- Identity fraud
- Any illegal activities

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests

## 📬 Contact

For questions or suggestions, please open an issue on GitHub.

## 🌟 Show Your Support

If you find this tool useful, please consider giving it a ⭐ on GitHub!

---

**Keywords:** NIF generator, Portuguese tax number, Portuguese NIF, tax identification number, QA testing, test data generator, Portugal NIF, numero fiscal, gerador NIF, Portuguese tax ID
