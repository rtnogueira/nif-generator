/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PROD: boolean
  readonly DEV: boolean
  readonly MODE: string
  readonly PUBLIC_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
