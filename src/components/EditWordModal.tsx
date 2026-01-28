import { FC, useState, useEffect } from 'react';
import { X, Sparkles, Volume2 } from 'lucide-react';
import { Language, VocabularyWord, Collection } from '../types';
import { generateAllContent } from '../services/ai';
import { speakText } from '../services/textToSpeech';

interface EditWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (word: VocabularyWord) => void;
  word: VocabularyWord | null;
  collections?: Collection[];
}

export const EditWordModal: FC<EditWordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  word: initialWord,
  collections = [],
}) => {
  const [inputLanguage, setInputLanguage] = useState<Language>('english');
  const [outputLanguage, setOutputLanguage] = useState<Language>('chinese');
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [memorizationTip, setMemorizationTip] = useState('');
  const [exampleSentence, setExampleSentence] = useState('');
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  const languages: Language[] = ['chinese', 'english', 'japanese'];

  // Initialize form with word data when modal opens
  useEffect(() => {
    if (initialWord) {
      setInputLanguage(initialWord.inputLanguage);
      setOutputLanguage(initialWord.outputLanguage);
      setWord(initialWord.word);
      setTranslation(initialWord.translation);
      setMemorizationTip(initialWord.memorizationTip || '');
      setExampleSentence(initialWord.exampleSentence || '');
      setSelectedCollectionId(initialWord.collectionId || '');
    }
  }, [initialWord]);

  // AI generation handler
  const handleAutoGenerate = async () => {
    if (!word.trim()) return;

    setIsGenerating(true);
    try {
      const result = await generateAllContent(word, inputLanguage, outputLanguage);
      setTranslation(result.translation);
      setMemorizationTip(result.tip);
      setExampleSentence(result.example);
    } catch (error) {
      console.error('AI generation error:', error);
      alert('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(false);
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

    if (!selectedCollectionId) {
      alert('Please select a collection');
      return;
    }

    if (!initialWord) return;

    const updatedWord: VocabularyWord = {
      ...initialWord,
      word: word.trim(),
      translation: translation.trim(),
      inputLanguage,
      outputLanguage,
      memorizationTip: memorizationTip.trim() || undefined,
      exampleSentence: exampleSentence.trim() || undefined,
      collectionId: selectedCollectionId,
      updatedAt: new Date(),
    };

    onSave(updatedWord);
    onClose();
  };

  if (!isOpen || !initialWord) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="text-xl font-bold text-gray-900">Edit Word</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Language Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Input Language
              </label>
              <select
                value={inputLanguage}
                onChange={(e) => setInputLanguage(e.target.value as Language)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Output Language
              </label>
              <select
                value={outputLanguage}
                onChange={(e) => setOutputLanguage(e.target.value as Language)}
                className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Word <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                placeholder="Enter a word..."
                className="flex-1 px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
                required
              />
              <button
                type="button"
                onClick={handleSpeak}
                className="p-3 border border-gray-200 hover:bg-gray-50 rounded-2xl transition-colors"
                title="Speak word"
              >
                <Volume2 className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Translation Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Translation <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              placeholder="Enter translation..."
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              required
            />
          </div>

          {/* AI Generate Button */}
          <button
            type="button"
            onClick={handleAutoGenerate}
            disabled={isGenerating || !word.trim()}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5" />
            {isGenerating ? 'Generating...' : 'AI Auto-Fill'}
          </button>

          {/* Memorization Tip */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Memorization Tip
            </label>
            <textarea
              value={memorizationTip}
              onChange={(e) => setMemorizationTip(e.target.value)}
              placeholder="Tips to help remember this word..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Example Sentence */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Example Sentence
            </label>
            <textarea
              value={exampleSentence}
              onChange={(e) => setExampleSentence(e.target.value)}
              placeholder="A sentence using this word..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Collection Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Collection <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedCollectionId}
              onChange={(e) => setSelectedCollectionId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              required
            >
              {collections.length === 0 && (
                <option value="">Loading...</option>
              )}
              {collections.map((collection) => (
                <option key={collection.id} value={collection.id}>
                  {collection.name}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!word.trim() || !translation.trim() || !selectedCollectionId}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-brand-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
