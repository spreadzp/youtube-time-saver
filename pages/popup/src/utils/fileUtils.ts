// pages/popup/src/utils/fileUtils.ts

interface Transcript {
  text: string;
}

export const downloadTranscriptJson = (transcripts: Transcript[], videoId: string) => {
  if (!transcripts.length || !videoId) return;

  const jsonContent = JSON.stringify(transcripts, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${videoId}-time.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadTranscriptText = (transcripts: Transcript[], videoId: string) => {
  if (!transcripts.length || !videoId) return;

  const textContent = transcripts
    .map(segment => segment.text)
    .join(' ')
    .replace(/\s+/g, ' ') // Remove extra spaces
    .trim();

  const blob = new Blob([textContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${videoId}-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadOutputText = (context: string, videoId: string) => {
  const blob = new Blob([context], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${videoId}-analyzed-${Date.now()}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export function parseVideoId(url: string): string | null {
  // Regular expressions to match different YouTube URL formats
  const youtubeWatchRegex = /^https:\/\/www\.youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;
  const youtubeEmbedRegex = /^https:\/\/www\.youtube\.com\/embed\/([a-zA-Z0-9_-]+)/;
  const youtubeShortRegex = /^https:\/\/youtu\.be\/([a-zA-Z0-9_-]+)/;

  // Check if the URL matches any of the YouTube URL patterns
  const matchWatch = url.match(youtubeWatchRegex);
  const matchEmbed = url.match(youtubeEmbedRegex);
  const matchShort = url.match(youtubeShortRegex);

  if (matchWatch) {
    // Extract the video ID from the matched watch URL
    return matchWatch[1];
  } else if (matchEmbed) {
    // Extract the video ID from the matched embed URL
    return matchEmbed[1];
  } else if (matchShort) {
    // Extract the video ID from the matched short URL
    return matchShort[1];
  } else {
    // Return null if the URL does not match any known YouTube URL pattern
    return null;
  }
}

export const formatTime = (offset: number): string => {
  const date = new Date(offset * 1000);
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
};
