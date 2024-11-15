import { useStoreData } from '@src/utils/store';
import { useCallback, useEffect, useState } from 'react';
import Spinner from '../common/Spinner';
import { getOutputContent } from '@extension/storage';
import { downloadOutputText } from '@src/utils/fileUtils';
import { getMessageFromLocale } from '@extension/i18n/lib/getMessageFromLocale';
import { type DevLocale } from '@extension/i18n/lib/type';
import { getUserLanguage } from '@extension/storage';

export const AITransformersTab = () => {
  const { transcriptText, setTranscriptText, videoId } = useStoreData();
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [messages, setMessages] = useState(getMessageFromLocale('en'));

  useEffect(() => {
    getUserLanguage().then(lang => {
      const locale = lang as DevLocale;
      const newMessages = getMessageFromLocale(locale);
      setMessages(newMessages);
    });
  }, []);

  useEffect(() => {
    getOutputContent(videoId, true).then((content: string) => {
      if (content) {
        setAnalysisResult(content);
      }
    });
  }, [videoId]);

  useEffect(() => {
    if (videoId) {
      chrome.runtime.sendMessage({ type: 'CHECK_ANALYSIS_FREE_STATUS', videoId }, response => {
        setLoading(response.isRunning);
      });
    }

    const messageListener = (message: { type: string; videoId: string }) => {
      if (message.type === 'ANALYSIS_FREE_COMPLETE' && message.videoId === videoId) {
        setLoading(false);
        getOutputContent(videoId, true).then((content: string) => {
          if (content) {
            setAnalysisResult(content);
          }
        });
      }
      if (message.type === 'ANALYSIS_FREE_ERROR' && message.videoId === videoId) {
        setLoading(false);
      }
    };

    chrome.runtime.onMessage.addListener(messageListener);
    return () => chrome.runtime.onMessage.removeListener(messageListener);
  }, [videoId]);

  const handleAnalyze = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const analysisTask = {
      videoId,
      data: { text: transcriptText },
    };

    chrome.runtime.sendMessage(
      {
        type: 'START_FREE_ANALYSIS',
        payload: analysisTask,
      },
      response => {
        setLoading(true);
        if (!response.success) {
          setLoading(false);
        }
      },
    );
  };

  const handleDownload = useCallback(() => {
    if (analysisResult && videoId) {
      downloadOutputText(analysisResult, videoId);
    }
  }, [analysisResult, videoId]);

  return (
    <div className="space-y-4">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">{messages.tabs?.aiFree?.message}</h1>
      <div className="flex flex-col space-y-4">
        <div className="text-lg font-semibold">{messages.tabs?.aiFree?.message}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{messages.aiFreeTab?.description?.message}</div>
      </div>
      {loading ? (
        <Spinner text={messages.aiTab?.analyzing?.message || 'Analyzing...'} />
      ) : (
        <form onSubmit={handleAnalyze}>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col">
              <label htmlFor="textForAnalysis" className="text-sm font-bold">
                {messages.aiFreeTab?.description?.message || 'Analyze your video transcript using free AI models'}
              </label>
              <textarea
                id="textForAnalysis"
                value={transcriptText}
                onChange={e => setTranscriptText(e.target.value)}
                className="w-full rounded border border-gray-300 p-2"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600">
              {messages.aiTab?.analyze?.message || 'Analyze'}
            </button>
          </div>
        </form>
      )}
      {analysisResult && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xl font-bold">{messages.aiTab?.analysisResult?.message || 'Analysis Result'}</h2>
            <button
              onClick={handleDownload}
              className="rounded bg-green-500 px-3 py-1 text-sm text-white transition-colors hover:bg-green-600"
              title={messages.aiTab?.downloadText?.message || 'Download Text'}>
              {messages.aiTab?.downloadText?.message || 'Download Text'}
            </button>
          </div>
          <textarea
            value={analysisResult}
            readOnly
            className="h-64 w-full resize-none overflow-y-auto rounded border border-gray-300 p-2"
          />
        </div>
      )}
    </div>
  );
};

export default AITransformersTab;
