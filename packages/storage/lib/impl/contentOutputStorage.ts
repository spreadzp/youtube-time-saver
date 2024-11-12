import { StorageEnum } from '../base/enums';
const chrome = globalThis.chrome;

const getKey = (contentId: string) => `${contentId}-output`;
export const getOutputContent = async (contentId: string): Promise<string> => {
    const data = await chrome?.storage[StorageEnum.Session].get([getKey(contentId)]);
    console.log("🚀 ~ getOutputContent ~ data:", data)
    const content = Object.values(data)[0] || '';
    return content;
};

export const setContentOutputStorage = async (contentId: string, content: string) => {
    await chrome?.storage[StorageEnum.Session].set({ [getKey(contentId)]: content });
};
