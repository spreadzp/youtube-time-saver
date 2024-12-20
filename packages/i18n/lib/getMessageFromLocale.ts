/**
 * This file is generated by generate-i18n.mjs
 * Do not edit this file directly
 */
import deMessage from '../locales/de/messages.json';
import enMessage from '../locales/en/messages.json';
import esMessage from '../locales/es/messages.json';
import itMessage from '../locales/it/messages.json';
import jaMessage from '../locales/ja/messages.json';
import koMessage from '../locales/ko/messages.json';
import ruMessage from '../locales/ru/messages.json';
import zh_CNMessage from '../locales/zh_CN/messages.json';
import type { ContentI18 } from './messageTypes';

export function getMessageFromLocale(locale: string): ContentI18 {
  switch (locale) {
    case 'de':
      return deMessage;
    case 'en':
      return enMessage;
    case 'es':
      return esMessage;
    case 'it':
      return itMessage;
    case 'ja':
      return jaMessage;
    case 'ko':
      return koMessage;
    case 'ru':
      return ruMessage;
    case 'zh_CN':
      return zh_CNMessage;
    default:
      throw new Error('Unsupported locale');
  }
}

export const defaultLocale = (() => {
  const locales = ['de', 'en', 'es', 'it', 'ja', 'ko', 'ru', 'zh_CN'];
  const firstLocale = locales[0];
  const defaultLocale = Intl.DateTimeFormat().resolvedOptions().locale.replace('-', '_');
  if (locales.includes(defaultLocale)) {
    return defaultLocale;
  }
  const defaultLocaleWithoutRegion = defaultLocale.split('_')[0];
  if (locales.includes(defaultLocaleWithoutRegion)) {
    return defaultLocaleWithoutRegion;
  }
  return firstLocale;
})();
