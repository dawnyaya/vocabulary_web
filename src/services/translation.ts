import { Language } from '../types';

// Get language code for APIs
export const getLanguageCode = (lang: Language): string => {
  const codes: Record<Language, string> = {
    english: 'en',
    chinese: 'zh-CN',
    japanese: 'ja',
  };
  return codes[lang];
};

// Translation service using MyMemory Translation API (free, no API key required)
export const translateText = async (
  text: string,
  fromLang: Language,
  toLang: Language
): Promise<string> => {
  try {
    const sourceLang = getLanguageCode(fromLang);
    const targetLang = getLanguageCode(toLang);

    // MyMemory Translation API - free and no API key required
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
      text
    )}&langpair=${sourceLang}|${targetLang}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const data = await response.json();

    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    } else {
      throw new Error('Translation not available');
    }
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback: return original text with error message
    return `[Translation unavailable: ${text}]`;
  }
};
