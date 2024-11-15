import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';
const chrome = globalThis.chrome;

type KeyStorage = BaseStorage<string> & {
  setApiKey: (apiKey: string) => Promise<void>;
};

const storage = createStorage<string>('user-api-storage-key', '', {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export const getUserApiKey = async () => {
  const data = await chrome?.storage[StorageEnum.Local].get(['user-api-storage-key']);
  let key = Object.values(data)[0] || '';
  if (!key) {
    setUserApiKeyStorage.setApiKey('');
    key = await storage.get();
  }

  return key;
};

// You can extend it with your own methods
export const setUserApiKeyStorage: KeyStorage = {
  ...storage,
  setApiKey: async (apiKey: string) => {
    await storage.set(apiKey);
  },
};
