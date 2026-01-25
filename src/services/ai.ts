import { Language } from '../types';

// Get API key from environment variable (Vite uses import.meta.env)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Helper function to call Google Gemini API (free tier available)
const callGeminiAPI = async (prompt: string): Promise<string> => {
  try {
    // Check if API key is available
    if (!GEMINI_API_KEY) {
      console.warn('⚠️ No Gemini API key found. Please add VITE_GEMINI_API_KEY to your .env file');
      console.warn('Get a free key at: https://aistudio.google.com/app/apikey');
      throw new Error('API key not configured');
    }

    // Use v1beta API with gemini-2.5-flash model
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
          temperature: 0.7,
          maxOutputTokens: 150,
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error response:', errorData);
      throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Gemini API response:', data);

    if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
      return data.candidates[0].content.parts[0].text.trim();
    }

    throw new Error('Unexpected API response format');
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};

// Get language name in English for better prompts
const getLanguageName = (lang: Language): string => {
  const names: Record<Language, string> = {
    english: 'English',
    chinese: 'Chinese',
    japanese: 'Japanese',
  };
  return names[lang];
};

// AI service for generating memorization tips and example sentences
export const generateMemorizationTip = async (
  word: string,
  translation: string,
  inputLang: Language,
  outputLang: Language
): Promise<string> => {
  try {
    const inputLangName = getLanguageName(inputLang);
    const outputLangName = getLanguageName(outputLang);

    const prompt = `Create a memorization tip in ${outputLangName} to help remember the ${inputLangName} word "${word}" which means "${translation}".

Include:
1. A pronunciation hint or sound association
2. A visual or story-based memory technique
3. Keep it under 40 words

Respond ONLY with the tip in ${outputLangName}, no extra explanation.`;

    const tip = await callGeminiAPI(prompt);

    // Clean up the response
    const cleanTip = tip
      .replace(/^(Tip:|Memorization tip:|Here's a tip:)/i, '')
      .trim();

    return cleanTip || `💡 Associate "${word}" with "${translation}" through visualization.`;
  } catch (error) {
    console.error('Error generating memorization tip:', error);

    // Smart fallback based on languages
    if (inputLang === 'chinese' && outputLang === 'english') {
      return `💡 Try to remember the pronunciation and meaning of "${word}" by associating it with "${translation}". Practice writing the character to help memorize it.`;
    } else if (inputLang === 'english' && outputLang === 'chinese') {
      return `💡 记住"${word}"的意思是"${translation}"，可以通过联想和重复来加深记忆。`;
    } else if (inputLang === 'japanese') {
      return `💡 Try to remember "${word}" means "${translation}" by associating the sounds or creating a visual memory.`;
    }

    return `💡 Practice "${word}" = "${translation}" repeatedly. Create a mental image or story to connect them.`;
  }
};

export const generateExampleSentence = async (
  word: string,
  inputLang: Language
): Promise<string> => {
  try {
    const inputLangName = getLanguageName(inputLang);

    const prompt = `Please generate a real-life, spoken-style sentence with "${word}" - something sounds natural and a little bit impressive. Under 30 words please.

Requirements:
- Write the sentence in ${inputLangName}
- Use everyday spoken language
- Make it memorable and engaging
- ONLY output the sentence, no explanation

Sentence:`;

    const sentence = await callGeminiAPI(prompt);

    // Clean up the response
    const cleanSentence = sentence
      .replace(/^(Sentence:|Example:|Here's an example:|Here is|This is)/i, '')
      .replace(/^["']|["']$/g, '')
      .replace(/^:\s*/, '')
      .trim();

    return cleanSentence || `Example with "${word}" (generated)`;
  } catch (error) {
    console.error('Error generating example sentence:', error);

    // Language-specific fallbacks
    if (inputLang === 'chinese') {
      return `我喜欢用"${word}"这个词。`;
    } else if (inputLang === 'japanese') {
      return `「${word}」を使います。`;
    } else {
      return `I use the word "${word}" often.`;
    }
  }
};
