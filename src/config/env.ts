export const env = {
  app: {
    name: import.meta.env.VITE_APP_NAME,
    version: import.meta.env.VITE_APP_VERSION,
    env: import.meta.env.VITE_APP_ENV,
    url: import.meta.env.VITE_APP_URL,
  },
  logging: {
    level: import.meta.env.VITE_LOG_LEVEL,
    debug: import.meta.env.VITE_DEBUG === true,
    mode: import.meta.env.VITE_MODE,
  },
  auth: {
    provider: import.meta.env.VITE_AUTH_PROVIDER,
    redirectURL: import.meta.env.VITE_AUTH_REDIRECT_URL,
    tokenStorageKey: import.meta.env.VITE_TOKEN_STORAGE_KEY,
    refreshTokenStorageKey: import.meta.env.VITE_REFRESH_TOKEN_STORAGE_KEY,
    enableRememberMe: import.meta.env.VITE_ENABLE_REMEMBER_ME === true,
  },
  theme: {
    defaultTheme: import.meta.env.VITE_THEME,
    primaryColor: import.meta.env.VITE_PRIMARY_COLOR,
  },
  api: {
    baseURL: import.meta.env.VITE_API_URL,
    timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 10000,
    retries: Number(import.meta.env.VITE_API_RETRIES) || 2,
  },
  features: {
    analytics: import.meta.env.VITE_FEATURE_ANALYTICS === true,
    cache: import.meta.env.VITE_FEATURE_CACHE === true,
    offline: import.meta.env.VITE_FEATURE_OFFLINE === true,
  },
};
