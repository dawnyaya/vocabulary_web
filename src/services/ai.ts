import { Language } from '../types';

// Get API key from environment variable (Vite uses import.meta.env)
const HUGGINGFACE_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';

// Helper function to call HuggingFace Inference API
const callHuggingFaceAPI = async (prompt: string): Promise<string> => {
  try {
    // Using Mistral-7B-Instruct model (free on HuggingFace)
    const response = await fetch(
      'https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(HUGGINGFACE_API_KEY && { Authorization: `Bearer ${HUGGINGFACE_API_KEY}` }),
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 100,
            temperature: 0.7,
            return_full_text: false,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data[0]?.generated_text) {
      return data[0].generated_text.trim();
    }

    throw new Error('Unexpected API response format');
  } catch (error) {
    console.error('HuggingFace API error:', error);
    throw error;
  }
};

// AI service for generating memorization tips and example sentences
export const generateMemorizationTip = async (
  word: string,
  translation: string,
  inputLang: Language,
  outputLang: Language
): Promise<string> => {
  try {
    const prompt = `Generate a short memorization tip in ${outputLang} language to help remember the word "${word}" (${inputLang}) which means "${translation}". Keep it under 50 words and practical.

Tip:`;

    const tip = await callHuggingFaceAPI(prompt);
    return tip || `Remember: "${word}" means "${translation}"`;
  } catch (error) {
    console.error('Error generating memorization tip:', error);
    // Fallback to a simple tip
    return `💡 Try to associate "${word}" with "${translation}" through visualization or create a memorable story.`;
  }
};

export const generateExampleSentence = async (
  word: string,
  inputLang: Language
): Promise<string> => {
  try {
    const prompt = `Create a simple example sentence in ${inputLang} language using the word "${word}". Keep it short and natural.

Sentence:`;

    const sentence = await callHuggingFaceAPI(prompt);
    return sentence || `Example with "${word}" coming soon.`;
  } catch (error) {
    console.error('Error generating example sentence:', error);
    // Fallback to a simple sentence
    return `This is an example sentence with "${word}".`;
  }
};
