

import React, { useState, useEffect } from 'react';
type SpinnerProps = {
    text?: string;
};

const Spinner: React.FC<SpinnerProps> = ({ text = "Loading..." }) => {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        let increasing = true;
        let index = 0;
        const interval = setInterval(() => {
            if (increasing) {
                setDisplayText(text.slice(0, index + 1));
                index++;
                if (index === text.length) {
                    increasing = false;
                }
            } else {
                setDisplayText(text.slice(0, index));
                index--;
                if (index === -1) {
                    increasing = true;
                }
            }
        }, 100);

        return () => clearInterval(interval);
    }, [text]);

    return (
        <div className="flex flex-col items-center justify-center">
            <div className="size-16 animate-spin rounded-full border-y-2 border-purple-500"></div>
            <div className="mt-4 text-lg text-purple-500">{displayText}</div>
        </div>
    );
};

export default Spinner;