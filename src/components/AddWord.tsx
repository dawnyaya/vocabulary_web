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
  console.log('🔍 DEBUG - Environment Check:');
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
    if (!word.trim() || !translation.trim()) return;

    setIsGeneratingTip(true);
    try {
      const tip = await generateMemorizationTip(
        word,
        translation,
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
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Word</h2>

      {/* Language Selectors */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Input Language
          </label>
          <select
            value={inputLanguage}
            onChange={(e) => setInputLanguage(e.target.value as Language)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter word..."
            required
          />
          <button
            type="button"
            onClick={handleSpeak}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            title="Pronounce"
          >
            🔊
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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter translation..."
            required
          />
          <button
            type="button"
            onClick={handleAutoTranslate}
            disabled={isTranslating || !word.trim()}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isTranslating ? '...' : '🌐 Auto'}
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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add a tip to help remember..."
            rows={2}
          />
          <button
            type="button"
            onClick={handleGenerateTip}
            disabled={isGeneratingTip || !word.trim() || !translation.trim()}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isGeneratingTip ? '...' : '💡 AI'}
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
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Add an example sentence..."
            rows={2}
          />
          <button
            type="button"
            onClick={handleGenerateExample}
            disabled={isGeneratingExample || !word.trim()}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isGeneratingExample ? '...' : '📝 AI'}
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:shadow-lg"
      >
        Save Word
      </button>
    </form>
  );
};
