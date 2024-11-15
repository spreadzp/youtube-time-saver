// Popup.tsx

import '@src/Popup.css';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { withErrorBoundary, withSuspense } from '@extension/shared';
import { t } from '@extension/i18n';
import { getUserLanguage, setUserLangStorage } from '@extension/storage';
import { useState, useEffect, useMemo } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AITab from './components/tabs/AITab';
import { getIconByName } from './components/icons/Icons';
import HelpTab from './components/tabs/HelpTab';
import YouTubeTab from './components/tabs/YouTubeTab';
import { AITransformersTab } from './components/tabs/AITransformersTab';
import { AboutTab } from './components/tabs/AboutTab';
import { SettingsTab } from './components/tabs/SettingsTab';
import { type DevLocale } from '@extension/i18n/lib/type';
import { getMessageFromLocale } from '@extension/i18n/lib/getMessageFromLocale';
import { type ContentI18 } from '@extension/i18n/lib/messageTypes';

const LoadingComponent = () => {
  const [messages, setMessages] = useState<ContentI18>(getMessageFromLocale('en'));

  useEffect(() => {
    getUserLanguage().then(lang => {
      const locale = lang as DevLocale;
      setMessages(getMessageFromLocale(locale));
    });
  }, []);

  return <div className="p-4 text-center text-gray-600">{messages.common?.loading?.message || 'Loading...'}</div>;
};

const ErrorComponent = () => {
  const [messages, setMessages] = useState<ContentI18>(getMessageFromLocale('en'));

  useEffect(() => {
    getUserLanguage().then(lang => {
      const locale = lang as DevLocale;
      setMessages(getMessageFromLocale(locale));
    });
  }, []);

  return <div className="p-4 text-center text-red-600">{messages.common?.error?.message || 'Error occurred'}</div>;
};

const Popup = () => {
  const [currentLang, setCurrentLang] = useState<DevLocale>('en');
  const [forceUpdateKey, setForceUpdateKey] = useState(0);
  const [messages, setMessages] = useState<ContentI18>(() => getMessageFromLocale('en'));

  useEffect(() => {
    getUserLanguage().then(lang => {
      const locale = lang as DevLocale;
      setCurrentLang(locale);
      t.devLocale = locale;
      const newMessages = getMessageFromLocale(locale);
      setMessages(newMessages);
      setForceUpdateKey(prev => prev + 1);
    });
  }, []);

  const handleLanguageChange = async (newLang: DevLocale) => {
    await setUserLangStorage.set(newLang);
    setCurrentLang(newLang);
    t.devLocale = newLang;
    const newMessages = getMessageFromLocale(newLang);
    setMessages(newMessages);
    setForceUpdateKey(prev => prev + 1);
  };

  const tabs = useMemo(
    () => [
      {
        title: messages.tabs?.youtube?.message || 'YouTube',
        content: <YouTubeTab currentLang={currentLang} onLanguageChange={handleLanguageChange} />,
        icon: getIconByName('YouTube'),
        tooltip: messages.youtubeTab?.description?.message || 'YouTube video settings',
      },
      {
        title: messages.tabs?.ai?.message || 'AI Analysis',
        content: <AITab />,
        icon: getIconByName('AI_API'),
        tooltip: messages.aiTab?.description?.message || 'Analyze your video transcript using AI',
      },
      {
        title: messages.tabs?.aiFree?.message || 'Free AI',
        content: <AITransformersTab />,
        icon: getIconByName('AI_Free'),
        tooltip: messages.aiFreeTab?.description?.message || 'Analyze your video using free AI models',
      },
      {
        title: messages.tabs?.settings?.message || 'Settings',
        content: <SettingsTab />,
        icon: getIconByName('Settings'),
        tooltip: messages.settingsTab?.description?.message || 'Configure your extension settings',
      },
      {
        title: messages.tabs?.help?.message || 'Help',
        content: <HelpTab />,
        icon: getIconByName('Help'),
        tooltip: messages.helpTab?.description?.message || 'Get help and support',
      },
      {
        title: messages.tabs?.about?.message || 'About',
        content: <AboutTab />,
        icon: <img src="/icon-128.png" alt="logo" className="size-6" />,
        tooltip: messages.aboutTab?.description?.message || 'About YouTube Time Saver',
      },
    ],
    [currentLang, forceUpdateKey, messages],
  );

  return (
    <div className="bg-white">
      <Tabs>
        <TabList className="flex border-b border-gray-200">
          {tabs.map((tab, index) => (
            <Tab
              key={`${index}-${forceUpdateKey}`}
              className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-100 focus:outline-none"
              selectedClassName="border-b-2 border-blue-500 bg-white"
              data-tooltip-id="tab-tooltip"
              data-tooltip-content={tab.tooltip}>
              <div className="flex items-center space-x-2">{tab.icon}</div>
            </Tab>
          ))}
        </TabList>

        {tabs.map((tab, index) => (
          <TabPanel key={`${index}-${forceUpdateKey}`} className="px-2">
            {tab.content}
          </TabPanel>
        ))}
      </Tabs>
      <Tooltip id="tab-tooltip" />
    </div>
  );
};

export default withErrorBoundary(withSuspense(Popup, <LoadingComponent />), <ErrorComponent />);
