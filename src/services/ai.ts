import { Language } from '../types';
import { translateText } from './translation';

// Get API key from environment variable (Vite uses import.meta.env)
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

// Helper function to call Google Gemini API (free tier available)
const callGeminiAPI = async (prompt: string): Promise<string> => {
  try {
    // Check if API key is available
    if (!GEMINI_API_KEY) {
      console.warn('No Gemini API key found. Please add VITE_GEMINI_API_KEY to your .env file');
      console.warn('Get a free key at: https://aistudio.google.com/app/apikey');
      throw new Error('API key not configured');
    }

    console.log('=== Sending to Gemini API ===');
    console.log('Prompt:', prompt);
    console.log('===========================');

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
          maxOutputTokens: 1000, // Increased to handle longer responses
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error response:', errorData);
      throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('=== Gemini API Full Response ===');
    console.log('Full data:', JSON.stringify(data, null, 2));
    console.log('Finish reason:', data.candidates?.[0]?.finishReason);
    console.log('================================');

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

    const prompt = `Generate a memorization tip in ${outputLangName} for the ${inputLangName} word "${word}" (meaning: "${translation}").

Include a pronunciation hint and a visual/story memory technique. Keep it under 50 words, natural and conversational.

Write ONLY in ${outputLangName}. Output the tip directly without any prefix.`;

    const tip = await callGeminiAPI(prompt);
    console.log('=== RAW TIP ===');
    console.log('Length:', tip.length);
    console.log('Content:', tip);
    console.log('===============');

    // Clean up the response - remove common prefixes but keep the content
    const cleanTip = tip
      .replace(/^(Tip:|Memorization tip:|Here's a tip:|Here is a tip:)\s*/i, '')
      .replace(/^["'](.*)["']$/s, '$1') // Remove surrounding quotes
      .trim();

    console.log('=== CLEANED TIP ===');
    console.log('Length:', cleanTip.length);
    console.log('Content:', cleanTip);
    console.log('===================');

    return cleanTip || `Associate "${word}" with "${translation}" through visualization.`;
  } catch (error) {
    console.error('Error generating memorization tip:', error);

    // Smart fallback based on languages
    if (inputLang === 'chinese' && outputLang === 'english') {
      return `Try to remember the pronunciation and meaning of "${word}" by associating it with "${translation}". Practice writing the character to help memorize it.`;
    } else if (inputLang === 'english' && outputLang === 'chinese') {
      return `记住"${word}"的意思是"${translation}"，可以通过联想和重复来加深记忆。`;
    } else if (inputLang === 'japanese') {
      return `Try to remember "${word}" means "${translation}" by associating the sounds or creating a visual memory.`;
    }

    return `Practice "${word}" = "${translation}" repeatedly. Create a mental image or story to connect them.`;
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
    console.log('Raw AI sentence:', sentence);

    // Clean up the response - only remove explicit labels, not sentence content
    let cleanSentence = sentence.trim();

    // Remove common prefixes that are labels (with colon or quotes)
    cleanSentence = cleanSentence
      .replace(/^(Sentence:|Example:|Here's an example:|Here is an example:)\s*/i, '')
      .replace(/^["'](.+)["']$/s, '$1')  // Remove surrounding quotes
      .replace(/^:\s*/, '')
      .trim();

    console.log('Cleaned sentence:', cleanSentence);
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

// All-in-one generation: translation, tip, and example in a single API call
export const generateAllContent = async (
  word: string,
  inputLang: Language,
  outputLang: Language
): Promise<{ translation: string; tip: string; example: string }> => {
  try {
    const inputLangName = getLanguageName(inputLang);
    const outputLangName = getLanguageName(outputLang);

    const prompt = `You are a vocabulary learning assistant. Given a word in ${inputLangName}, provide:
1. Translation to ${outputLangName}
2. A memorization tip in ${outputLangName} (include pronunciation hint and visual/story technique, under 50 words)
3. An example sentence in ${inputLangName} (natural spoken style, under 30 words)

Word: "${word}"

IMPORTANT: Return ONLY a valid JSON object with this exact structure:
{
  "translation": "the ${outputLangName} translation",
  "tip": "memorization tip in ${outputLangName}",
  "example": "example sentence in ${inputLangName}"
}

Do not include any text before or after the JSON. Output pure JSON only.`;

    console.log('=== All-in-One Generation Request ===');
    console.log(`Word: "${word}"`);
    console.log(`${inputLangName} → ${outputLangName}`);
    console.log('======================================');

    const response = await callGeminiAPI(prompt);
    console.log('=== Raw Response ===');
    console.log(response);
    console.log('====================');

    // Clean the response - remove markdown code blocks if present
    let cleanedResponse = response.trim();

    // Remove markdown JSON code blocks (more aggressive cleaning)
    cleanedResponse = cleanedResponse
      .replace(/^```json\s*/im, '')
      .replace(/^```\s*/im, '')
      .replace(/\s*```$/im, '')
      .replace(/^.*?({[\s\S]*}).*$/m, '$1') // Extract JSON object if wrapped in text
      .trim();

    console.log('=== Cleaned Response ===');
    console.log(cleanedResponse);
    console.log('========================');

    // Parse JSON
    let parsed;
    try {
      parsed = JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError);
      console.error('Failed to parse:', cleanedResponse);
      throw new Error(`Failed to parse JSON response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }

    // Validate structure
    if (!parsed.translation || !parsed.tip || !parsed.example) {
      throw new Error('Invalid JSON structure from API');
    }

    console.log('=== Parsed Result ===');
    console.log('Translation:', parsed.translation);
    console.log('Tip:', parsed.tip);
    console.log('Example:', parsed.example);
    console.log('=====================');

    return {
      translation: parsed.translation.trim(),
      tip: parsed.tip.trim(),
      example: parsed.example.trim(),
    };
  } catch (error) {
    console.error('Error in all-in-one generation:', error);

    // Fallback: use individual functions
    console.log('Falling back to individual API calls...');

    try {
      const [translation, tip, example] = await Promise.all([
        translateText(word, inputLang, outputLang),
        generateMemorizationTip(word, word, inputLang, outputLang).catch(() => 'Memory tip unavailable'),
        generateExampleSentence(word, inputLang).catch(() => 'Example unavailable'),
      ]);

      return { translation, tip, example };
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      return {
        translation: `[Translation unavailable]`,
        tip: `Associate "${word}" with its meaning through repetition.`,
        example: `Example with "${word}".`,
      };
    }
  }
};
