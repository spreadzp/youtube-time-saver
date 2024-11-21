import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import { getUserApiKey } from './userKeyStorage';

export interface AIModelConfig {
  provider: 'openai' | 'deepseek' | 'gemini';
  model: string;
  temperature?: number;
  maxTokens?: number;
  apiKey?: string;
}

const DEFAULT_CONFIG: AIModelConfig = {
  provider: 'gemini',
  model: 'gemini-1.5-flash',
  temperature: 0.9,
  maxTokens: 2048,
};

const storage = createStorage<AIModelConfig>('ai-model-config', DEFAULT_CONFIG, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const getAIModelConfig = async (): Promise<AIModelConfig> => {
  const data = await storage.get() || DEFAULT_CONFIG;
  return data;
};

export const setAIModelConfig = async (config: Partial<AIModelConfig>) => {
  const currentConfig = await storage.get();
  const newConfig = { ...currentConfig, ...config };
  await storage.set(newConfig);
  
  // Get the API key for the new provider
  const apiKey = await getUserApiKey(newConfig.provider);
  
  // Notify the background script about the configuration change
  chrome.runtime.sendMessage({ 
    type: 'AI_CONFIG_UPDATED', 
    config: { ...newConfig, apiKey }
  }).catch(() => {
    // Ignore error if background script is not ready
  });
};

// Legacy methods for backward compatibility
export const getAiModelName = async () => {
  const config = await getAIModelConfig();
  return config.model;
};

export const setAiModelNameStorage = async (modelName: string) => {
  await setAIModelConfig({ model: modelName });
};
