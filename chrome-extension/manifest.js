import fs from 'node:fs';
import deepmerge from 'deepmerge';

const packageJson = JSON.parse(fs.readFileSync('../package.json', 'utf8'));

const isFirefox = process.env.__FIREFOX__ === 'true';

// const sidePanelConfig = {
//   side_panel: {
//     default_path: 'side-panel/index.html',
//   },
//   permissions: ['sidePanel'],
// };

/**
 * After changing, please reload the extension at `chrome://extensions`
 * @type {chrome.runtime.ManifestV3}
 */
const manifest = deepmerge(
  {
    manifest_version: 3,
    default_locale: 'en',
    /**
     * if you want to support multiple languages, you can use the following reference
     * https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Internationalization
     */
    name: '__MSG_extensionName__',
    version: packageJson.version,
    description: '__MSG_extensionDescription__',
    /**
     * Permissions explanation:
     * 1. 'activeTab' - Used instead of broad host permissions because:
     *    - It's more secure as it only grants temporary access to the current tab
     *    - Access is granted only when the user explicitly interacts with the extension
     *    - Permission is automatically revoked when the tab is closed
     *    - It's recommended by Chrome Web Store for better security
     * 2. 'storage' - Required for saving extension settings and API keys
     * 3. host_permissions to YouTube - Since this is a YouTube-specific extension
     */
    host_permissions: ['*://*.youtube.com/*'],
    permissions: ['storage', 'activeTab'],
    //options_page: 'options/index.html',
    background: {
      service_worker: 'background.iife.js',
      type: 'module',
    },
    action: {
      default_popup: 'popup/index.html',
      default_icon: 'icon-34.png',
    },
    //  
    icons: {
      128: 'icon-128.png',
    },
    content_scripts: [
      {
        matches: ['*://*.youtube.com/*'],
        js: ['content/index.iife.js'],
      }, 
      {
        matches: ['*://*.youtube.com/*'],
        css: ['content.css'], // public folder
      },
    ],
    //devtools_page: 'devtools/index.html',
    web_accessible_resources: [
      {
        resources: ['*.js', '*.css', '*.svg', 'icon-128.png', 'icon-34.png'],
        matches: ['*://*.youtube.com/*'],
      },
    ],
    content_security_policy: {
      extension_pages: "script-src 'self'  'wasm-unsafe-eval' ",
    },
  },

  !isFirefox,
);

export default manifest;
