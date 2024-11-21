import type { TranscriptSegment } from '@src/types/youtube.type';
import type { AIModelConfig } from '@extension/storage';
import { create } from 'zustand';

interface StoreState {
  transcript: TranscriptSegment[];
  setTranscript: (transcript: TranscriptSegment[]) => void;
  transcriptText: string;
  setTranscriptText: (transcriptText: string) => void;
  apiAIKey: string;
  setApiKey: (apiKey: string) => void;
  aiConfig: AIModelConfig;
  setAIConfig: (config: Partial<AIModelConfig>) => void;
  videoId: string;
  setVideoId: (videoId: string) => void;
}

export const useStoreData = create<StoreState>((set) => ({
  transcript: [],
  setTranscript: (transcript) => set({ transcript }),
  transcriptText: '',
  setTranscriptText: (transcriptText) => set({ transcriptText }),
  apiAIKey: '',
  setApiKey: (apiKey) => set({ apiAIKey: apiKey }),
  aiConfig: {
    provider: 'gemini',
    model: 'gemini-pro',
    apiKey: '',
    temperature: 0.9,
    maxTokens: 2048,
  },
  setAIConfig: (config) => set((state) => ({
    aiConfig: { ...state.aiConfig, ...config }
  })),
  videoId: '',
  setVideoId: (videoId) => set({ videoId }),
}));