import { sendPostMessage } from '@src/utils/sendPostRequest';
import React, { useState, useEffect } from 'react';
import { getMessageFromLocale } from '@extension/i18n/lib/getMessageFromLocale';
import { type DevLocale } from '@extension/i18n/lib/type';
import { getUserLanguage } from '@extension/storage';
import VideoAdComponent from '../video-ad';

const HelpTab = () => {
  const [feedback, setFeedback] = useState('');
  const [response, setResponse] = useState<string[]>([]);
  const [messages, setMessages] = useState(getMessageFromLocale('en'));

  useEffect(() => {
    getUserLanguage().then(lang => {
      const locale = lang as DevLocale;
      const newMessages = getMessageFromLocale(locale);
      setMessages(newMessages);
    });
  }, []);

  const handleSubmitFeedback = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const preparedFeedback = `feedback from extension YT: ${feedback}`;
    const res = await sendPostMessage(import.meta.env.VITE_DISCORD_WEBHOOK, preparedFeedback);
    setResponse([...response, res]);
  };

  return (
    <div className="space-y-4">
      <h1 className="mb-4 text-2xl font-bold text-gray-900">{messages.tabs?.help?.message || 'Help & Support'}</h1>
      <div className="mb-6">
        <h2 className="mb-3 text-xl font-bold text-gray-800">
          {messages.helpTab?.howToUse?.title?.message || 'How to Use'}
        </h2>
        <p className="mb-4 text-gray-600">
          {messages.helpTab?.description?.message || 'Learn how to use YouTube Time Saver effectively'}
        </p>
        <VideoAdComponent videoId="Nb2ZbrpD_tA" />
        <div className="mt-4 space-y-3 text-gray-700">
          <h3 className="font-semibold">{messages.helpTab?.quickGuide?.title?.message || 'Quick Guide'}</h3>
          <ol className="ml-4 list-decimal space-y-2">
            <li>{messages.helpTab?.quickGuide?.steps?.step1?.message || 'Open a YouTube video'}</li>
            <li>{messages.helpTab?.quickGuide?.steps?.step2?.message || 'Click on the extension icon'}</li>
            <li>{messages.helpTab?.quickGuide?.steps?.step3?.message || 'Choose your analysis options'}</li>
            <li>{messages.helpTab?.quickGuide?.steps?.step4?.message || 'Click Analyze'}</li>
            <li>{messages.helpTab?.quickGuide?.steps?.step5?.message || 'View your results'}</li>
          </ol>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="mb-3 text-xl font-bold text-gray-800">
          {messages.helpTab?.feedback?.title?.message || 'Send Feedback'}
        </h2>
        <p className="mb-4 text-gray-600">
          {messages.helpTab?.feedback?.description?.message || 'Help us improve by sending your feedback'}
        </p>
        <form onSubmit={handleSubmitFeedback} className="space-y-4">
          <textarea
            value={feedback}
            onChange={e => setFeedback(e.target.value)}
            placeholder={messages.helpTab?.feedback?.placeholder?.message || 'Type your feedback here...'}
            className="w-full rounded-lg border border-gray-300 p-2 focus:border-blue-500 focus:outline-none"
            rows={4}
          />
          <button type="submit" className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600">
            {messages.helpTab?.feedback?.submit?.message || 'Submit Feedback'}
          </button>
        </form>
        {response.length > 0 && (
          <div className="mt-4">
            {response.map((res, index) => (
              <p key={index} className="text-green-600">
                {res}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpTab;
