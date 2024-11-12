/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_EXAMPLE: string;
  readonly DISCORD_WEBHOOK: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
