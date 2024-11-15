import { useEffect, useState, useCallback } from 'react';
import { getMessageFromLocale } from '@extension/i18n/lib/getMessageFromLocale';
import { type DevLocale } from '@extension/i18n/lib/type';
import { getUserLanguage, getUserApiKey, getOutputContent } from '@extension/storage';
import { useStoreData } from '@src/utils/store';
import {
  systemDefaultPrompt,
  systemPromptWithLanguage,
  userDefaultPrompt,
  userPromptWithLanguage,
} from '@src/components/prompts';
import Spinner from '../common/Spinner';

export const AITab = () => {
  const { transcriptText, videoId } = useStoreData();
  const [systemLangPrompt, setSystemLangPrompt] = useState(systemPromptWithLanguage('English'));
  const [userLangPrompt, setUserLangPrompt] = useState(userPromptWithLanguage('English'));
  const [systemPrompt, setSystemPrompt] = useState(systemDefaultPrompt());
  const [userPrompt, setUserPrompt] = useState(userDefaultPrompt());
  const [responseLanguage, setResponseLanguage] = useState('en');
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [hasKey, setHasKey] = useState(false);
  const [messages, setMessages] = useState(getMessageFromLocale('en'));

  const languages = [
    { value: 'english', label: messages.common?.languages?.english?.message || 'English' },
    { value: 'chinese', label: messages.common?.languages?.chinese?.message || '中文' },
    { value: 'japanese', label: messages.common?.languages?.japanese?.message || '日本語' },
    { value: 'korean', label: messages.common?.languages?.korean?.message || '한국어' },
    { value: 'spanish', label: messages.common?.languages?.spanish?.message || 'Español' },
    { value: 'french', label: messages.common?.languages?.french?.message || 'Français' },
    { value: 'german', label: messages.common?.languages?.german?.message || 'Deutsch' },
    { value: 'italian', label: messages.common?.languages?.italian?.message || 'Italiano' },
    { value: 'russian', label: messages.common?.languages?.russian?.message || 'Русский' },
    { value: 'portuguese', label: messages.common?.languages?.portuguese?.message || 'Português' },
  ];

  useEffect(() => {
    (async () => {
      const apiKey = await getUserApiKey();
      if (apiKey !== '') {
        setHasKey(true);
      }
      getUserLanguage().then(lang => {
        const locale = lang as DevLocale;
        const newMessages = getMessageFromLocale(locale);
        setMessages(newMessages);
      });
    })();
  }, []);

  useEffect(() => {
    if (videoId) {
      getOutputContent(videoId, false).then(content => {
        if (content) {
          setAnalysisResult(content);
        }
      });
    }
  }, [videoId]);

  useEffect(() => {
    if (videoId) {
      chrome.runtime.sendMessage({ type: 'CHECK_ANALYSIS_STATUS', videoId }, response => {
        setLoading(response.isRunning);
      });
    }

    const messageListener = (message: { type: string; videoId: string; success?: boolean; error?: string }) => {
      if (message.type === 'ANALYSIS_COMPLETE' && message.videoId === videoId) {
        setLoading(false);
        getOutputContent(videoId, false).then((content: string) => {
          if (content) {
            setAnalysisResult(content);
          }
        });
      }
      if (message.type === 'ANALYSIS_ERROR' && message.videoId === videoId) {
        setLoading(false);
        setAnalysisResult(`Error: ${message.error || 'Unknown error occurred'}`);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, [videoId]);

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedLanguage = event.target.value;
    setSystemLangPrompt(systemPromptWithLanguage(selectedLanguage));
    setUserLangPrompt(userPromptWithLanguage(selectedLanguage));
    setResponseLanguage(selectedLanguage);
  };

  const handleSystemPromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSystemPrompt(event.target.value);
  };

  const handleUserPromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserPrompt(event.target.value);
  };

  const handleAnalyze = useCallback(async () => {
    if (!transcriptText) return;

    const analysisTask = {
      videoId,
      data: { text: transcriptText },
      systemPrompt: `${systemLangPrompt}\n${systemPrompt}`,
      userPrompt: `${userLangPrompt}\n${userPrompt}`,
    };

    chrome.runtime.sendMessage(
      {
        type: 'START_ANALYSIS',
        payload: analysisTask,
      },
      response => {
        setLoading(true);
        if (!response.success) {
          setLoading(false);
          setAnalysisResult('Failed to start analysis. Please try again.');
        }
      },
    );
  }, [transcriptText, videoId, systemPrompt, userPrompt, systemLangPrompt, userLangPrompt]);

  if (!hasKey) {
    return (
      <div className="space-y-4">
        <div className="rounded-lg bg-yellow-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {messages.tabs?.ai?.message || 'Please set your OpenAI API key in the Settings tab'}
              </h3>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">{messages.tabs?.ai?.message || 'AI Analysis'}</h1>
      {loading ? (
        <Spinner text={messages.aiTab?.analyzing?.message || 'Analyzing...'} />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-col space-y-4">
            <div className="text-lg font-semibold">{messages.tabs?.ai?.message}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">{messages.aiTab?.description?.message}</div>

            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">{messages.aiTab?.outputLanguage?.message}</label>
              <select
                value={responseLanguage}
                onChange={handleLanguageChange}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none">
                {languages.map(lang => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {messages.aiTab?.systemPrompt?.message || 'System Prompt'}
              </label>
              <textarea
                value={systemPrompt}
                onChange={handleSystemPromptChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                rows={4}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                {messages.aiTab?.userPrompt?.message || 'User Prompt'}
              </label>
              <textarea
                value={userPrompt}
                onChange={handleUserPromptChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none"
                rows={4}
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={!transcriptText}
              className="w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600 disabled:bg-gray-400">
              {messages.aiTab?.analyze?.message || 'Analyze'}
            </button>

            {analysisResult && (
              <div className="mt-4">
                <h2 className="mb-2 text-lg font-semibold">
                  {messages.aiTab?.analysisResult?.message || 'Analysis Result'}
                </h2>
                <div className="rounded-lg border border-gray-200 bg-white p-4">
                  <pre className="whitespace-pre-wrap text-sm">{analysisResult}</pre>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AITab;
