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
- 🔢 Generate up to 50 NIFs at once
- 📄 Export generated NIFs to Excel (.xlsx)
- 📋 Copy a single NIF or the whole list to the clipboard
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

## ⚠️ Disclaimer

**This tool generates valid NIF numbers for testing purposes only.** These are randomly generated numbers that follow the Portuguese NIF validation algorithm. They should **NEVER** be used for:
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
