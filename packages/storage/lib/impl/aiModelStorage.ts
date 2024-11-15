import { StorageEnum } from '../base/enums';
const chrome = globalThis.chrome;

export const getAiModelName = async () => {
  const data = await chrome?.storage[StorageEnum.Local].get(['ai-model']);
  const content = Object.values(data)[0] || '';
  return content;
};

export const setAiModelNameStorage = async (modelName: string) => {
  await chrome?.storage[StorageEnum.Local].set({ ['ai-model']: modelName });
};
