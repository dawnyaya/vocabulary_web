import { Language } from '../types';

// Get language name for Gemini API
const getLanguageName = (lang: Language): string => {
  const names: Record<Language, string> = {
    english: 'English',
    chinese: 'Chinese',
    japanese: 'Japanese',
  };
  return names[lang];
};

// Get API key from environment variable
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Translation service using Gemini AI for higher accuracy
export const translateText = async (
  text: string,
  fromLang: Language,
  toLang: Language
): Promise<string> => {
  try {
    const sourceLangName = getLanguageName(fromLang);
    const targetLangName = getLanguageName(toLang);

    // Check if API key is available
    if (!GEMINI_API_KEY) {
      console.warn('No Gemini API key found. Translation unavailable.');
      return `[Translation unavailable: ${text}]`;
    }

    const prompt = `Translate the following ${sourceLangName} text to ${targetLangName}.

Text: "${text}"

IMPORTANT:
- Output ONLY the translation, no explanation or additional text
- Keep it natural and contextually appropriate
- For single words, provide the most common translation

Translation:`;

    console.log('=== Translation Request ===');
    console.log(`From: ${sourceLangName} → To: ${targetLangName}`);
    console.log(`Text: "${text}"`);

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3, // Lower temperature for more consistent translations
          maxOutputTokens: 100,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini translation error:', errorData);
      throw new Error(`Translation API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      const translation = data.candidates[0].content.parts[0].text.trim()
        .replace(/^(Translation:|Translated text:)\s*/i, '')
        .replace(/^["'](.*)["']$/s, '$1') // Remove surrounding quotes
        .trim();

      console.log(`Translation result: "${translation}"`);
      return translation;
    }

    throw new Error('Unexpected API response format');
  } catch (error) {
    console.error('Translation error:', error);
    // Fallback: return original text with error message
    return `[Translation unavailable: ${text}]`;
  }
};
