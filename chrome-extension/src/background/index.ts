import 'webextension-polyfill';
import type { Pipeline, PipelineType } from '@xenova/transformers';
import { pipeline, env } from '@xenova/transformers';
import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import OpenAI from 'openai';
import { getAIModelConfig, getUserApiKey } from '@extension/storage';

// Skip initial check for local models, since we are not loading any local models.
env.allowLocalModels = false;
// Due to a bug in onnxruntime-web, we must disable multithreading for now.
// See https://github.com/microsoft/onnxruntime/issues/14445 for more information.
env.backends.onnx.wasm.numThreads = 1;

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

class AIService {
  private geminiAI: GoogleGenerativeAI | null = null;
  private openAIClient: OpenAI | null = null;
  private deepseekClient: OpenAI | null = null;

  async initGemini(apiKey: string) {
    this.geminiAI = new GoogleGenerativeAI(apiKey);
  }

  async initOpenAI(apiKey: string) {
    this.openAIClient = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async initDeepseek(apiKey: string) {
    this.deepseekClient = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });
  }

  async generateTextWithGemini(systemPrompt: string, userPrompt: string): Promise<string> {
    if (!this.geminiAI) throw new Error('Gemini AI not initialized');
    
    try {
      const model = this.geminiAI.getGenerativeModel({
        model: "gemini-pro",
        generationConfig: {
          temperature: 0.9,
          topP: 0.95,
          topK: 40,
          maxOutputTokens: 8192,
        }
      });

      const prompt = `${systemPrompt}\n\n${userPrompt}`;
      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      throw error;
    }
  }

  async generateTextWithOpenAI(systemPrompt: string, userPrompt: string, config: any): Promise<string> {
    if (!this.openAIClient) throw new Error('OpenAI not initialized');
    
    const completion = await this.openAIClient.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: config.model || 'gpt-3.5-turbo',
      temperature: config.temperature || 0.7,
      max_tokens: config.maxTokens || 2048,
    });

    return completion.choices[0]?.message?.content || '';
  }

  async generateTextWithDeepseek(systemPrompt: string, userPrompt: string, config: any): Promise<string> {
    if (!this.deepseekClient) throw new Error('Deepseek not initialized');
    
    const completion = await this.deepseekClient.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: 'deepseek-chat',
      temperature: config.temperature || 0.7,
      max_tokens: config.maxTokens || 2048,
    });

    return completion.choices[0]?.message?.content || '';
  }

  async generateText(prompt: string): Promise<string> {
    const config = await getAIModelConfig();
    if (!config.apiKey) {
      throw new Error('API key not configured');
    }

    // Initialize if not already initialized
    switch (config.provider) {
      case 'gemini':
        if (!this.geminiAI) await this.initGemini(config.apiKey);
        return this.generateTextWithGemini('', prompt);
      case 'openai':
        if (!this.openAIClient) await this.initOpenAI(config.apiKey);
        return this.generateTextWithOpenAI('', prompt, config);
      case 'deepseek':
        if (!this.deepseekClient) await this.initDeepseek(config.apiKey);
        return this.generateTextWithDeepseek('', prompt, config);
      default:
        throw new Error('Unsupported AI provider');
    }
  }
}

const aiService = new AIService();

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
  if (message.type === 'GENERATE_TEXT') {
    aiService.generateText(message.prompt)
      .then(response => sendResponse({ success: true, data: response }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Required for async response
  }
  if (message.type === 'AI_CONFIG_UPDATED') {
    // Reinitialize AI service with new configuration
    const config = message.config;
    if (config.apiKey) {
      switch (config.provider) {
        case 'gemini':
          aiService.initGemini(config.apiKey);
          break;
        case 'openai':
          aiService.initOpenAI(config.apiKey);
          break;
        case 'deepseek':
          aiService.initDeepseek(config.apiKey);
          break;
      }
    }
  }
  return true;
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
    tasks.delete(`${videoId}-free`);
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
    const config = await getAIModelConfig();
    if (!config.apiKey) {
      throw new Error(`API key not configured for ${config.provider}`);
    }

    // Initialize the appropriate AI service
    switch (config.provider) {
      case 'gemini':
        await aiService.initGemini(config.apiKey);
        break;
      case 'openai':
        await aiService.initOpenAI(config.apiKey);
        break;
      case 'deepseek':
        await aiService.initDeepseek(config.apiKey);
        break;
    }

    const promptForSystem = `${systemPrompt} The data is in the format: ${JSON.stringify(data, null, 2)}{}. 
    {}`.replace('{}', JSON.stringify(data, null, 2));

    let content: string;
    switch (config.provider) {
      case 'gemini':
        content = await aiService.generateTextWithGemini(promptForSystem, userPrompt);
        break;
      case 'openai':
        content = await aiService.generateTextWithOpenAI(promptForSystem, userPrompt, config);
        break;
      case 'deepseek':
        content = await aiService.generateTextWithDeepseek(promptForSystem, userPrompt, config);
        break;
      default:
        throw new Error('Unsupported AI provider');
    }

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

// Initialize AI service when extension starts
getAIModelConfig().then(config => {
  if (config.apiKey) {
    switch (config.provider) {
      case 'gemini':
        aiService.initGemini(config.apiKey);
        break;
      case 'openai':
        aiService.initOpenAI(config.apiKey);
        break;
      case 'deepseek':
        aiService.initDeepseek(config.apiKey);
        break;
    }
  }
});
