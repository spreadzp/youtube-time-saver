/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EXAMPLE: string;
  readonly VITE_DISCORD_WEBHOOK: string;
  readonly VITE_API_AI: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
