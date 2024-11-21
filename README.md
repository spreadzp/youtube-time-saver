<div align="center">

<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/99cb6303-64e4-4bed-bf3f-35735353e6de" />
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/a5dbf71c-c509-4c4f-80f4-be88a1943b0a" />
    <img alt="Logo" src="https://github.com/user-attachments/assets/99cb6303-64e4-4bed-bf3f-35735353e6de" />
</picture>

![](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![](https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://badges.aleen42.com/src/vitejs.svg)

![GitHub action badge](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/actions/workflows/build-zip.yml/badge.svg)
![GitHub action badge](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/actions/workflows/lint.yml/badge.svg)

<img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https://github.com/Jonghakseo/chrome-extension-boilerplate-react-viteFactions&count_bg=%23#222222&title_bg=%23#454545&title=😀&edge_flat=true" alt="hits"/>
<a href="https://discord.gg/4ERQ6jgV9a" target="_blank"><img src="https://discord.com/api/guilds/1263404974830915637/widget.png"/></a>

> This boilerplate
> has [Legacy version](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/tree/legacy)

</div>

> [!NOTE]
> This project is listed in the [Awesome Vite](https://github.com/vitejs/awesome-vite)

> [!TIP]
> Share storage state between all pages
>
> https://github.com/user-attachments/assets/3b8e189f-6443-490e-a455-4f9570267f8c

## Table of Contents

- [Intro](#intro)
- [Features](#features)
- [Structure](#structure)
    - [ChromeExtension](#structure-chrome-extension)
    - [Packages](#structure-packages)
    - [Pages](#structure-pages)
- [Getting started](#getting-started)
    - [Chrome](#getting-started-chrome)
    - [Firefox](#getting-started-firefox)
- [Install dependency](#install-dependency)
    - [For root](#install-dependency-for-root)
    - [For module](#install-dependency-for-module)
- [Community](#community)
- [Reference](#reference)
- [Star History](#star-history)
- [Contributors](#contributors)

## Intro <a name="intro"></a>

This boilerplate is made for creating chrome extensions using React and Typescript.
> The focus was on improving the build speed and development experience with Vite(Rollup) & Turborepo.

## Features <a name="features"></a>

- [React18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwindcss](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Turborepo](https://turbo.build/repo)
- [Prettier](https://prettier.io/)
- [ESLint](https://eslint.org/)
- [Chrome Extension Manifest Version 3](https://developer.chrome.com/docs/extensions/mv3/intro/)
- [Custom I18n Package](/packages/i18n/)
- [Custom HMR(Hot Module Rebuild) Plugin](/packages/hmr/)
- [End to End Testing with WebdriverIO](https://webdriver.io/)

## Getting started: <a name="getting-started"></a>

1. When you're using Windows run this:
   - `git config --global core.eol lf`
   - `git config --global core.autocrlf input`
   #### This will change eol(End of line) to the same as on Linux/Mac, without this, you will have conflicts with your teammates with those systems and our bash script won't work
2. Clone this repository.
3. Change `extensionDescription` and `extensionName` in `messages.json` file in `packages/i18n/locales` folder.
4. Install pnpm globally: `npm install -g pnpm` (check your node version >= 18.19.1))
5. Run `pnpm install`

### And then, depending on needs:

### For Chrome: <a name="getting-started-chrome"></a>

1. Run:
    - Dev: `pnpm dev` (On windows, you should run as administrator. [(Issue#456)](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/issues/456)
    - Prod: `pnpm build`
2. Open in browser - `chrome://extensions`
3. Check - `Developer mode`
4. Find and Click - `Load unpacked extension`
5. Select - `dist` folder at root

### For Firefox: <a name="getting-started-firefox"></a>

1. Run:
    - Dev: `pnpm dev:firefox`
    - Prod: `pnpm build:firefox`
2. Open in browser - `about:debugging#/runtime/this-firefox`
3. Find and Click - `Load Temporary Add-on...`
4. Select - `manifest.json` from `dist` folder at root

<h3>
<i>Remember in firefox you add plugin in temporary mode, that's mean it'll disappear after each browser close.

You have to do it on every browser launch.</i>
</h3>

## Install dependency for turborepo: <a name="install-dependency"></a>

### For root: <a name="install-dependency-for-root"></a>

1. Run `pnpm i <package> -w`

### For module: <a name="install-dependency-for-module"></a>

1. Run `pnpm i <package> -F <module name>`

`package` - Name of the package you want to install e.g. `nodemon` \
`module-name` - You can find it inside each `package.json` under the key `name`, e.g. `@extension/content-script`, you can use only `content-script` without `@extension/` prefix

## Env Variables

1. Copy `.example.env` and paste it as `.env` in the same path
2. Add a new record inside `.env`
3. Add this key with type for value to `vite-env.d.ts` (root) to `ImportMetaEnv`
4. Then you can use it with `import.meta.env.{YOUR_KEY}` like with standard [Vite Env](https://vitejs.dev/guide/env-and-mode)

#### If you want to set it for each package independently:

1. Create `.env` inside that package
2. Open related `vite.config.mts` and add `envDir: '.'` at the end of this config
3. Rest steps like above

#### Remember you can't use global and local at the same time for the same package(It will be overwritten)

## Structure <a name="structure"></a>

### ChromeExtension <a name="structure-chrome-extension"></a>

Main app with background script, manifest

- `manifest.js` - manifest for chrome extension
- `src/background` - [background script](https://developer.chrome.com/docs/extensions/mv3/background_pages/) for chrome
  extension (`background.service_worker` in
  manifest.json)
- `public/content.css` - content css for user's page injection

### Packages <a name="structure-packages"></a>

Some shared packages

- `dev-utils` - utils for chrome extension development (manifest-parser, logger)
- `i18n` - custom i18n package for chrome extension. provide i18n function with type safety and other validation.
- `hmr` - custom HMR plugin for vite, injection script for reload/refresh, hmr dev-server
- `shared` - shared code for entire project. (types, constants, custom hooks, components, etc.)
- `storage` - helpers for [storage](https://developer.chrome.com/docs/extensions/reference/api/storage) easier integration with, e.g local, session storages
- `tailwind-config` - shared tailwind config for entire project
- `tsconfig` - shared tsconfig for entire project
- `ui` - here's a function to merge your tailwind config with global one, and you can save components here
- `vite-config` - shared vite config for entire project
- `zipper` - By ```pnpm zip``` you can pack ```dist``` folder into ```extension.zip``` inside newly created ```dist-zip```
- `e2e` - By ```pnpm e2e``` you can run end to end tests of your zipped extension on different browsers

### Pages <a name="structure-pages"></a>

- `content` - [content script](https://developer.chrome.com/docs/extensions/mv3/content_scripts/) for chrome
  extension (`content_scripts` in manifest.json)
- `content-ui` - [content script](https://developer.chrome.com/docs/extensions/mv3/content_scripts/) for render UI in
  user's page (`content_scripts` in manifest.json)
- `content-runtime` - [content runtime script](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts#functionality)
  this can be inject from `popup` like standard `content`
- `devtools` - [devtools](https://developer.chrome.com/docs/extensions/mv3/devtools/#creating) for chrome
  extension (`devtools_page` in manifest.json)
- `devtools-panel` - devtools panel for [devtools](pages/devtools/src/index.ts)
- `new-tab` - [new tab](https://developer.chrome.com/docs/extensions/mv3/override/) for chrome
  extension (`chrome_url_overrides.newtab` in manifest.json)
- `options` - [options](https://developer.chrome.com/docs/extensions/mv3/options/) for chrome extension (`options_page`
  in manifest.json)
- `popup` - [popup](https://developer.chrome.com/docs/extensions/reference/browserAction/) for chrome
  extension (`action.default_popup` in
  manifest.json)
- `side-panel` - [sidepanel(Chrome 114+)](https://developer.chrome.com/docs/extensions/reference/sidePanel/) for chrome
  extension (`side_panel.default_path` in manifest.json)

## Community <a name="community"></a>

To chat with other community members, you can join the [Discord](https://discord.gg/4ERQ6jgV9a) server.
You can ask questions on that server, and you can also help others.

Also, suggest new features or share any challenges you've faced while developing Chrome extensions!

## Reference <a name="reference"></a>

- [Vite Plugin](https://vitejs.dev/guide/api-plugin.html)
- [ChromeExtension](https://developer.chrome.com/docs/extensions/mv3/)
- [Rollup](https://rollupjs.org/guide/en/)
- [Turborepo](https://turbo.build/repo/docs)
- [Rollup-plugin-chrome-extension](https://www.extend-chrome.dev/rollup-plugin)

## Star History <a name="star-history"></a>

<a href="https://star-history.com/#Jonghakseo/chrome-extension-boilerplate-react-vite&Date">
 <picture>
   <source media="(prefers-color-scheme: dark)" srcset="https://api.star-history.com/svg?repos=Jonghakseo/chrome-extension-boilerplate-react-vite&type=Date&theme=dark" />
   <source media="(prefers-color-scheme: light)" srcset="https://api.star-history.com/svg?repos=Jonghakseo/chrome-extension-boilerplate-react-vite&type=Date" />
   <img alt="Star History Chart" src="https://api.star-history.com/svg?repos=Jonghakseo/chrome-extension-boilerplate-react-vite&type=Date" />
 </picture>
</a>

## Contributors <a name="contributors"></a>

This Boilerplate is made possible thanks to all of its contributors.

<a href="https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite/graphs/contributors">
  <img width="500px" src="https://contrib.rocks/image?repo=Jonghakseo/chrome-extension-boilerplate-react-vite" alt="All Contributors"/>
</a>

---

## Special Thanks To

| <a href="https://jb.gg/OpenSourceSupport"><img width="40" src="https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.png" alt="JetBrains Logo (Main) logo."></a> | <a href="https://www.linkedin.com/in/j-acks0n"><img width="40" style="border-radius:50%" src='https://avatars.githubusercontent.com/u/23139754' alt='Jackson Hong'/></a> |
|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------|

---

Made by [Jonghakseo](https://jonghakseo.github.io/)

# YouTube Time Saver - Chrome Extension

[![Available in the Chrome Web Store](https://storage.googleapis.com/web-dev-uploads/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/UV4C4ybeBTsZt43U4xis.png)](https://chromewebstore.google.com/detail/youtube-time-saver/nnhkeljkmadakpchcaflladakgolglhk)

AI-powered YouTube video summarizer and transcript analyzer with support for multiple AI providers.

## What is YouTube Time Saver?

YouTube Time Saver is an innovative Chrome extension designed to revolutionize the way you consume YouTube videos. By harnessing the power of AI technologies like OpenAI, Gemini, DeepSeek, and Transform.js, this extension automatically generates concise summaries of video content, allowing you to capture the main ideas and key points without watching entire videos.

## Features

- Multiple AI Providers:
  - Google Gemini
  - OpenAI (GPT-3.5/4)
  - DeepSeek
  - Local Transformers.js (Free, no API key needed)

- Smart Analysis:
  - Instant video summaries
  - Key points extraction
  - Chapter markers
  - Topic lists
  - Quick insights

- Multi-Language Support:
  - English
  - Deutsch
  - Español
  - Italiano
  - Русский
  - 中文 (简体)
  - 日本語
  - 한국어

## What Inspired Me to Create YouTube Time Saver

I'm subscribed to numerous YouTube channels, and every day, more and more videos are released. Many of these videos, I simply don't have the time to watch. The problem is, even when I do manage to watch a video, it often turns out to be filled with useless information. Worse still, sometimes I end up feeling emotionally irritated, annoyed, or even worse after watching a video, which is something I definitely don't want.

This frustration led to the idea of using AI to generate video summaries. With this tool, I could get the key takeaways and main points of a video without having to watch it in its entirety. Through specific queries, I could delve deeper into the parts that interested me, and only if it was worth it, I would spend my time watching the full video. Beyond saving time, this approach also protected me from the emotional rollercoasters that some YouTubers can induce.

## Who Will Benefit?

- Busy Professionals: Stay updated with industry insights without wasting time on irrelevant content
- Students: Efficiently study and review video lectures, focusing only on the essential information
- Content Creators: Quickly analyze competitors' content to stay ahead in their niche
- Emotionally Sensitive Viewers: Protect themselves from unwanted emotional responses by previewing content
- Multitaskers: Get the gist of videos while performing other tasks

## Getting Started

### Installation

1. Chrome Web Store (Recommended):
   - Visit the [Chrome Web Store](https://chromewebstore.google.com/detail/youtube-time-saver/nnhkeljkmadakpchcaflladakgolglhk)
   - Click "Add to Chrome"
   - Configure your preferred AI provider

2. From Source:
   ```bash
   git clone https://github.com/amarettococo/youtube-time-saver.git
   cd youtube-time-saver
   pnpm install
   pnpm build
   ```
   Then load the `dist` directory in Chrome's developer mode.

### AI Provider Setup

1. Google Gemini:
   - Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

2. OpenAI:
   - Get API key from [OpenAI Platform](https://platform.openai.com/api-keys)

3. DeepSeek:
   - Get API key from [DeepSeek Platform](https://platform.deepseek.com/)

4. Local Transformers.js:
   - No API key needed - works offline!

## Development

This project is based on [chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite).

### Commands

- `pnpm dev` - Development mode
- `pnpm build` - Production build
- `pnpm package` - Create distributable
- `pnpm fmt` - Format code

### Project Structure

```
.
├── chrome-extension/    # Core extension files
│   ├── manifest.js      # Extension manifest
│   └── src/
│       └── background/  # Service worker
├── pages/
│   └── popup/          # Main extension UI
└── packages/
    └── i18n/          # Internationalization
```

## Let's Connect!

I'm excited to hear your feedback and explore potential collaborations. If you have any proposals or need help creating something similar, feel free to reach out to me. Let's innovate together and make the most of our time!

## Why Choose YouTube Time Saver?

Don't let time-consuming videos hold you back. YouTube Time Saver is not just about saving time; it's about making the most of your time by focusing on what truly matters. With our AI-powered summaries and analysis, you can:

- Save hours of watching time
- Focus on valuable content
- Avoid emotional manipulation
- Make informed viewing decisions
- Stay productive while staying informed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with [chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)
- Powered by [Transformers.js](https://github.com/xenova/transformers.js) for local AI processing

---

Experience a smarter way to watch YouTube! [Install YouTube Time Saver](https://chromewebstore.google.com/detail/youtube-time-saver/nnhkeljkmadakpchcaflladakgolglhk) today!
