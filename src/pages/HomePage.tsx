import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { cloudStorageService } from '../services/cloudStorage';
import { getDueWords } from '../services/spacedRepetition';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: FC = () => {
  const { user } = useAuth();
  const [totalWords, setTotalWords] = useState(0);
  const [dueCount, setDueCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        const [words, allProgress] = await Promise.all([
          cloudStorageService.getWords(user.uid),
          cloudStorageService.getProgress(user.uid),
        ]);

        const due = getDueWords(allProgress);

        // Count new words (no progress yet)
        const newWords = words.filter(
          (word) => !allProgress.find((p) => p.wordId === word.id)
        );

        setTotalWords(words.length);
        setDueCount(due.length + newWords.length);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  return (
    <div className="min-h-screen bg-off-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-charcoal tracking-tight">
            Memoloop
          </h1>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(140px,auto)]">

          {/* Stats - Small elegant cards at top */}
          <div className="md:col-span-1 bg-white/60 backdrop-blur-sm rounded-3xl border border-black/5 p-6 hover:bg-white/80 transition-all duration-300">
            <div className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Total</div>
            <div className="text-4xl font-bold text-charcoal">{totalWords}</div>
            <div className="text-xs text-gray-400 mt-1">words learned</div>
          </div>

          <div className="md:col-span-1 bg-white/60 backdrop-blur-sm rounded-3xl border border-black/5 p-6 hover:bg-white/80 transition-all duration-300">
            <div className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Due</div>
            <div className="text-4xl font-bold text-brand-500">{dueCount}</div>
            <div className="text-xs text-gray-400 mt-1">ready to review</div>
          </div>

          {/* Review - Hero card (larger) */}
          <Link to="/review" className="md:col-span-2 md:row-span-2">
            <div className="h-full bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl border border-brand-400/20 p-8 hover:shadow-2xl hover:shadow-brand-500/20 transition-all duration-300 cursor-pointer group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="inline-block p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">Review Words</h2>
                <p className="text-brand-50 text-sm leading-relaxed">
                  Practice with flashcards and reinforce your memory through spaced repetition
                </p>
              </div>
            </div>
          </Link>

          {/* Add New Word - Medium card */}
          <Link to="/add" className="md:col-span-2">
            <div className="h-full bg-white/60 backdrop-blur-sm rounded-3xl border border-black/5 p-8 hover:bg-white/80 hover:border-black/10 transition-all duration-300 cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-charcoal/5 rounded-xl group-hover:bg-brand-50 transition-colors duration-300">
                  <svg className="w-6 h-6 text-charcoal group-hover:text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-charcoal mb-1">Add New Word</h2>
                  <p className="text-gray-500 text-sm">Build your vocabulary with AI-powered tips and examples</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Features - Compact horizontal cards */}
          <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-black/5 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-brand-500" />
                <h4 className="font-semibold text-charcoal">Text-to-Speech</h4>
              </div>
              <p className="text-gray-500 text-sm pl-5">Perfect pronunciation with native audio</p>
            </div>

            <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-black/5 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-brand-500" />
                <h4 className="font-semibold text-charcoal">Auto Translation</h4>
              </div>
              <p className="text-gray-500 text-sm pl-5">Instant translation across languages</p>
            </div>

            <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-black/5 p-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-2 h-2 rounded-full bg-brand-500" />
                <h4 className="font-semibold text-charcoal">Spaced Repetition</h4>
              </div>
              <p className="text-gray-500 text-sm pl-5">Smart scheduling for optimal retention</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
