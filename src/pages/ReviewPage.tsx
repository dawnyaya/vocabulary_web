import { FC, useState, useEffect } from 'react';
import { FamiliarityLevel, WordWithProgress } from '../types';
import { storageService } from '../services/storage';
import { getDueWords, updateWordProgress } from '../services/spacedRepetition';
import { FlashCard } from '../components/FlashCard';
import { FamiliaritySelector } from '../components/FamiliaritySelector';

export const ReviewPage: FC = () => {
  const [dueWords, setDueWords] = useState<WordWithProgress[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSelector, setShowSelector] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    loadDueWords();
  }, []);

  const loadDueWords = () => {
    const words = storageService.getWords();
    const allProgress = storageService.getProgress();
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
  };

  const handleFamiliaritySelect = (level: FamiliarityLevel) => {
    const currentWord = dueWords[currentIndex];
    if (!currentWord) return;

    // Update progress
    const newProgress = updateWordProgress(
      currentWord.id,
      level,
      currentWord.progress
    );
    storageService.updateProgress(newProgress);

    // Move to next word or complete
    if (currentIndex < dueWords.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowSelector(false);
    } else {
      setIsComplete(true);
    }
  };

  const handleShowSelector = () => {
    setShowSelector(true);
  };

  const handleRestart = () => {
    loadDueWords();
    setCurrentIndex(0);
    setShowSelector(false);
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center p-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl border border-black/5 p-12 text-center max-w-md">
          <div className="inline-block p-4 bg-brand-50 rounded-2xl mb-4">
            <svg className="w-12 h-12 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-charcoal mb-4 tracking-tight">
            All Done!
          </h2>
          <p className="text-gray-500 mb-8 leading-relaxed">
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
    <div className="min-h-screen bg-off-white py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
              Progress
            </span>
            <span className="text-sm font-bold text-charcoal">
              {currentIndex + 1} / {dueWords.length}
            </span>
          </div>
          <div className="w-full bg-white/60 backdrop-blur-sm rounded-full h-2.5 border border-black/5 overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-500 to-brand-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${((currentIndex + 1) / dueWords.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Flash Card */}
        {currentWord && <FlashCard word={currentWord} />}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-center">
          {!showSelector ? (
            <button
              onClick={handleShowSelector}
              className="px-8 py-4 bg-brand-500 text-white font-semibold text-lg rounded-xl hover:bg-brand-600 transition-all duration-200 shadow-lg shadow-brand-500/20 hover:shadow-brand-500/30"
            >
              Rate Your Familiarity
            </button>
          ) : (
            <FamiliaritySelector onSelect={handleFamiliaritySelect} />
          )}
        </div>
      </div>
    </div>
  );
};
