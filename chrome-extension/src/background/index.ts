import 'webextension-polyfill';
import type { Pipeline, PipelineType } from '@xenova/transformers';
import { pipeline, env } from '@xenova/transformers';

// Skip initial check for local models, since we are not loading any local models.
env.allowLocalModels = false;
// Due to a bug in onnxruntime-web, we must disable multithreading for now.
// See https://github.com/microsoft/onnxruntime/issues/14445 for more information.
env.backends.onnx.wasm.numThreads = 1;

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

class PipelineSingleton {
  static task: PipelineType = 'summarization';
  static model = 'Xenova/distilbart-cnn-12-6';
  static instance: Promise<Pipeline> | null = null;

  static async getInstance(progress_callback: ((...args: object[]) => void) | undefined = undefined) {
    if (this.instance === null) {
      this.instance = pipeline(this.task as PipelineType, this.model, { progress_callback }) as Promise<Pipeline>;
    }

    return this.instance;
  }
}
// Keep track of running tasks
const tasks = new Map<string, boolean>();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'START_ANALYSIS') {
    handleAnalysisTask(message.payload);
    sendResponse({ success: true });
    return true;
  }
  if (message.type === 'CHECK_ANALYSIS_STATUS') {
    const isRunning = tasks.get(message.videoId) || false;
    sendResponse({ isRunning });
    return true;
  }
  if (message.type === 'START_FREE_ANALYSIS') {
    handleAnalysisFreeTask(message.payload);
    sendResponse({ success: true });
    return true;
  }
  if (message.type === 'CHECK_ANALYSIS_FREE_STATUS') {
    const isFreeRunning = tasks.get(`${message.videoId}-free`) || false;
    sendResponse({ isFreeRunning });
    return true;
  }
});

async function handleAnalysisFreeTask(task: AnalysisTask) {
  const { videoId, data } = task;

  tasks.set(`${videoId}-free`, true);
  try {
    const text = Object.values(data)[0];
    const results = await summarize(text);

    if (results) {
      // Save the result
      await chrome.storage.session.set({
        [`${videoId}-free-output`]: results,
      });

      // Notify any listening tabs
      chrome.runtime.sendMessage({
        type: 'ANALYSIS_FREE_COMPLETE',
        videoId,
        success: true,
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      chrome.runtime.sendMessage({
        type: 'ANALYSIS_FREE_ERROR',
        videoId,
        error: error.message,
      });
    } else {
      console.error('Unknown error:', error);
      chrome.runtime.sendMessage({
        type: 'ANALYSIS_FREE_ERROR',
        videoId,
        error: 'Unknown error',
      });
    }
  } finally {
    tasks.delete(videoId);
  }
}

async function summarize(text: string) {
  // eslint-disable-next-line
  const model = await PipelineSingleton.getInstance(data => {
    //console.log("🚀 ~ model ~ data:", data)
    // You can track the progress of the pipeline creation here.
    // e.g., you can send `data` back to the UI to indicate a progress bar
    // console.log('progress', data)
  });

  // Actually run the model on the input text
  return await model(text);
}

async function handleAnalysisTask(task: AnalysisTask) {
  const { videoId, data, userPrompt, systemPrompt } = task;

  tasks.set(videoId, true);

  try {
    const apiKey = await getUserApiKey();
    const client = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });

    const promptForSystem = `${systemPrompt} The data is in the format: ${JSON.stringify(data, null, 2)}{}. 
    {}`.replace('{}', JSON.stringify(data, null, 2));

    const completion = await client.chat.completions.create({
      messages: [
        { role: 'system', content: promptForSystem },
        { role: 'user', content: userPrompt },
      ],
      model: 'deepseek-chat',
    });

    if (completion?.choices[0]?.message?.content) {
      const content = completion.choices[0].message.content;

      // Save the result
      await chrome.storage.session.set({
        [`${videoId}-output`]: content,
      });

      // Notify any listening tabs
      chrome.runtime.sendMessage({
        type: 'ANALYSIS_COMPLETE',
        videoId,
        success: true,
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      chrome.runtime.sendMessage({
        type: 'ANALYSIS_ERROR',
        videoId,
        error: error.message,
      });
    } else {
      console.error('Unknown error:', error);
      chrome.runtime.sendMessage({
        type: 'ANALYSIS_ERROR',
        videoId,
        error: 'Unknown error',
      });
    }
  } finally {
    tasks.delete(videoId);
  }
}
