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
    console.log("🚀 ~ downloadOutputText ~ videoId:", videoId);

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

export const parseVideoId = (url: string): string | null => {
    try {
        const urlObj = new URL(url);
        const searchParams = new URLSearchParams(urlObj.search);
        return searchParams.get('v');
    } catch {
        if (url.match(/^[a-zA-Z0-9_-]{11}$/)) {
            return url;
        }
        return null;
    }
};

export const formatTime = (offset: number): string => {
    const date = new Date(offset * 1000);
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const seconds = date.getUTCSeconds().toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
};