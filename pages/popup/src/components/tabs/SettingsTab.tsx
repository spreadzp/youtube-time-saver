import { useState, useEffect } from 'react';
import { getAIModelConfig, setAIModelConfig, setUserApiKey } from '@extension/storage';
import { useStoreData } from '@src/utils/store';
import { getMessageFromLocale } from '@extension/i18n/lib/getMessageFromLocale';
import { type DevLocale } from '@extension/i18n/lib/type';
import { getUserLanguage } from '@extension/storage';

const AI_PROVIDERS = [
  {
    id: 'gemini',
    name: 'Google Gemini',
    models: ['gemini-pro'],
  },
  {
    id: 'openai',
    name: 'OpenAI',
    models: ['gpt-3.5-turbo', 'gpt-4'],
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    models: ['deepseek-chat', 'deepseek-coder'],
  },
] as const;

export const SettingsTab = () => {
  const { aiConfig, setAIConfig } = useStoreData();
  const [messages, setMessages] = useState(getMessageFromLocale('en'));
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const loadConfig = async () => {
      const savedConfig = await getAIModelConfig();
      setAIConfig(savedConfig);
    };
    loadConfig();

    getUserLanguage().then(lang => {
      const locale = lang as DevLocale;
      const newMessages = getMessageFromLocale(locale);
      setMessages(newMessages);
    });
  }, []);

  const handleProviderChange = async (provider: typeof aiConfig.provider) => {
    const defaultModel = AI_PROVIDERS.find(p => p.id === provider)?.models[0] || '';
    const newConfig = { ...aiConfig, provider, model: defaultModel };
    setAIConfig(newConfig);
    await setAIModelConfig(newConfig);
    showSuccessMessage();
  };

  const handleModelChange = async (model: string) => {
    const newConfig = { ...aiConfig, model };
    setAIConfig(newConfig);
    await setAIModelConfig(newConfig);
    showSuccessMessage();
  };

  const handleApiKeyChange = async (apiKey: string) => {
    const newConfig = { ...aiConfig, apiKey };
    setAIConfig(newConfig);
    await setAIModelConfig(newConfig);
    await setUserApiKey(apiKey, aiConfig.provider);
    showSuccessMessage();
  };

  const handleTemperatureChange = async (temperature: number) => {
    const newConfig = { ...aiConfig, temperature };
    setAIConfig(newConfig);
    await setAIModelConfig(newConfig);
    showSuccessMessage();
  };

  const handleMaxTokensChange = async (maxTokens: number) => {
    const newConfig = { ...aiConfig, maxTokens };
    setAIConfig(newConfig);
    await setAIModelConfig(newConfig);
    showSuccessMessage();
  };

  const showSuccessMessage = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="space-y-4">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">{messages.tabs?.settings?.message || 'Settings'}</h1>
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-6">
          <div className="text-lg font-semibold">{messages.tabs?.settings?.message}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{messages.settingsTab?.description?.message}</div>

          <div className="mt-4">
            <h2 className="text-lg font-medium text-gray-900">{messages.settingsTab?.apiSettings?.title?.message || 'API Settings'}</h2>
            <p className="mt-1 text-sm text-gray-500">{messages.settingsTab?.apiSettings?.description?.message}</p>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {messages.settingsTab?.apiSettings?.provider?.label?.message || 'AI Provider'}
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={aiConfig.provider}
              onChange={(e) => handleProviderChange(e.target.value as typeof aiConfig.provider)}
            >
              {AI_PROVIDERS.map((provider) => (
                <option key={provider.id} value={provider.id}>
                  {provider.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {messages.settingsTab?.apiSettings?.model?.label?.message || 'Model'}
            </label>
            <select
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={aiConfig.model}
              onChange={(e) => handleModelChange(e.target.value)}
            >
              {AI_PROVIDERS.find(p => p.id === aiConfig.provider)?.models.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {messages.settingsTab?.apiSettings?.apiKey?.label?.message || 'API Key'}
            </label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              value={aiConfig.apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder={`Enter your ${AI_PROVIDERS.find(p => p.id === aiConfig.provider)?.name} API Key`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {messages.settingsTab?.apiSettings?.temperature?.label?.message || 'Temperature'} ({aiConfig.temperature})
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              className="mt-1 block w-full"
              value={aiConfig.temperature}
              onChange={(e) => handleTemperatureChange(parseFloat(e.target.value))}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              {messages.settingsTab?.apiSettings?.maxTokens?.label?.message || 'Max Tokens'} ({aiConfig.maxTokens})
            </label>
            <input
              type="range"
              min="256"
              max="4096"
              step="256"
              className="mt-1 block w-full"
              value={aiConfig.maxTokens}
              onChange={(e) => handleMaxTokensChange(parseInt(e.target.value))}
            />
          </div>

          {showSuccess && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {messages.settingsTab?.apiSettings?.alerts?.success?.message || 'Settings saved successfully!'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
