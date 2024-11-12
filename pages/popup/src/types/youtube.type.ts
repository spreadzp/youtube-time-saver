import type { TranscriptResponse } from "youtube-transcript";

export interface YoutubeData {
    videoId?: string,
    url?: string;
    title?: string;
    description?: string;
    datePublished?: string;
    genre?: string;
    text?: string;
    lang?: string;
    content?: TranscriptResponse[
    ]
    length: number;
}

export interface TranscriptSegment {
    text: string;
    duration: number;
    offset: number;
}