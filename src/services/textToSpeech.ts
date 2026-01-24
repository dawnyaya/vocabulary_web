import { Language } from '../types';

// Get the appropriate language code for Web Speech API
const getVoiceLanguage = (lang: Language): string => {
  const langCodes: Record<Language, string> = {
    english: 'en-US',
    chinese: 'zh-CN',
    japanese: 'ja-JP',
  };
  return langCodes[lang];
};

// Speak text using Web Speech API
export const speakText = (text: string, language: Language): void => {
  // Check if browser supports Speech Synthesis
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported');
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = getVoiceLanguage(language);
  utterance.rate = 0.9; // Slightly slower for learning
  utterance.pitch = 1;
  utterance.volume = 1;

  // Try to find a native voice for the language
  const voices = window.speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.startsWith(utterance.lang.split('-')[0]));
  if (voice) {
    utterance.voice = voice;
  }

  window.speechSynthesis.speak(utterance);
};

// Load voices (needed for some browsers)
export const loadVoices = (): Promise<void> => {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve();
      return;
    }

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve();
      return;
    }

    window.speechSynthesis.onvoiceschanged = () => {
      resolve();
    };
  });
};
