import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import react from 'eslint-plugin-react'
import tseslint from 'typescript-eslint'
import pluginRouter from '@tanstack/eslint-plugin-router'
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended'
import eslintPluginImportHelpers from 'eslint-plugin-import-helpers'


export default tseslint.config(
  { ignores: ['dist', "stats.html", "vite.config.ts", "coverage"] },
  {
    settings: { react: { version: '18.3' } },
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.strict,
      ...tseslint.configs.stylistic,
      eslintPluginPrettier,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import-helpers': eslintPluginImportHelpers,
      '@tanstack/router': pluginRouter,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'after-used',
          argsIgnorePattern: '^_', // Ignore function arguments prefixed with `_`
          varsIgnorePattern: '^_', // Ignore variables prefixed with `_`
          caughtErrorsIgnorePattern: '^_', // Ignore catch clause variables prefixed with `_`
        },
      ],
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@tanstack/router/create-route-property-order': 'error',
      ...eslintPluginPrettier.rules,
      'prettier/prettier': [
        2,
        {
          printWidth: 100,
          singleQuote: true,
          trailingComma: 'es5',
          tabWidth: 2,
          arrowParens: 'avoid',
          semi: false,
        },
      ],
      'import-helpers/order-imports': [
        'warn',
        {
            alphabetize: {
                ignoreCase: true,
                order: "asc",
            },
            groups: ["module", "/^@/", ["parent", "sibling", "index"]],
        },
      ],
    },
  }
)
