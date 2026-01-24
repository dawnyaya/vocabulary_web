import { Language } from '../types';

// AI service for generating memorization tips and example sentences
// In production, this would call an AI API like OpenAI, Anthropic Claude, or local LLM

export const generateMemorizationTip = async (
  word: string,
  _translation: string,
  _inputLang: Language,
  outputLang: Language
): Promise<string> => {
  // Mock implementation - replace with actual AI API call
  // Example: OpenAI API
  /*
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo',
      messages: [{
        role: 'user',
        content: `Generate a memorization tip in ${outputLang} for learning the word "${word}" (${_inputLang}) which means "${_translation}"`
      }]
    })
  });
  const data = await response.json();
  return data.choices[0].message.content;
  */

  // For demo purposes, return a placeholder
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`[Memorization tip for "${word}" in ${outputLang}]`);
    }, 500);
  });
};

export const generateExampleSentence = async (
  word: string,
  inputLang: Language
): Promise<string> => {
  // Mock implementation - replace with actual AI API call
  // Similar to above but requesting example sentence in input language

  // For demo purposes, return a placeholder
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`[Example sentence with "${word}" in ${inputLang}]`);
    }, 500);
  });
};
