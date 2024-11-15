import type { BaseStorage, ValueOrUpdate } from '../base/types';
import { StorageKey } from '../constants/storageKeys';
const chrome = globalThis.chrome;

type LangStorage = BaseStorage<string> & {
  setLanguage: (language: string) => Promise<void>;
};

export const getUserLanguage = async (): Promise<string> => {
  const result = await chrome.storage.local.get(StorageKey.USER_LANGUAGE);
  return result[StorageKey.USER_LANGUAGE] || 'en';
};

export const setUserLangStorage: LangStorage = {
  set: async (value: ValueOrUpdate<string>) => {
    const lang =
      typeof value === 'function'
        ? await (value as (prev: string) => Promise<string> | string)(await getUserLanguage())
        : value;
    await chrome.storage.local.set({
      [StorageKey.USER_LANGUAGE]: lang,
    });
  },
  get: async () => {
    const result = await chrome.storage.local.get(StorageKey.USER_LANGUAGE);
    return result[StorageKey.USER_LANGUAGE] || 'en';
  },
  setLanguage: async (lang: string) => {
    await chrome.storage.local.set({
      [StorageKey.USER_LANGUAGE]: lang,
    });
  },
  getSnapshot: () => {
    return null; // Implement if needed
  },
  subscribe: (listener: () => void) => {
    return () => {}; // Implement if needed
  },
};
