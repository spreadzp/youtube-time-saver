import { useEffect, useState, useCallback } from 'react';
import { getMessageFromLocale } from '@extension/i18n/lib/getMessageFromLocale';
import { type DevLocale } from '@extension/i18n/lib/type';
import { getUserLanguage, getUserApiKey, getOutputContent, getAIModelConfig } from '@extension/storage';
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
  const [aiConfig, setAiConfig] = useState<{ provider: string; model: string } | null>(null);

  const languages = [
    { value: 'english', label: messages.common.languages.english.message || 'English' },
    { value: 'chinese', label: messages.common.languages.chinese.message || '中文' },
    { value: 'japanese', label: messages.common.languages.japanese.message || '日本語' },
    { value: 'korean', label: messages.common.languages.korean.message || '한국어' },
    { value: 'spanish', label: messages.common.languages.spanish.message || 'Español' },
    { value: 'french', label: messages.common.languages.french.message || 'Français' },
    { value: 'german', label: messages.common.languages.german.message || 'Deutsch' },
    { value: 'italian', label: messages.common.languages.italian.message || 'Italiano' },
    { value: 'russian', label: messages.common.languages.russian.message || 'Русский' },
    { value: 'portuguese', label: messages.common.languages.portuguese.message || 'Português' },
  ];

  useEffect(() => {
    (async () => {
      const config = await getAIModelConfig();
      setAiConfig(config);
      const apiKey = await getUserApiKey(config.provider);
      setHasKey(apiKey !== '');

      getUserLanguage().then(lang => {
        const locale = lang as DevLocale;
        const newMessages = getMessageFromLocale(locale);
        setMessages(newMessages);
      });
    })();
  }, []);

  useEffect(() => {
    if (aiConfig?.provider) {
      getUserApiKey(aiConfig.provider).then(apiKey => {
        setHasKey(apiKey !== '');
      });
    }
  }, [aiConfig?.provider]);

  const handleAnalyze = useCallback(async () => {
    if (!transcriptText || loading) return;

    setLoading(true);
    setAnalysisResult(null);

    try {
      await chrome.runtime.sendMessage({
        type: 'START_ANALYSIS',
        payload: {
          videoId,
          data: transcriptText,
          userPrompt: userPrompt,
          systemPrompt: systemPrompt,
          isTiming: false,
        },
      });

      // Poll for results
      const checkResult = async () => {
        const result = await getOutputContent(videoId, false);
        if (result) {
          setAnalysisResult(result);
          setLoading(false);
        } else {
          setTimeout(checkResult, 1000);
        }
      };

      checkResult();
    } catch (error) {
      console.error('Error during analysis:', error);
      setLoading(false);
    }
  }, [transcriptText, loading, videoId, userPrompt, systemPrompt]);

  return (
    <div className="flex flex-col gap-4 p-4">
      {!hasKey && (
        <div className="text-red-500 mb-4">
          {messages?.settings?.apiKeyRequired?.message || 'API Key is required'}
        </div>
      )}
      
      {aiConfig && (
        <div className="text-sm text-gray-600 mb-2">
          {messages?.aiTab?.modelInfo?.message?.replace('{provider}', aiConfig.provider.toUpperCase())
            .replace('{model}', aiConfig.model) || `Using ${aiConfig.provider.toUpperCase()} - ${aiConfig.model}`}
        </div>
      )}

      <select
        className="p-2 border rounded"
        value={responseLanguage}
        onChange={(e) => {
          setResponseLanguage(e.target.value);
          setSystemLangPrompt(systemPromptWithLanguage(e.target.value));
          setUserLangPrompt(userPromptWithLanguage(e.target.value));
        }}
      >
        {languages.map((lang) => (
          <option key={lang.value} value={lang.value}>
            {lang.label}
          </option>
        ))}
      </select>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          {messages?.aiTab?.systemPrompt?.message || 'System Prompt'}:
        </label>
        <textarea
          className="p-2 border rounded h-24"
          value={systemPrompt}
          onChange={(e) => setSystemPrompt(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">
          {messages?.aiTab?.userPrompt?.message || 'User Prompt'}:
        </label>
        <textarea
          className="p-2 border rounded h-24"
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
        />
      </div>

      <button
        className={`p-2 rounded ${
          !hasKey || loading
            ? 'bg-gray-300 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
        onClick={handleAnalyze}
        disabled={!hasKey || loading}
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Spinner text={messages?.aiTab?.analyzing?.message || 'Analyzing...'} />            
          </div>
        ) : (
          messages?.aiTab?.analyze?.message || 'Analyze'
        )}
      </button>

      {analysisResult && (
        <div className="mt-4">
          <h3 className="font-medium mb-2">
            {messages?.aiTab?.result?.message || 'Analysis Result'}:
          </h3>
          <div className="p-4 bg-gray-100 rounded whitespace-pre-wrap">{analysisResult}</div>
        </div>
      )}
    </div>
  );
};

export default AITab;
