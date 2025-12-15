/// <reference types="vitest" />
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig } from 'vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite(), react(),
  visualizer({
    filename: `stats.html`,
    open: true
  })],
  base: process.env.NODE_ENV === 'production' ? '/nif-generator/' : '/',
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx' as const,
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.ts',
    coverage: {
      reportsDirectory: `./coverage`,
      all: true,
      clean: true,
      enabled: true,
    },
    exclude: [
      '**/node_modules/**',
      '**/coverage/**',
      '**/.{idea,git,cache,output,temp,husky,github}/**',
      '**/{vite,vitest}.config.*',
    ],
  },
})
