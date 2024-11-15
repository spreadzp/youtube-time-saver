// pages/popup/src/components/VideoHandlerComponent.tsx
import React, { useEffect, useState } from 'react';
import { YoutubeTranscript } from 'youtube-transcript';
import VideoAdComponent from './video-ad';
import { downloadTranscriptJson, downloadTranscriptText, parseVideoId, formatTime } from '../utils/fileUtils';
import type { TranscriptSegment } from '@src/types/youtube.type';
import { useStoreData } from '@src/utils/store';
import { getInputContent, getUserLanguage, setContentInputStorage } from '@extension/storage';
import { getMessageFromLocale } from '@extension/i18n/lib/getMessageFromLocale';
import { type DevLocale } from '@extension/i18n/lib/type';

type VideoHandlerProps = {
  url: string;
};

const VideoHandlerComponent: React.FC<VideoHandlerProps> = ({ url }) => {
  //const [videoUrl, setVideoUrl] = useState('');
  const [transcripts, setTranscripts] = useState<TranscriptSegment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState(getMessageFromLocale('en'));
  const { setTranscriptText, setTranscript, setVideoId, videoId } = useStoreData();

  // Clean text function to handle HTML entities and formatting
  const cleanText = (text: string): string => {
    return text
      .replace(/&amp;#39;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;quot;/g, '"')
      .replace(/&amp;amp;/g, '&')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!videoId) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const transcriptData = await YoutubeTranscript.fetchTranscript(videoId);
      // Clean the text in each transcript segment
      const cleanedTranscripts = transcriptData.map(segment => ({
        ...segment,
        text: cleanText(segment.text),
      }));

      setTranscripts(cleanedTranscripts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transcript');
      console.error('Error fetching transcript:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTranscript(transcripts);

    if (transcripts.length > 0) {
      setContentInputStorage(videoId, JSON.stringify(transcripts));
      const textContent = transcripts
        .map(segment => segment.text)
        .join(' ')
        .replace(/\s+/g, ' ') // Remove extra spaces
        .trim();
      setTranscriptText(textContent);
    }
  }, [transcripts, setTranscript, setTranscriptText, videoId]);

  useEffect(() => {
    if (url) {
      const id = parseVideoId(url);
      setVideoId(id || '');
      if (!id) {
        setError('Invalid YouTube URL or video ID');
      } else {
        setError(null);
      }
    }
  }, [url, setVideoId]);

  useEffect(() => {
    getInputContent(videoId).then((content: string) => {
      if (content !== '') {
        const parsedContent = JSON.parse(content);
        setTranscripts(parsedContent);
      }
    });
  }, [videoId, setTranscripts]);

  useEffect(() => {
    getUserLanguage().then(lang => {
      const locale = lang as DevLocale;
      setMessages(getMessageFromLocale(locale));
    });
  }, []);

  return (
    <div className="mx-auto max-w-2xl p-4">
      {videoId && <VideoAdComponent videoId={videoId} />}

      <form onSubmit={handleSubmit} className="space-y-4">
        <button
          type="submit"
          disabled={isLoading || !videoId}
          className={`w-full rounded px-4 py-2 font-semibold text-white transition-colors
                    ${isLoading || !videoId ? 'cursor-not-allowed bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'}`}>
          {isLoading ? messages.common.loading.message : messages.youtubeTab?.getTranscript.message}
        </button>
      </form>

      {error && <div className="mt-4 rounded bg-red-100 p-3 text-red-700">{error}</div>}

      {transcripts.length > 0 && (
        <div className="mt-6">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={() => downloadTranscriptJson(transcripts, videoId)}
                className="rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600">
                {`${messages.youtubeTab?.download.message} JSON`}
              </button>
              <button
                onClick={() => downloadTranscriptText(transcripts, videoId)}
                className="rounded bg-green-500 px-4 py-2 font-semibold text-white hover:bg-green-600">
                {`${messages.youtubeTab?.download.message} Text`}
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto rounded border border-gray-200">
            {transcripts.map((segment, index) => (
              <div key={index} className={`flex gap-3 p-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                <span className="whitespace-nowrap text-sm text-gray-500">{formatTime(segment.offset)}</span>
                <p className="text-gray-700">{segment.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoHandlerComponent;
