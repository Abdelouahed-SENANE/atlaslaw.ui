/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENV: 'development' | 'staging' | 'production'
  readonly VITE_APP_URL: string

  readonly VITE_API_URL: string
  readonly VITE_GRAPHQL_URL: string
  readonly VITE_WS_URL: string
  readonly VITE_API_TIMEOUT: number
  readonly VITE_API_RETRIES: number

  readonly VITE_AUTH_PROVIDER: 'local' | 'keycloak' | 'firebase' | 'oidc'
  readonly VITE_AUTH_REDIRECT_URL: string
  readonly VITE_TOKEN_STORAGE_KEY: string
  readonly VITE_REFRESH_TOKEN_STORAGE_KEY: string
  readonly VITE_ENABLE_REMEMBER_ME: boolean

  readonly VITE_FEATURE_ANALYTICS: boolean
  readonly VITE_FEATURE_CACHE: boolean
  readonly VITE_FEATURE_OFFLINE: boolean
  readonly VITE_FEATURE_BETA_UI: boolean

  readonly VITE_LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error'
  readonly VITE_DEBUG: boolean
  readonly VITE_MODE: 'dev' | 'staging' | 'prod'

  readonly VITE_THEME: 'light' | 'dark'
  readonly VITE_PRIMARY_COLOR: string
  readonly VITE_DEFAULT_LANGUAGE: 'fr' | 'ar' | 'en'
  readonly VITE_SUPPORTED_LANGUAGES: string
  readonly VITE_DATE_FORMAT: string

  readonly VITE_STORAGE_PREFIX: string
  readonly VITE_CACHE_TTL: number
  readonly VITE_USE_INDEXEDDB: boolean

  readonly VITE_COMMIT_SHA: string
  readonly VITE_BUILD_DATE: string
  readonly VITE_RELEASE_CHANNEL: 'stable' | 'beta' | 'canary'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
