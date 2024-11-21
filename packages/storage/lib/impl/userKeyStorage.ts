import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';

interface APIKeys {
  openai?: string;
  deepseek?: string;
  gemini?: string;
}

const storage = createStorage<APIKeys>('user-api-keys', {}, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const getUserApiKey = async (provider?: string): Promise<string> => {
  const keys = await storage.get() || {};
  if (provider) {
    return keys[provider as keyof APIKeys] || '';
  }
  // Legacy support - return first available key
  return keys.deepseek || keys.openai || keys.gemini || '';
};

export const setUserApiKey = async (apiKey: string, provider: string) => {
  const currentKeys = await storage.get() || {};
  await storage.set({
    ...currentKeys,
    [provider]: apiKey
  });
};
