/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KKIAPAY_PUBLIC_KEY: string
  readonly VITE_KKIAPAY_SANDBOX: string
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
