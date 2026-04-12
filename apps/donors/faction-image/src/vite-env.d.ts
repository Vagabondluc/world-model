/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ICON_PROVIDER_MODE?: "local" | "api";
  readonly VITE_ICON_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  __APP_ENTRY__?: "main" | "dashboard";
}
