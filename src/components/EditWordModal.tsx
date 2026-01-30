import { FC, useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
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

  const wordInputRef = useRef<HTMLInputElement>(null);
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
        <div className="sticky top-0 bg-white border-b border-gray-100 px-8 py-6 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="text-3xl font-bold text-charcoal tracking-tight">Edit Word</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          {/* Language Selectors */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Input Language
              </label>
              <select
                value={inputLanguage}
                onChange={(e) => setInputLanguage(e.target.value as Language)}
                className="w-full px-4 py-2.5 bg-white border border-black/10 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
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
                className="w-full px-4 py-2.5 bg-white border border-black/10 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
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
                ref={wordInputRef}
                type="text"
                value={word}
                onChange={(e) => setWord(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-white border border-black/10 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
                placeholder="Enter word..."
                required
              />
              <button
                type="button"
                onClick={handleSpeak}
                className="px-5 py-2.5 bg-charcoal text-white rounded-xl hover:bg-charcoal/90 transition-all duration-200 font-medium"
                title="Pronounce"
              >
                Speak
              </button>
            </div>
          </div>

          {/* AI Auto-Generate Button */}
          <div className="mb-8">
            <button
              type="button"
              onClick={handleAutoGenerate}
              disabled={isGenerating || !word.trim()}
              className="w-full py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-bold rounded-xl hover:shadow-xl hover:shadow-brand-500/30 transition-all duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none text-lg"
            >
              {isGenerating ? (
                <div className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Generating...</span>
                </div>
              ) : (
                '✨ AI Auto-Generate All'
              )}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Automatically generate translation, memorization tip, and example sentence
            </p>
          </div>

          {/* Translation Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Translation
            </label>
            <input
              type="text"
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-black/10 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
              placeholder="Translation will be auto-generated..."
              required
            />
          </div>

          {/* Optional: Memorization Tip */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Memorization Tip <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={memorizationTip}
              onChange={(e) => setMemorizationTip(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-black/10 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
              placeholder="Memorization tip will be auto-generated..."
              rows={3}
            />
          </div>

          {/* Optional: Example Sentence */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Example Sentence <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={exampleSentence}
              onChange={(e) => setExampleSentence(e.target.value)}
              className="w-full px-4 py-2.5 bg-white border border-black/10 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
              placeholder="Example sentence will be auto-generated..."
              rows={2}
            />
          </div>

          {/* Submit Section with Collection Selector */}
          <div className="flex gap-3">
            {/* Collection Selector */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                Save to <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedCollectionId}
                onChange={(e) => setSelectedCollectionId(e.target.value)}
                className="w-full px-4 py-3.5 bg-white border border-black/10 rounded-xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 font-medium text-gray-700"
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

            {/* Save Button */}
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-600 mb-2">
                &nbsp;
              </label>
              <button
                type="submit"
                disabled={!selectedCollectionId}
                className="w-full py-3.5 bg-charcoal text-white font-semibold rounded-xl hover:bg-charcoal/90 transition-all duration-200 shadow-lg shadow-charcoal/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
