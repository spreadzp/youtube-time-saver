// components/YouTubeTab.tsx

import { useEffect, useState } from 'react';
import VideoHandlerComponent from '../VideoHandlerComponent';

const YouTubeTab = () => {
    const [url, setUrl] = useState('');
    useEffect(() => {
        (async () => {
            const [tab] = await chrome.tabs.query({ currentWindow: true, active: true });
            setUrl(tab.url!);
        })()
    }, [setUrl])

    return (
        <div className="p-4">
            <VideoHandlerComponent url={url} />
        </div>
    );
};

export default YouTubeTab;