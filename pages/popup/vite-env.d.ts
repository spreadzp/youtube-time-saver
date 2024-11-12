/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_EXAMPLE: string;
    readonly VITE_DISCORD_WEBHOOK: string;
    readonly VITE_API_AI: string;
    readonly VITE_PUBLIC_PROJECT_ID: string;
    readonly VITE_PUBLIC_CLIENT_KEY: string;
    readonly VITE_PUBLIC_APP_ID: string;

}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
