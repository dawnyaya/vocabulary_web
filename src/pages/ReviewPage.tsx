import { FC, useState, useEffect } from 'react';
import { WordWithProgress } from '../types';
import { cloudStorageService } from '../services/cloudStorage';
import { getDueWords, updateWordProgress } from '../services/spacedRepetition';
import { useAuth } from '../contexts/AuthContext';
import { FlashCard } from '../components/FlashCard';

type DifficultyLevel = 'again' | 'good' | 'easy';

export const ReviewPage: FC = () => {
  const { user } = useAuth();
  const [dueWords, setDueWords] = useState<WordWithProgress[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDueWords();
  }, [user]);

  const loadDueWords = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [words, allProgress] = await Promise.all([
        cloudStorageService.getWords(user.uid),
        cloudStorageService.getProgress(user.uid),
      ]);

      const dueProgress = getDueWords(allProgress);

      // Get words that are due for review
      const wordsToReview = words
        .filter((word) => {
          const progress = dueProgress.find((p) => p.wordId === word.id);
          return progress !== undefined;
        })
        .map((word) => ({
          ...word,
          progress: allProgress.find((p) => p.wordId === word.id),
        }));

      // Also include new words (no progress yet)
      const newWords = words
        .filter((word) => !allProgress.find((p) => p.wordId === word.id))
        .map((word) => ({ ...word, progress: undefined }));

      const allDueWords = [...wordsToReview, ...newWords];
      setDueWords(allDueWords);
      setIsComplete(allDueWords.length === 0);
    } catch (error) {
      console.error('Error loading due words:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDifficultySelect = async (difficulty: DifficultyLevel) => {
    if (!user) return;

    const currentWord = dueWords[currentIndex];
    if (!currentWord) return;

    // Map difficulty to familiarity level for existing progress system
    const familiarityMap = {
      'again': 'not-familiar',
      'good': 'little-familiar',
      'easy': 'very-familiar',
    } as const;

    // Update progress
    const newProgress = updateWordProgress(
      currentWord.id,
      familiarityMap[difficulty],
      currentWord.progress
    );

    try {
      await cloudStorageService.updateProgress(user.uid, newProgress);

      // Move to next word or complete
      if (currentIndex < dueWords.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsRevealed(false);
      } else {
        setIsComplete(true);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      alert('Failed to save progress. Please try again.');
    }
  };

  const handleReveal = () => {
    setIsRevealed(true);
  };

  const handleRestart = () => {
    loadDueWords();
    setCurrentIndex(0);
    setIsRevealed(false);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-md">
          <div className="inline-block p-4 bg-brand-50 rounded-2xl mb-4">
            <svg className="w-12 h-12 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">
            All Done!
          </h2>
          <p className="text-gray-600 mb-8 leading-relaxed">
            {dueWords.length === 0
              ? "You don't have any words to review right now. Come back later!"
              : 'Great job! You have completed all your reviews for today.'}
          </p>
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-brand-500 text-white font-semibold rounded-xl hover:bg-brand-600 transition-all duration-200 shadow-lg shadow-brand-500/20"
          >
            Review Again
          </button>
        </div>
      </div>
    );
  }

  const currentWord = dueWords[currentIndex];

  return (
    <div className="min-h-screen bg-off-white py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-end mb-2">
            <span className="text-xs font-semibold text-gray-500">
              {currentIndex + 1} / {dueWords.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-500 to-brand-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentIndex + 1) / dueWords.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Flash Card */}
        {currentWord && (
          <FlashCard
            word={currentWord}
            onReveal={handleReveal}
            isRevealed={isRevealed}
          />
        )}

        {/* Assessment Buttons - Only show when revealed */}
        {isRevealed && (
          <div className="mt-8 max-w-[500px] mx-auto">
            <div className="text-xs font-semibold text-gray-500 text-center mb-3 uppercase tracking-wider">
              How well did you know this?
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => handleDifficultySelect('again')}
                className="py-4 px-6 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-2xl transition-all duration-200 border border-slate-200 hover:border-slate-300"
              >
                <div className="text-lg mb-1">Again</div>
                <div className="text-xs font-normal text-slate-500">Tomorrow</div>
              </button>
              <button
                onClick={() => handleDifficultySelect('good')}
                className="py-4 px-6 bg-brand-500 hover:bg-brand-600 text-white font-semibold rounded-2xl transition-all duration-200 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30"
              >
                <div className="text-lg mb-1">Good</div>
                <div className="text-xs font-normal text-brand-50">2 days</div>
              </button>
              <button
                onClick={() => handleDifficultySelect('easy')}
                className="py-4 px-6 bg-brand-50 hover:bg-brand-100 text-brand-700 font-semibold rounded-2xl transition-all duration-200 border border-brand-200 hover:border-brand-300"
              >
                <div className="text-lg mb-1">Easy</div>
                <div className="text-xs font-normal text-brand-600">3+ days</div>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
