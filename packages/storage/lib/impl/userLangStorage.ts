import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';
const chrome = globalThis.chrome;

type LangStorage = BaseStorage<string> & {
    setLanguage: (language: string) => Promise<void>;
};

const storage = createStorage<string>('user-lang-storage-key', 'en', {
    storageEnum: StorageEnum.Local,
    liveUpdate: true,
});

export const getUserLanguage = async () => {
    const data = await chrome?.storage[StorageEnum.Local].get(['user-lang-storage-key']);
    let language = Object.values(data)[0];
    if (!language) {
        setUserLangStorage.setLanguage('en');
        language = await storage.get();
    }
    return language;
};
// You can extend it with your own methods
export const setUserLangStorage: LangStorage = {
    ...storage,
    setLanguage: async (lang: string) => {
        await storage.set(lang);
    },
};
