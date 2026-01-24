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
            <div className="h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center text-white">
              <div className="text-sm uppercase tracking-wide opacity-80 mb-2">
                {word.inputLanguage}
              </div>
              <div className="text-5xl font-bold mb-6 text-center">{word.word}</div>

              <button
                onClick={handleSpeak}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-4 transition-all duration-200 hover:scale-110"
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

              <div className="mt-8 text-sm opacity-70">Click to reveal translation</div>
            </div>
          </div>

          {/* Back of card - shows translation and additional info */}
          <div className="flip-card-back">
            <div className="h-full bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-2xl p-8 flex flex-col items-center justify-center text-white">
              <div className="text-sm uppercase tracking-wide opacity-80 mb-2">
                {word.outputLanguage}
              </div>
              <div className="text-4xl font-bold mb-6 text-center">{word.translation}</div>

              {word.memorizationTip && (
                <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-4 w-full">
                  <div className="text-xs uppercase tracking-wide opacity-80 mb-1">
                    💡 Tip
                  </div>
                  <div className="text-sm">{word.memorizationTip}</div>
                </div>
              )}

              {word.exampleSentence && (
                <div className="bg-white bg-opacity-20 rounded-lg p-4 w-full">
                  <div className="text-xs uppercase tracking-wide opacity-80 mb-1">
                    📝 Example
                  </div>
                  <div className="text-sm italic">{word.exampleSentence}</div>
                </div>
              )}

              <div className="mt-8 text-sm opacity-70">Click to flip back</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
