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
          maxOutputTokens: 300,
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
1. A pronunciation hint or sound association to help remember how to say "${word}"
2. A simple visual or story-based memory technique
3. Keep it natural and under 40 words

IMPORTANT: Write the ENTIRE tip in ${outputLangName} language only. Do not mix languages.

Tip:`;

    const tip = await callGeminiAPI(prompt);
    console.log('💡 Raw AI tip:', tip);

    // Clean up the response
    const cleanTip = tip
      .replace(/^(Tip:|Memorization tip:|Here's a tip:)/i, '')
      .trim();

    console.log('💡 Cleaned tip:', cleanTip);
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

    const prompt = `Please generate a real-life, spoken-style sentence with "${word}" - something sounds natural. Under 30 words please.

Requirements:
- Write the sentence in ${inputLangName}
- Use everyday spoken language
- Make it natural and practical
- ONLY output the sentence, no explanation

Sentence:`;

    const sentence = await callGeminiAPI(prompt);
    console.log('📝 Raw AI sentence:', sentence);

    // Clean up the response - only remove explicit labels, not sentence content
    let cleanSentence = sentence.trim();

    // Remove common prefixes that are labels (with colon or quotes)
    cleanSentence = cleanSentence
      .replace(/^(Sentence:|Example:|Here's an example:|Here is an example:)\s*/i, '')
      .replace(/^["'](.+)["']$/s, '$1')  // Remove surrounding quotes
      .replace(/^:\s*/, '')
      .trim();

    console.log('📝 Cleaned sentence:', cleanSentence);
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
