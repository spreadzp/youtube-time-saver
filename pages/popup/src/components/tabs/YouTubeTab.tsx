// components/YouTubeTab.tsx

import { useEffect, useState } from 'react';
import { getMessageFromLocale } from '@extension/i18n/lib/getMessageFromLocale';
import { type DevLocale } from '@extension/i18n/lib/type';
import VideoHandlerComponent from '../VideoHandlerComponent';

interface YouTubeTabProps {
  currentLang: DevLocale;
  onLanguageChange: (lang: DevLocale) => Promise<void>;
}

export const YouTubeTab = ({ currentLang, onLanguageChange }: YouTubeTabProps) => {
  const [url, setUrl] = useState('');
  const [messages, setMessages] = useState(getMessageFromLocale('en'));

  useEffect(() => {
    (async () => {
      const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
      setUrl(tab.url!);
    })();
  }, []);

  useEffect(() => {
    const newMessages = getMessageFromLocale(currentLang);
    setMessages(newMessages);
  }, [currentLang]);

  const handleLanguageChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as DevLocale;
    await onLanguageChange(newLang);
  };

  const languages = [
    { value: 'en', label: messages.common?.languages?.english?.message || 'English' },
    { value: 'zh_CN', label: messages.common?.languages?.chinese?.message || '中文' },
    { value: 'ja', label: messages.common?.languages?.japanese?.message || '日本語' },
    { value: 'ko', label: messages.common?.languages?.korean?.message || '한국어' },
    { value: 'es', label: messages.common?.languages?.spanish?.message || 'Español' },
    { value: 'de', label: messages.common?.languages?.german?.message || 'Deutsch' },
    { value: 'it', label: messages.common?.languages?.italian?.message || 'Italiano' },
    { value: 'ru', label: messages.common?.languages?.russian?.message || 'Русский' },
  ];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{messages.youtubeTab?.title?.message || 'YouTube Settings'}</h1>

      <div className="w-full">
        <select
          value={currentLang}
          onChange={handleLanguageChange}
          className="block w-full px-3 py-2 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          {languages.map(lang => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
      </div>

      <VideoHandlerComponent url={url} />
    </div>
  );
};

export default YouTubeTab;
