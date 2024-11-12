import { StorageEnum } from '../base/enums';
const chrome = globalThis.chrome;


export const getInputContent = async (contentId: string) => {
    const data = await chrome?.storage[StorageEnum.Session].get([`${contentId}-input`]);
    const content = Object.values(data)[0] || '';
    return content;
};

export const setContentInputStorage = async (contentId: string, content: string) => {
    await chrome?.storage[StorageEnum.Session].set({ [`${contentId}-input`]: content });
};
