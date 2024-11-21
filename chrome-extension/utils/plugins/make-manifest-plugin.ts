import fs from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import process from 'node:process';
import { colorLog, ManifestParser } from '@extension/dev-utils';
import type { PluginOption } from 'vite';

const rootDir = resolve(__dirname, '..', '..');
const manifestFile = resolve(rootDir, 'manifest.js');

const getManifestWithCacheBurst = (): Promise<{ default: chrome.runtime.ManifestV3 }> => {
  const withCacheBurst = (path: string) => `${path}?${Date.now().toString()}`;
  /**
   * In Windows, import() doesn't work without file:// protocol.
   * So, we need to convert path to file:// protocol. (url.pathToFileURL)
   */
  if (process.platform === 'win32') {
    return import(withCacheBurst(pathToFileURL(manifestFile).href));
  }

  return import(withCacheBurst(manifestFile));
};

export default function makeManifestPlugin(config: { outDir: string }): PluginOption {
  function copyLocales(from: string, to: string) {
    const localesDir = resolve(from, '_locales');
    const targetLocalesDir = resolve(to, '_locales');

    if (fs.existsSync(localesDir)) {
      if (!fs.existsSync(targetLocalesDir)) {
        fs.mkdirSync(targetLocalesDir, { recursive: true });
      }

      // Copy all locale directories
      fs.readdirSync(localesDir).forEach(locale => {
        const sourceLocaleDir = resolve(localesDir, locale);
        const targetLocaleDir = resolve(targetLocalesDir, locale);

        if (fs.statSync(sourceLocaleDir).isDirectory()) {
          if (!fs.existsSync(targetLocaleDir)) {
            fs.mkdirSync(targetLocaleDir, { recursive: true });
          }

          // Copy messages.json
          const sourceMessages = resolve(sourceLocaleDir, 'messages.json');
          const targetMessages = resolve(targetLocaleDir, 'messages.json');
          if (fs.existsSync(sourceMessages)) {
            fs.copyFileSync(sourceMessages, targetMessages);
          }
        }
      });

      colorLog(`Locales copied to: ${targetLocalesDir}`, 'success');
    }
  }

  function makeManifest(manifest: chrome.runtime.ManifestV3, to: string) {
    if (!fs.existsSync(to)) {
      fs.mkdirSync(to);
    }
    const manifestPath = resolve(to, 'manifest.json');

    const isFirefox = process.env.__FIREFOX__ === 'true';
    fs.writeFileSync(manifestPath, ManifestParser.convertManifestToString(manifest, isFirefox ? 'firefox' : 'chrome'));

    colorLog(`Manifest file copy complete: ${manifestPath}`, 'success');
  }

  return {
    name: 'make-manifest',
    buildStart() {
      this.addWatchFile(manifestFile);
    },
    async writeBundle() {
      const outDir = config.outDir;
      const manifest = await getManifestWithCacheBurst();
      makeManifest(manifest.default, outDir);
      copyLocales(rootDir, outDir);
    },
  };
}
