import { FC, useState } from 'react';
import { VocabularyWord } from '../types';
import { speakText } from '../services/textToSpeech';

interface FlashCardProps {
  word: VocabularyWord;
}

export const FlashCard: FC<FlashCardProps> = ({ word }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speakText(word.word, word.inputLanguage);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div
        className={`flip-card ${isFlipped ? 'flipped' : ''} cursor-pointer`}
        onClick={handleFlip}
      >
        <div className="flip-card-inner h-80">
          {/* Front of card - shows the word */}
          <div className="flip-card-front">
            <div className="h-full bg-charcoal rounded-3xl border border-charcoal/20 p-8 flex flex-col items-center justify-center text-white shadow-2xl shadow-charcoal/20">
              <div className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
                {word.inputLanguage}
              </div>
              <div className="text-5xl md:text-6xl font-bold mb-8 text-center tracking-tight">{word.word}</div>

              <button
                onClick={handleSpeak}
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-2xl p-4 transition-all duration-200 hover:scale-110 border border-white/10"
                aria-label="Pronounce word"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <div className="mt-8 text-sm text-gray-400 font-medium">Click to reveal translation</div>
            </div>
          </div>

          {/* Back of card - shows translation and additional info */}
          <div className="flip-card-back">
            <div className="h-full bg-white/90 backdrop-blur-md rounded-3xl border border-black/10 p-8 flex flex-col items-center justify-center text-charcoal shadow-2xl shadow-charcoal/10">
              <div className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
                {word.outputLanguage}
              </div>
              <div className="text-4xl md:text-5xl font-bold mb-6 text-center tracking-tight">{word.translation}</div>

              {word.memorizationTip && (
                <div className="bg-brand-50/80 backdrop-blur-sm rounded-2xl border border-brand-100 p-4 mb-4 w-full">
                  <div className="text-xs font-semibold uppercase tracking-wider text-brand-600 mb-2">
                    Tip
                  </div>
                  <div className="text-sm text-charcoal leading-relaxed">{word.memorizationTip}</div>
                </div>
              )}

              {word.exampleSentence && (
                <div className="bg-gray-100/80 backdrop-blur-sm rounded-2xl border border-gray-200 p-4 w-full">
                  <div className="text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
                    Example
                  </div>
                  <div className="text-sm italic text-charcoal leading-relaxed">{word.exampleSentence}</div>
                </div>
              )}

              <div className="mt-8 text-sm text-gray-500 font-medium">Click to flip back</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
