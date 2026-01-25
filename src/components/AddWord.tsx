import { FC, useState } from 'react';
import { Language, VocabularyWord } from '../types';
import { translateText } from '../services/translation';
import { generateMemorizationTip, generateExampleSentence } from '../services/ai';
import { speakText } from '../services/textToSpeech';

interface AddWordProps {
  onSave: (word: VocabularyWord) => void;
}

export const AddWord: FC<AddWordProps> = ({ onSave }) => {
  const [inputLanguage, setInputLanguage] = useState<Language>('english');
  const [outputLanguage, setOutputLanguage] = useState<Language>('chinese');
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [memorizationTip, setMemorizationTip] = useState('');
  const [exampleSentence, setExampleSentence] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isGeneratingTip, setIsGeneratingTip] = useState(false);
  const [isGeneratingExample, setIsGeneratingExample] = useState(false);

  const languages: Language[] = ['chinese', 'english', 'japanese'];

  // DEBUG: Log environment variable on component mount
  console.log('DEBUG - Environment Check:');
  console.log('API Key exists:', !!import.meta.env.VITE_GEMINI_API_KEY);
  console.log('API Key length:', import.meta.env.VITE_GEMINI_API_KEY?.length || 0);
  console.log('First 10 chars:', import.meta.env.VITE_GEMINI_API_KEY?.substring(0, 10) || 'N/A');

  const handleAutoTranslate = async () => {
    if (!word.trim()) return;

    setIsTranslating(true);
    try {
      const result = await translateText(word, inputLanguage, outputLanguage);
      setTranslation(result);
    } catch (error) {
      console.error('Translation error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleGenerateTip = async () => {
    if (!word.trim()) return;

    setIsGeneratingTip(true);
    try {
      // Auto-translate if translation is not provided yet
      let currentTranslation = translation.trim();
      if (!currentTranslation) {
        currentTranslation = await translateText(word, inputLanguage, outputLanguage);
        setTranslation(currentTranslation);
      }

      const tip = await generateMemorizationTip(
        word,
        currentTranslation,
        inputLanguage,
        outputLanguage
      );
      setMemorizationTip(tip);
    } catch (error) {
      console.error('Tip generation error:', error);
    } finally {
      setIsGeneratingTip(false);
    }
  };

  const handleGenerateExample = async () => {
    if (!word.trim()) return;

    setIsGeneratingExample(true);
    try {
      const example = await generateExampleSentence(word, inputLanguage);
      setExampleSentence(example);
    } catch (error) {
      console.error('Example generation error:', error);
    } finally {
      setIsGeneratingExample(false);
    }
  };

  const handleSpeak = () => {
    if (word.trim()) {
      speakText(word, inputLanguage);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!word.trim() || !translation.trim()) {
      alert('Please fill in both word and translation');
      return;
    }

    const newWord: VocabularyWord = {
      id: crypto.randomUUID(),
      word: word.trim(),
      translation: translation.trim(),
      inputLanguage,
      outputLanguage,
      memorizationTip: memorizationTip.trim() || undefined,
      exampleSentence: exampleSentence.trim() || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    onSave(newWord);

    // Reset form
    setWord('');
    setTranslation('');
    setMemorizationTip('');
    setExampleSentence('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-xl border-2 border-gray-200 p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Word</h2>

      {/* Language Selectors */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Input Language
          </label>
          <select
            value={inputLanguage}
            onChange={(e) => setInputLanguage(e.target.value as Language)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Output Language
          </label>
          <select
            value={outputLanguage}
            onChange={(e) => setOutputLanguage(e.target.value as Language)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Word Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Word</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={word}
            onChange={(e) => setWord(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="Enter word..."
            required
          />
          <button
            type="button"
            onClick={handleSpeak}
            className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            title="Pronounce"
          >
            Speak
          </button>
        </div>
      </div>

      {/* Translation Input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Translation
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={translation}
            onChange={(e) => setTranslation(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="Enter translation..."
            required
          />
          <button
            type="button"
            onClick={handleAutoTranslate}
            disabled={isTranslating || !word.trim()}
            className="px-4 py-2 bg-white border-2 border-gray-900 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors disabled:bg-gray-100 disabled:border-gray-300 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
        </div>
      </div>

      {/* Optional: Memorization Tip */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Memorization Tip (Optional)
        </label>
        <div className="flex gap-2">
          <textarea
            value={memorizationTip}
            onChange={(e) => setMemorizationTip(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="Add a tip to help remember..."
            rows={2}
          />
          <button
            type="button"
            onClick={handleGenerateTip}
            disabled={isGeneratingTip || !word.trim()}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
            title={!word.trim() ? 'Please fill in word first' : 'Generate AI memorization tip'}
          >
            {isGeneratingTip ? 'Generating...' : 'AI Tip'}
          </button>
        </div>
      </div>

      {/* Optional: Example Sentence */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Example Sentence (Optional)
        </label>
        <div className="flex gap-2">
          <textarea
            value={exampleSentence}
            onChange={(e) => setExampleSentence(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            placeholder="Add an example sentence..."
            rows={2}
          />
          <button
            type="button"
            onClick={handleGenerateExample}
            disabled={isGeneratingExample || !word.trim()}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
            title={!word.trim() ? 'Please fill in word first' : 'Generate AI example sentence'}
          >
            {isGeneratingExample ? 'Generating...' : 'AI Example'}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200"
      >
        Save Word
      </button>
    </form>
  );
};
