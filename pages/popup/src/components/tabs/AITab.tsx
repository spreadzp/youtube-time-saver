// components/AITab.tsx

import React, { useState, useEffect, useCallback } from 'react';
import OpenAI from 'openai';
import { handleYouTube } from '../handleYouTube';
import type { YoutubeData } from '@src/types/youtube.type';
import { downloadOutputText } from '@src/utils/fileUtils';
import { systemPromptWithLanguage, userPromptWithLanguage } from '../prompts';
import { useStoreData } from '@src/utils/store';
import { getOutputContent, getUserApiKey, setUserApiKeyStorage, setContentOutputStorage } from '@extension/storage';
import Spinner from '../common/Spinner';


const AITab = () => {
    const { transcriptText, setApiKey, apiAIKey, videoId } = useStoreData()
    const [systemPrompt, setSystemPrompt] = useState(systemPromptWithLanguage('русский'));
    const [userPrompt, setUserPrompt] = useState(userPromptWithLanguage('русский'));
    const [isTiming, setIsTiming] = useState(false);
    const [responseLanguage, setResponseLanguage] = useState('en');
    const [loading, setLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<string | null>(null);
    const [clientAI, setClient] = useState<OpenAI | null>(null);
    const [hasKey, setHasKey] = useState(false)

    useEffect(() => {
        console.log('videoId for getOutputContent :>>', videoId)
        getOutputContent(videoId).then((content: string) => {
            console.log("🚀 ~ getOutputContent ~ content:", content)
            if (content !== '') {
                setAnalysisResult(content);
            }
        })
    }, [videoId])

    useEffect(() => {
        // Check if there's an ongoing analysis when component mounts
        if (videoId) {
            chrome.runtime.sendMessage(
                { type: 'CHECK_ANALYSIS_STATUS', videoId },
                (response) => {
                    console.log("🚀 ~ useEffect ~ response:", response)
                    setLoading(response.isRunning);
                }
            );
        }

        // Listen for analysis completion
        const messageListener = (message: { type: string; videoId: string }) => {
            console.log("🚀 ~ messageListener ~ message:", message)
            if (message.type === 'ANALYSIS_COMPLETE' && message.videoId === videoId) {
                setLoading(false);
                getOutputContent(videoId).then((content: string) => {
                    if (content !== '') {
                        setAnalysisResult(content);
                    }
                });
            }
            if (message.type === 'ANALYSIS_ERROR' && message.videoId === videoId) {
                setLoading(false);
                // Handle error - maybe show an error message to user
            }
        };

        chrome.runtime.onMessage.addListener(messageListener);
        return () => chrome.runtime.onMessage.removeListener(messageListener);
    }, [videoId]);

    useEffect(() => {


        getUserApiKey()
            .then((apiKey) => {
                if (apiKey !== '') {
                    setHasKey(true)
                    const client = new OpenAI({
                        baseURL: 'https://api.deepseek.com',
                        apiKey: apiKey, //import.meta.env.VITE_API_AI,//apiAIKey,
                        dangerouslyAllowBrowser: true
                    });
                    setClient(client);
                }
            })


    }, []);

    const handleApiKeySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await setUserApiKeyStorage.setApiKey(apiAIKey)
        const apiKey = await getUserApiKey()
        if (apiKey !== '') {
            setHasKey(true)
            const client = new OpenAI({
                baseURL: 'https://api.deepseek.com',
                apiKey: apiKey, //import.meta.env.VITE_API_AI,//apiAIKey,
                dangerouslyAllowBrowser: true
            });
            setClient(client);
        }
    };

    const handleDownload = useCallback(() => {
        if (analysisResult && videoId) {
            console.log("🚀 ~ handleDownload ~ videoId:", videoId)
            downloadOutputText(analysisResult, videoId);
        }

    }, [analysisResult, videoId]);
    // const handleAnalyze = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     // if (!transcriptText || !apiAIKey) return;

    //     setLoading(true);
    //     console.log('transcriptText :>>', transcriptText)
    //     const videoId = 'exampleVideoId'; // Replace with actual video ID extraction logic
    //     const data = {} as YoutubeData;
    //     data.text = transcriptText;

    //     try {
    //         const result = await handleYouTube(clientAI as OpenAI, videoId, data, userPrompt, systemPrompt, isTiming);
    //         if (result) {
    //             await setContentOutputStorage(result as string, videoId)
    //             const content = await getOutputContent(videoId) as string
    //             console.log("🚀 ~ handleAnalyze ~ content:", content)
    //             setAnalysisResult(result as string);
    //         }

    //     } catch (error) {
    //         console.error('Error during analysis:', error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const handleAnalyze = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();


        const analysisTask = {
            videoId,
            data: { text: transcriptText },
            userPrompt,
            systemPrompt,
            isTiming
        };

        // Send the analysis task to the background script
        chrome.runtime.sendMessage(
            {
                type: 'START_ANALYSIS',
                payload: analysisTask
            },
            (response) => {

                console.log("🚀 ~ handleAnalyze ~ response:", response);
                setLoading(true);
                if (!response.success) {
                    setLoading(false);
                    // Handle error - maybe show an error message to user
                }
            }
        );
    };

    if (!hasKey) {
        return (
            <div className="p-4">
                <h2 className="mb-4 text-xl font-bold">Enter API Key</h2>
                <form onSubmit={handleApiKeySubmit} className="space-y-4">
                    <input
                        type="password"
                        value={apiAIKey || ''}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Enter API Key"
                        className="w-full rounded border border-gray-300 p-2"
                    />
                    <button
                        type="submit"
                        className="w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-600"
                    >
                        Save API Key
                    </button>
                </form>
            </div>
        );
    }

    return (
        <div className="p-4">
            <h2 className="mb-4 text-xl font-bold">AI Analysis</h2>
            {loading ? <Spinner text="Analyzing content with AI" /> : <form onSubmit={handleAnalyze} className="space-y-4">
                {/* <input
                    type="file"
                    onChange={handleFileChange}
                    className="w-full rounded border border-gray-300 p-2"
                /> */}
                <textarea
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                    placeholder="System Prompt"
                    className="w-full rounded border border-gray-300 p-2"
                />
                <textarea
                    value={userPrompt}
                    onChange={(e) => setUserPrompt(e.target.value)}
                    placeholder="User Prompt (Optional)"
                    className="w-full rounded border border-gray-300 p-2"
                />
                <div className="flex items-center space-x-4">
                    <label>
                        <input
                            type="radio"
                            value="timestamp"
                            checked={isTiming}
                            onChange={() => setIsTiming(true)}
                        />
                        Timestamp
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="free"
                            checked={!isTiming}
                            onChange={() => setIsTiming(false)}
                        />
                        Free
                    </label>
                </div>
                <select
                    value={responseLanguage}
                    onChange={(e) => setResponseLanguage(e.target.value)}
                    className="w-full rounded border border-gray-300 p-2"
                >
                    <option value="en">English</option>
                    <option value="ru">Russian</option>
                    <option value="ch">Chinese</option>
                    {/* Add more languages as needed */}
                </select>
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white transition-colors ${loading ? 'cursor-not-allowed bg-gray-400' : 'hover:bg-blue-600'
                        }`}
                >
                    {loading ? 'Analyzing...' : 'Analyze'}
                </button>
            </form>}

            {analysisResult && (
                <div className="mt-6">
                    <div className="mb-3 flex items-center justify-between">
                        <h2 className="text-xl font-bold">Analysis Result</h2>
                        <button
                            onClick={() => handleDownload()}
                            className="rounded bg-green-500 px-3 py-1 text-sm text-white transition-colors hover:bg-green-600"
                            title="Download Analysis Text"
                        >
                            Download Text
                        </button>
                    </div>
                    <textarea
                        value={analysisResult}
                        readOnly
                        className="h-64 w-full resize-none overflow-y-auto rounded border border-gray-300 p-2"
                    />
                </div>
            )}
        </div>
    );
};

export default AITab;