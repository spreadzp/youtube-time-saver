import React from 'react';

interface VideoAdComponentProps {
    videoId: string;
}

const VideoAdComponent: React.FC<VideoAdComponentProps> = ({ videoId }) => {
    // Construct the YouTube embed URL
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    return (
        <div>
            <h2>Video Ad</h2>
            <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
                <iframe
                    title="YouTube Video Ad"
                    src={embedUrl}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />
            </div>
        </div>
    );
};

export default VideoAdComponent;