import type { TranscriptSegment } from '@src/types/youtube.type'
import { create } from 'zustand'

interface BearState {
    transcript: TranscriptSegment[]
    setTranscript: (transcript: TranscriptSegment[]) => void
    transcriptText: string
    setTranscriptText: (transcriptText: string) => void,
    apiAIKey: string
    setApiKey: (apiKey: string) => void
    videoId: string
    setVideoId: (videoId: string) => void
}

export const useStoreData = create<BearState>((set) => ({
    transcript: [],
    setTranscript: (transcript) => set({ transcript }),
    transcriptText: '',
    setTranscriptText: (transcriptText) => set({ transcriptText }),
    apiAIKey: '',
    setApiKey: (apiKey) => set({ apiAIKey: apiKey }),
    videoId: '',
    setVideoId: (videoId) => set({ videoId }),
}))