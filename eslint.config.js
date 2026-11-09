import js from '@eslint/js'
import pluginRouter from '@tanstack/eslint-plugin-router'
import { defineConfig, globalIgnores } from 'eslint/config'
import eslintPluginImportHelpers from 'eslint-plugin-import-helpers'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default defineConfig([
  globalIgnores(['dist', 'coverage', 'stats.html', 'src/routeTree.gen.ts']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.strict,
      tseslint.configs.stylistic,
      reactHooks.configs.flat['recommended-latest'],
      reactRefresh.configs.vite,
      pluginRouter.configs['flat/recommended'],
      eslintPluginPrettier,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'import-helpers': eslintPluginImportHelpers,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      'import-helpers/order-imports': [
        'warn',
        {
          alphabetize: { ignoreCase: true, order: 'asc' },
          groups: ['module', '/^@\\//', ['parent', 'sibling', 'index']],
        },
      ],
    },
  },
  {
    // Generated shadcn/ui primitives export variants next to components, and TanStack route
    // files export a `Route` object; both are fine for Fast Refresh in practice.
    files: ['src/components/ui/**', 'src/routes/**'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
