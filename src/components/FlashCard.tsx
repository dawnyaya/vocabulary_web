import { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, RefreshCw } from 'lucide-react';
import { VocabularyWord } from '../types';
import { speakText } from '../services/textToSpeech';

interface FlashCardProps {
  word: VocabularyWord;
  onReveal?: () => void;
  isRevealed?: boolean;
}

export const FlashCard: FC<FlashCardProps> = ({ word, onReveal, isRevealed = false }) => {
  const [revealed, setRevealed] = useState(isRevealed);
  const [isFlipped, setIsFlipped] = useState(false); // false: word→translation, true: translation→word

  const handleReveal = () => {
    setRevealed(true);
    onReveal?.();
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    setRevealed(false); // Reset to front when flipping
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textToSpeak = isFlipped ? word.translation : word.word;
    const language = isFlipped ? word.outputLanguage : word.inputLanguage;
    speakText(textToSpeak, language);
  };

  // Determine what to show based on flip state
  const frontText = isFlipped ? word.translation : word.word;
  const frontLang = isFlipped ? word.outputLanguage : word.inputLanguage;
  const backText = isFlipped ? word.word : word.translation;
  const backLang = isFlipped ? word.inputLanguage : word.outputLanguage;

  return (
    <div className="w-full max-w-[500px] mx-auto">
      {/* Flip button */}
      <div className="flex justify-center mb-4">
        <button
          onClick={handleFlip}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-all duration-200 text-sm font-medium"
        >
          <RefreshCw className="w-4 h-4" />
          翻转卡片
        </button>
      </div>
      <AnimatePresence mode="wait">
        {!revealed ? (
          // Front of card
          <motion.div
            key="front"
            initial={{ opacity: 0, rotateY: -10 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 10 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl p-12 flex flex-col items-center justify-center min-h-[400px]"
          >
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">
              {frontLang}
            </div>

            <div className="text-6xl md:text-7xl font-bold text-slate-900 mb-8 text-center tracking-tight">
              {frontText}
            </div>

            <button
              onClick={handleSpeak}
              className="mb-12 p-4 bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200 hover:scale-110"
              aria-label="Pronounce word"
            >
              <Volume2 className="w-6 h-6 text-gray-600" />
            </button>

            <button
              onClick={handleReveal}
              className="w-full py-4 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-brand-500/30 transition-all duration-200 text-lg"
            >
              Tap to Reveal
            </button>
          </motion.div>
        ) : (
          // Back of card
          <motion.div
            key="back"
            initial={{ opacity: 0, rotateY: -10 }}
            animate={{ opacity: 1, rotateY: 0 }}
            exit={{ opacity: 0, rotateY: 10 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-xl p-8 min-h-[400px] flex flex-col"
          >
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 text-center">
              {backLang}
            </div>

            <div className="text-5xl font-bold text-slate-900 mb-6 text-center tracking-tight">
              {backText}
            </div>

            <div className="flex-1 space-y-4">
              {word.memorizationTip && (
                <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-blue-700 mb-2">
                    💡 Memorization Tip
                  </div>
                  <div className="text-sm text-slate-700 leading-relaxed">
                    {word.memorizationTip}
                  </div>
                </div>
              )}

              {word.exampleSentence && (
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                    📝 Example
                  </div>
                  <div className="text-sm italic text-slate-700 leading-relaxed">
                    {word.exampleSentence}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
