[![Build Status](https://travis-ci.org/rtnogueira/nif-generator.svg?branch=master)](https://travis-ci.org/rtnogueira/nif-generator)

# NIF Generator - Portuguese Tax Number Generator

**Free online tool to generate valid Portuguese NIF (Número de Identificação Fiscal) for QA testing and development purposes.**

🔗 **Live App:** https://rtnogueira.github.io/nif-generator/

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
- 📄 Export generated NIFs to CSV
- 📋 Copy to clipboard functionality
- 🎨 Modern and responsive UI
- 🚀 Fast and lightweight

## 🎯 Use Cases

Perfect for:
- QA Engineers testing Portuguese applications
- Developers building Portugal-specific features
- Software testers needing test data
- Development and staging environments

## 🛠️ Technology Stack

- **React** - UI library
- **Redux** - State management
- **Material-UI** - Component library
- **React Router** - Navigation
- **File Saver** - CSV export
- **React GA** - Google Analytics

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- pnpm (or npm/yarn)

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

# Build for production
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
