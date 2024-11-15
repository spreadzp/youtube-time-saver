import { useEffect, useState } from 'react';
import WalletAddressDisplay from '../common/WalletAddressDisplay';
import { getUserLanguage } from '@extension/storage';
import { getMessageFromLocale } from '@extension/i18n/lib/getMessageFromLocale';
import { type DevLocale } from '@extension/i18n/lib/type';

const ETH_WALLET_ADDRESS = '0x08DbDEfDC3374C0242523575Ed2Bf100A7f441Fe';
const USDT_WALLET_ADDRESS = 'TDfxSoGbhs1EUgT977mj8JCnfXYLiDNqTb';

export const AboutTab = () => {
  const [messages, setMessages] = useState(getMessageFromLocale('en'));

  useEffect(() => {
    getUserLanguage().then(lang => {
      const locale = lang as DevLocale;
      const newMessages = getMessageFromLocale(locale);
      setMessages(newMessages);
    });
  }, []);

  return (
    <div className="flex flex-col items-center">
      <img src="/icon-128.png" alt="logo" className="mb-4 size-16" />

      <div className="w-full space-y-6">
        <div className="text-center">
          <h1 className="mb-4 text-3xl font-extrabold text-gray-900">
            {messages.aboutTab?.title?.message || 'About YouTube Time Saver'}
          </h1>
          <p className="text-lg leading-relaxed text-gray-700">
            {messages.aboutTab?.description?.message ||
              'A powerful browser extension that helps you save time on YouTube'}
          </p>
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold text-gray-800">
            {messages.aboutTab?.features?.title?.message || 'Features'}
          </h2>
          <ul className="space-y-2 text-lg leading-relaxed text-gray-700">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              {messages.aboutTab?.features?.list?.youtubeIntegration?.message || 'Seamless YouTube integration'}
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              {messages.aboutTab?.features?.list?.transcripts?.message || 'Quick access to transcripts'}
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              {messages.aboutTab?.features?.list?.aiSummaries?.message || 'AI summaries in multiple languages'}
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              {messages.aboutTab?.features?.list?.apiOptions?.message || 'Affordable API key options via DeepSeek'}
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              {messages.aboutTab?.features?.list?.support?.message ||
                'Direct support and regular updates from the developer'}
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-800">
            {messages.common?.supportProject?.message || 'Support the Project'}
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 font-semibold text-gray-700">
                {messages.aboutTab?.author?.message || 'Buy Me a Coffee'}
              </h3>
              <a
                href="https://buymeacoffee.com/amaretto"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block">
                <img src="/popup/bmc_qr.png" alt="Buy Me a Coffee QR Code" className="size-32" />
              </a>
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-700">ETH</h3>
              <WalletAddressDisplay address={ETH_WALLET_ADDRESS} />
            </div>
            <div>
              <h3 className="mb-2 font-semibold text-gray-700">USDT (TRC20)</h3>
              <WalletAddressDisplay address={USDT_WALLET_ADDRESS} />
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            {messages.aboutTab?.version?.message || 'Version'} 1.3.0
            {messages.aboutTab?.copyright?.message && (
              <span className="block">{messages.aboutTab.copyright.message}</span>
            )}
            {messages.aboutTab?.license?.message && <span className="block">{messages.aboutTab.license.message}</span>}
            {messages.aboutTab?.homepage?.message && (
              <a
                href={messages.aboutTab.homepage.message}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 hover:underline">
                {messages.aboutTab.homepage.message}
              </a>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutTab;
