import { FC, useState, useEffect } from 'react';
import { cloudStorageService } from '../services/cloudStorage';
import { useAuth } from '../contexts/AuthContext';
import { VocabularyWord } from '../types';
import { Trash2, Volume2 } from 'lucide-react';
import { speakText } from '../services/textToSpeech';

export const CollectionPage: FC = () => {
  const { user } = useAuth();
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    loadWords();
  }, [user]);

  const loadWords = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const allWords = await cloudStorageService.getWords(user.uid);
      // Sort by most recent first
      allWords.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setWords(allWords);
    } catch (error) {
      console.error('Error loading words:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (wordId: string) => {
    if (!user) return;

    if (!confirm('Are you sure you want to delete this word?')) return;

    try {
      await cloudStorageService.deleteWord(user.uid, wordId);
      setWords(words.filter(w => w.id !== wordId));
    } catch (error) {
      console.error('Error deleting word:', error);
      alert('Failed to delete word. Please try again.');
    }
  };

  const handleSpeak = (word: VocabularyWord) => {
    speakText(word.word, word.inputLanguage);
  };

  // Filter words
  const filteredWords = words.filter(word => {
    const matchesSearch =
      word.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
      word.translation.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLanguage =
      selectedLanguage === 'all' ||
      word.inputLanguage === selectedLanguage ||
      word.outputLanguage === selectedLanguage;

    return matchesSearch && matchesLanguage;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 bg-brand-50 rounded-2xl mb-4">
            <svg className="animate-spin h-12 w-12 text-brand-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-8 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-charcoal mb-2 tracking-tight">Collection</h1>
          <p className="text-gray-500">
            {words.length} {words.length === 1 ? 'word' : 'words'} in your vocabulary
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Search words..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 bg-white border border-black/10 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
          />
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="px-4 py-3 bg-white border border-black/10 rounded-2xl focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Languages</option>
            <option value="english">English</option>
            <option value="chinese">Chinese</option>
            <option value="japanese">Japanese</option>
          </select>
        </div>

        {/* Words Grid */}
        {filteredWords.length === 0 ? (
          <div className="text-center py-20">
            <div className="inline-block p-4 bg-gray-100 rounded-2xl mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">
              {searchQuery ? 'No words match your search' : 'No words yet. Start adding some!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredWords.map((word) => (
              <div
                key={word.id}
                className="bg-white rounded-2xl border border-black/5 p-5 hover:border-brand-200 transition-all duration-200 group"
              >
                {/* Word & Translation */}
                <div className="mb-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-charcoal">{word.word}</h3>
                        <button
                          onClick={() => handleSpeak(word)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        >
                          <Volume2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                      <p className="text-gray-600">{word.translation}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(word.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>

                  {/* Language Tags */}
                  <div className="flex gap-2 text-xs">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium">
                      {word.inputLanguage}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="px-2 py-1 bg-brand-50 text-brand-700 rounded-lg font-medium">
                      {word.outputLanguage}
                    </span>
                  </div>
                </div>

                {/* Expandable Details */}
                {(word.memorizationTip || word.exampleSentence) && (
                  <div>
                    <button
                      onClick={() => setExpandedId(expandedId === word.id ? null : word.id)}
                      className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                    >
                      {expandedId === word.id ? 'Show less' : 'Show details'}
                    </button>

                    {expandedId === word.id && (
                      <div className="mt-3 space-y-2">
                        {word.memorizationTip && (
                          <div className="bg-blue-50 rounded-xl p-3 border border-blue-100">
                            <div className="text-xs font-semibold text-blue-700 mb-1">TIP</div>
                            <p className="text-xs text-gray-700">{word.memorizationTip}</p>
                          </div>
                        )}
                        {word.exampleSentence && (
                          <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                            <div className="text-xs font-semibold text-slate-600 mb-1">EXAMPLE</div>
                            <p className="text-xs text-gray-700 italic">{word.exampleSentence}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Date */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-400">
                    Added {new Date(word.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
