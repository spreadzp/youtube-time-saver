import { getUserApiKey, setUserApiKeyStorage } from '@extension/storage';
import { useStoreData } from '@src/utils/store';
import { useEffect, useState } from 'react';
import { getMessageFromLocale } from '@extension/i18n/lib/getMessageFromLocale';
import { type DevLocale } from '@extension/i18n/lib/type';
import { getUserLanguage } from '@extension/storage';

export const SettingsTab = () => {
  const { setApiKey, apiAIKey } = useStoreData();
  const [hasKey, setHasKey] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [messages, setMessages] = useState(getMessageFromLocale('en'));

  useEffect(() => {
    getUserLanguage().then(lang => {
      const locale = lang as DevLocale;
      const newMessages = getMessageFromLocale(locale);
      setMessages(newMessages);
    });

    (async () => {
      const apiKey = await getUserApiKey();
      if (apiKey !== '') {
        setApiKey(apiKey);
        setHasKey(true);
      } else {
        setHasKey(false);
        alert(messages.settingsTab?.apiSettings?.alerts?.enterKey?.message || 'Please enter your OpenAI API key');
      }
    })();
  }, []);

  const handleApiKeySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await setUserApiKeyStorage.setApiKey(apiAIKey);
    const apiKey = await getUserApiKey();
    if (apiKey !== '') {
      setHasKey(true);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000); // Hide success message after 3 seconds
    } else {
      setHasKey(false);
      alert(messages.settingsTab?.apiSettings?.alerts?.enterKey?.message || 'Please enter your OpenAI API key');
    }
  };

  const title = hasKey
    ? messages.settingsTab?.apiSettings?.title?.message || 'API Settings'
    : messages.settingsTab?.apiSettings?.newTitle?.message || 'New API Settings';

  return (
    <div className="space-y-4">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">{messages.tabs?.settings?.message || 'Settings'}</h1>
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="flex flex-col space-y-4">
          <div className="text-lg font-semibold">{messages.tabs?.settings?.message}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{messages.settingsTab?.description?.message}</div>

          <div className="mt-4">
            <h2 className="text-lg font-medium text-gray-900">{title}</h2>
            <p className="mt-1 text-sm text-gray-500">{messages.settingsTab?.apiSettings?.description?.message}</p>
          </div>
        </div>
        <form onSubmit={handleApiKeySubmit} className="space-y-4">
          <div className="relative">
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">
              {messages.settingsTab?.apiSettings?.apiKey?.label?.message || 'API Key'}
            </label>
            <div className="relative mt-1">
              <input
                type={showKey ? 'text' : 'password'}
                id="apiKey"
                value={apiAIKey}
                onChange={e => setApiKey(e.target.value)}
                placeholder={messages.settingsTab?.apiSettings?.apiKey?.placeholder?.message || 'Enter API Key'}
                className="block w-full rounded-md border border-gray-300 pr-10 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute inset-y-0 right-0 flex items-center pr-3">
                {showKey ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-500">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                    />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          {showSuccess && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {messages.settingsTab?.apiSettings?.alerts?.success?.message || 'API key saved successfully!'}
                  </p>
                </div>
              </div>
            </div>
          )}
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
            {messages.common?.save?.message || 'Save'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SettingsTab;
