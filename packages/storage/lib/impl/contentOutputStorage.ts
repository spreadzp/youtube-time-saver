import { StorageEnum } from '../base/enums';
const chrome = globalThis.chrome;

export const getOutputContent = async (contentId: string, isFree: boolean): Promise<string> => {
  const data = await chrome?.storage[StorageEnum.Session].get([`${contentId}${isFree ? '-free' : ''}-output`]);
  const content = Object.values(data)[0] || '';
  return isFree && content ? content[0].summary_text : content;
};

export const setContentOutputStorage = async (contentId: string, content: string, isFree: boolean) => {
  await chrome?.storage[StorageEnum.Session].set({ [`${contentId}${isFree ? '-free' : ''}-output`]: content });
};
