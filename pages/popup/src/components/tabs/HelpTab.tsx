// components/HelpTab.tsx

import React, { useState } from 'react';

const HelpTab = () => {
    const [username, setUsername] = useState('');

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('Account Username:', username);
    };

    return (
        <div className="p-4">
            <h2 className="mb-4 text-xl font-bold">Help</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter Username"
                    className="w-full rounded border border-gray-300 p-2"
                />
                <button
                    type="submit"
                    className="w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
                >
                    Submit
                </button>
            </form>
        </div>
    );
};

export default HelpTab;