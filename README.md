# YouTube Time Saver - Chrome Extension
![icon-34](https://github.com/user-attachments/assets/7147bdd0-ed06-4529-8242-a6296c67aff3)
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

## 🎥 See It In Action

Watch our demo video to see YouTube Time Saver in action:

[![YouTube Time Saver Demo](https://img.youtube.com/vi/Nb2ZbrpD_tA/0.jpg)](https://www.youtube.com/watch?v=Nb2ZbrpD_tA)

This video demonstrates how to:
- Install and set up the extension
- Use different AI providers
- Generate video summaries
- Extract key points
- Navigate through analyzed content

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
