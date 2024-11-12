import 'webextension-polyfill';

// background/aiService.ts
import OpenAI from 'openai';
import { getUserApiKey } from '@extension/storage';

interface AnalysisTask {
  videoId: string;
  data: object;
  userPrompt: string;
  systemPrompt: string;
  isTiming: boolean;
}

// Keep track of running tasks
const tasks = new Map<string, boolean>();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("🚀 ~ chrome.runtime.onMessage.addListener ~ message:", message)
  if (message.type === 'START_ANALYSIS') {
    handleAnalysisTask(message.payload);
    sendResponse({ success: true });
    return true;
  }
  if (message.type === 'CHECK_ANALYSIS_STATUS') {
    const isRunning = tasks.get(message.videoId) || false;
    console.log("🚀 ~ chrome.runtime.onMessage.addListener ~ isRunning:", isRunning)
    sendResponse({ isRunning });
    return true;
  }
});

async function handleAnalysisTask(task: AnalysisTask) {
  const { videoId, data, userPrompt, systemPrompt } = task;

  tasks.set(videoId, true);

  try {
    const apiKey = await getUserApiKey();
    const client = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: apiKey,
      dangerouslyAllowBrowser: true
    });

    const promptForSystem = `${systemPrompt} The data is in the format: ${JSON.stringify(data, null, 2)}{}. 
    {}`.replace('{}', JSON.stringify(data, null, 2));

    const completion = await client.chat.completions.create({
      messages: [
        { role: "system", content: promptForSystem },
        { role: "user", content: userPrompt }
      ],
      model: "deepseek-chat",
    });

    if (completion?.choices[0]?.message?.content) {
      const content = completion.choices[0].message.content;

      // Save the result
      await chrome.storage.session.set({
        [`${videoId}-output`]: content
      });

      // Notify any listening tabs
      chrome.runtime.sendMessage({
        type: 'ANALYSIS_COMPLETE',
        videoId,
        success: true
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      chrome.runtime.sendMessage({
        type: 'ANALYSIS_ERROR',
        videoId,
        error: error.message
      });
    } else {
      console.error('Unknown error:', error);
      chrome.runtime.sendMessage({
        type: 'ANALYSIS_ERROR',
        videoId,
        error: 'Unknown error'
      });
    }
  } finally {
    tasks.delete(videoId);
  }
}