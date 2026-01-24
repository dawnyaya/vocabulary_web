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
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-12 text-center max-w-md">
          <div className="text-6xl mb-6">🎉</div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            All Done!
          </h2>
          <p className="text-gray-600 mb-8">
            {dueWords.length === 0
              ? "You don't have any words to review right now. Come back later!"
              : 'Great job! You have completed all your reviews for today.'}
          </p>
          <button
            onClick={handleRestart}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:shadow-lg"
          >
            Review Again
          </button>
        </div>
      </div>
    );
  }

  const currentWord = dueWords[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">
              Progress
            </span>
            <span className="text-sm font-medium text-gray-700">
              {currentIndex + 1} / {dueWords.length}
            </span>
          </div>
          <div className="w-full bg-white rounded-full h-3 shadow-inner">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
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
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-lg rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:shadow-lg hover:scale-105"
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
