// handleYouTube.ts

import type OpenAI from 'openai';

import type { YoutubeData } from '@src/types/youtube.type';
import { systemDetailedPrompt, systemPrompt, systemTimingPrompt, userDefaultPrompt, userDetailedPrompt, userTimingPrompt } from './prompts';
import { TypePrompt } from '@src/types/prompt.type';
import { downloadTranscriptText } from '@src/utils/fileUtils';



export async function handleYouTube(client: OpenAI, videoId: string, data: YoutubeData, userPrompt: string, systemPromptContent: string, isTiming: boolean = false) {

    // Prepare prompts for OpenAI
    // const userPrompt = additionalPrompt ? additionalPrompt : getUserPrompt(prompt, isTiming);
    // const systemPromptContent = getSystemPrompt(prompt, isTiming);
    const promptForSystem = `${systemPromptContent} The data is in the format: ${JSON.stringify(data, null, 2)}{}. 
   {}`.replace('{}', JSON.stringify(data, null, 2));

    // Send prompt to OpenAI
    const completion = await client.chat.completions.create({
        messages: [
            { role: "system", content: promptForSystem },
            { role: "user", content: userPrompt }
        ],
        model: "deepseek-chat",
    });

    console.log(completion.choices[0].message.content);

    // Save the analysis and forecast to a file
    if (completion && completion?.choices[0]?.message?.content) {
        const content = completion?.choices[0]?.message?.content;
        downloadTranscriptText([{ text: content }], videoId);
        return content;
    } else {
        return '';
    }
}

function getUserPrompt(prompt: typeof TypePrompt[keyof typeof TypePrompt], isTiming: boolean): string {
    if (isTiming) {
        return userTimingPrompt;
    }
    switch (prompt) {
        case TypePrompt.default:
            return userDefaultPrompt;
        case TypePrompt.detailed:
            return userDetailedPrompt;
        default:
            return userDefaultPrompt;
    }
}

function getSystemPrompt(prompt: typeof TypePrompt[keyof typeof TypePrompt], isTiming: boolean): string {
    if (isTiming) {
        return systemTimingPrompt;
    }
    switch (prompt) {
        case TypePrompt.default:
            return systemPrompt;
        case TypePrompt.detailed:
            return systemDetailedPrompt;
        default:
            return systemPrompt;
    }
}