/// <reference types="vite/client" />

interface ViteTypeOptions {
  strictImportMetaEnv: unknown;
}

interface ImportMetaEnv {
  readonly VITE_RSVP_ENDPOINT: string;
  readonly VITE_WEDDING_API_URL: string;
  readonly VITE_WEBSITE_URL: string;
  readonly VITE_GALLERY_DEMO_MODE: string;
  readonly VITE_COGNITO_DOMAIN: string;
  readonly VITE_COGNITO_CLIENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
