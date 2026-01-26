import { FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { cloudStorageService } from '../services/cloudStorage';
import { useAuth } from '../contexts/AuthContext';
import { VocabularyWord, Collection } from '../types';
import { Trash2, Volume2, ChevronRight } from 'lucide-react';
import { speakText } from '../services/textToSpeech';
import { motion, AnimatePresence } from 'framer-motion';

export const CollectionPage: FC = () => {
  const { user } = useAuth();
  const { collectionId } = useParams<{ collectionId: string }>();
  const navigate = useNavigate();
  const [words, setWords] = useState<VocabularyWord[]>([]);
  const [allCollections, setAllCollections] = useState<Collection[]>([]);
  const [currentCollection, setCurrentCollection] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);
  const [draggedWord, setDraggedWord] = useState<VocabularyWord | null>(null);
  const [dropTargetCollection, setDropTargetCollection] = useState<string | null>(null);

  // Auto-show sidebar on first load
  useEffect(() => {
    const hasSeenSidebar = localStorage.getItem('hasSeenCollectionSidebar');
    if (!hasSeenSidebar) {
      setIsSidebarHovered(true);
      setTimeout(() => {
        setIsSidebarHovered(false);
        localStorage.setItem('hasSeenCollectionSidebar', 'true');
      }, 2500);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [user, collectionId]);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Load all collections first
      const collections = await cloudStorageService.getCollections(user.uid);
      setAllCollections(collections);

      let allWords: VocabularyWord[];

      if (collectionId) {
        // Load specific collection and its words
        const collectionWords = await cloudStorageService.getWordsByCollection(user.uid, collectionId);
        const foundCollection = collections.find(c => c.id === collectionId);
        setCurrentCollection(foundCollection || null);
        allWords = collectionWords;
      } else {
        // Load all words
        allWords = await cloudStorageService.getWords(user.uid);
        setCurrentCollection(null);
      }

      // Sort by most recent first
      allWords.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setWords(allWords);
    } catch (error) {
      console.error('Error loading words:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCollectionClick = (id: string) => {
    setAnimationKey(prev => prev + 1); // Trigger animation
    if (id === 'all') {
      navigate('/collection');
    } else {
      navigate(`/collection/${id}`);
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

  // Drag and drop handlers
  const handleDragStart = (word: VocabularyWord) => {
    setDraggedWord(word);
    setIsSidebarHovered(true); // Show sidebar when dragging starts
  };

  const handleDragEnd = () => {
    setDraggedWord(null);
    setDropTargetCollection(null);
  };

  const handleDragOver = (e: React.DragEvent, collectionId: string | null) => {
    e.preventDefault();
    setDropTargetCollection(collectionId);
  };

  const handleDragLeave = () => {
    setDropTargetCollection(null);
  };

  const handleDrop = async (e: React.DragEvent, targetCollectionId: string | null) => {
    e.preventDefault();

    if (!draggedWord || !user || !targetCollectionId) return;

    // Don't do anything if dropping on the same collection
    if (draggedWord.collectionId === targetCollectionId) {
      setDraggedWord(null);
      setDropTargetCollection(null);
      return;
    }

    try {
      // Update word's collection
      const updatedWord = {
        ...draggedWord,
        collectionId: targetCollectionId,
        updatedAt: new Date(),
      };

      await cloudStorageService.updateWord(user.uid, updatedWord);

      // Update local state
      setWords(words.map(w => w.id === updatedWord.id ? updatedWord : w));

      // Show success feedback
      const collectionName = allCollections.find(c => c.id === targetCollectionId)?.name || 'Collection';

      // Simple toast notification (you can enhance this later)
      console.log(`Moved "${draggedWord.word}" to ${collectionName}`);
    } catch (error) {
      console.error('Error moving word:', error);
      alert('Failed to move word. Please try again.');
    } finally {
      setDraggedWord(null);
      setDropTargetCollection(null);
    }
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
    <div className="min-h-screen bg-gradient-to-br from-off-white via-blue-50/30 to-purple-50/20">
      {/* Sidebar */}
      <div
        className="fixed left-0 top-0 h-full z-40"
        onMouseEnter={() => setIsSidebarHovered(true)}
        onMouseLeave={() => setIsSidebarHovered(false)}
      >
        {/* Hover trigger area */}
        <div className="absolute left-0 top-0 w-4 h-full" />

        {/* Sidebar content */}
        <motion.div
          initial={{ x: '-80%' }}
          animate={{ x: isSidebarHovered ? 0 : '-80%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="h-full w-64 bg-white/50 backdrop-blur-xl border-r border-white/20 shadow-2xl shadow-black/5 relative"
          style={{
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        >
          {/* Visible edge hint when collapsed */}
          {!isSidebarHovered && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full">
              <div
                className="bg-brand-500/80 text-white px-2 py-4 rounded-r-lg text-xs font-semibold shadow-lg flex items-center gap-1"
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                }}
              >
                <ChevronRight className="w-3 h-3" />
                <span style={{ writingMode: 'vertical-rl' }} className="text-[10px] tracking-wider">
                  COLLECTIONS
                </span>
              </div>
            </div>
          )}

          <div className="p-6 h-full overflow-y-auto">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">
              Collections
            </h3>

            {/* All Words Option - View only, not a drop target */}
            <div className="mb-2">
              <button
                onClick={() => handleCollectionClick('all')}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                  !collectionId
                    ? 'bg-brand-500/90 text-white shadow-lg backdrop-blur-sm'
                    : 'hover:bg-white/40 text-gray-700'
                }`}
              >
              <div className="flex items-center gap-3">
                <span className="text-2xl">📝</span>
                <div className="flex-1">
                  <div className="font-semibold">All Words</div>
                  <div className={`text-xs ${!collectionId ? 'text-white/80' : 'text-gray-500'}`}>
                    {words.length} total
                  </div>
                </div>
                {!collectionId && <ChevronRight className="w-5 h-5" />}
              </div>
            </button>
            </div>

            {/* Collections List */}
            <div className="space-y-2">
              {allCollections.map((col) => (
                <div
                  key={col.id}
                  onDragOver={(e) => handleDragOver(e, col.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col.id)}
                >
                  <button
                    onClick={() => handleCollectionClick(col.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                      dropTargetCollection === col.id && draggedWord
                        ? 'bg-green-500/90 text-white shadow-lg ring-2 ring-green-400'
                        : collectionId === col.id
                        ? 'bg-brand-500/90 text-white shadow-lg backdrop-blur-sm'
                        : 'hover:bg-white/40 text-gray-700'
                    }`}
                  >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{col.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{col.name}</div>
                    </div>
                    {collectionId === col.id && <ChevronRight className="w-5 h-5" />}
                  </div>
                </button>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="ml-0 md:ml-12 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          {currentCollection ? (
            <div className="mb-8">
              <div className={`${currentCollection.gradient} rounded-3xl p-8 mb-6`}>
                <div className="flex items-center gap-4">
                  <div className="text-6xl">{currentCollection.emoji}</div>
                  <div>
                    <h1 className="text-4xl font-bold text-gray-800 mb-1 tracking-tight">
                      {currentCollection.name}
                    </h1>
                    <p className="text-gray-600">
                      {words.length} {words.length === 1 ? 'word' : 'words'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-charcoal mb-2 tracking-tight">All Words</h1>
              <p className="text-gray-500">
                {words.length} {words.length === 1 ? 'word' : 'words'} in your vocabulary
              </p>
            </div>
          )}

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

        {/* Words Grid with Animation */}
        {filteredWords.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="inline-block p-4 bg-gray-100 rounded-2xl mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">
              {searchQuery ? 'No words match your search' : 'No words yet. Start adding some!'}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key={animationKey}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="wait">
              {filteredWords.map((word, index) => (
                <motion.div
                  key={word.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.05,
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  draggable
                  onDragStart={() => handleDragStart(word)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white rounded-2xl border border-black/5 p-5 hover:border-brand-200 transition-all duration-200 group cursor-grab active:cursor-grabbing ${
                    draggedWord?.id === word.id ? 'opacity-50 scale-95' : ''
                  }`}
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
              </motion.div>
            ))}
            </AnimatePresence>
          </motion.div>
        )}
        </div>
      </div>
    </div>
  );
};
