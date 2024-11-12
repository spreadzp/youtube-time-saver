// components/FeedbackTab.tsx

import { sendPostMessage } from '@src/utils/sendPostRequest';
import React, { useState } from 'react';

const FeedbackTab = () => {
    const [feedback, setFeedback] = useState('');
    const [response, setResponse] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const preparedFeedback = ` feedback from extension: ${feedback}  `;
        const res = await sendPostMessage(import.meta.env.VITE_DISCORD_WEBHOOK, preparedFeedback);
        setResponse(res);
    };

    return (
        <div className="p-4">
            <h2 className="mb-4 text-xl font-bold">Feedback</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Enter your feedback"
                    className="w-full rounded border border-gray-300 p-2"
                />
                <button
                    type="submit"
                    className="w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
                >
                    Submit
                </button>
            </form>
            {response && <p>{response}</p>}
        </div>
    );
};

export default FeedbackTab;