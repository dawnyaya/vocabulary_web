import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { storageService } from '../services/storage';
import { getDueWords } from '../services/spacedRepetition';

export const HomePage: FC = () => {
  const [totalWords, setTotalWords] = useState(0);
  const [dueCount, setDueCount] = useState(0);

  useEffect(() => {
    const words = storageService.getWords();
    const allProgress = storageService.getProgress();
    const due = getDueWords(allProgress);

    // Count new words (no progress yet)
    const newWords = words.filter(
      (word) => !allProgress.find((p) => p.wordId === word.id)
    );

    setTotalWords(words.length);
    setDueCount(due.length + newWords.length);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-800 mb-4">
            📚 Vocabulary Flashcards
          </h1>
          <p className="text-xl text-gray-600">
            Learn and memorize vocabulary with spaced repetition
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {totalWords}
            </div>
            <div className="text-gray-600 font-medium">Total Words</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-5xl font-bold text-purple-600 mb-2">
              {dueCount}
            </div>
            <div className="text-gray-600 font-medium">Due for Review</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/add">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg p-8 text-white hover:shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer">
              <div className="text-5xl mb-4">➕</div>
              <h2 className="text-2xl font-bold mb-2">Add New Word</h2>
              <p className="text-blue-100">
                Add vocabulary words with translations and examples
              </p>
            </div>
          </Link>

          <Link to="/review">
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg p-8 text-white hover:shadow-2xl hover:scale-105 transition-all duration-200 cursor-pointer">
              <div className="text-5xl mb-4">📖</div>
              <h2 className="text-2xl font-bold mb-2">Review Words</h2>
              <p className="text-purple-100">
                Practice with flashcards and track your progress
              </p>
            </div>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl mb-3">🔊</div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Text-to-Speech
              </h4>
              <p className="text-gray-600 text-sm">
                Hear pronunciation of words
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🌐</div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Auto Translation
              </h4>
              <p className="text-gray-600 text-sm">
                Automatic translation support
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🧠</div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Spaced Repetition
              </h4>
              <p className="text-gray-600 text-sm">
                Smart review scheduling
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
