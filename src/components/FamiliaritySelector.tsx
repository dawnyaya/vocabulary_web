import { FC } from 'react';
import { FamiliarityLevel } from '../types';

interface FamiliaritySelectorProps {
  onSelect: (level: FamiliarityLevel) => void;
}

export const FamiliaritySelector: FC<FamiliaritySelectorProps> = ({ onSelect }) => {
  const levels: Array<{
    level: FamiliarityLevel;
    label: string;
    color: string;
    description: string;
  }> = [
    {
      level: 'not-familiar',
      label: 'Not Familiar',
      color: 'bg-white/60 backdrop-blur-sm border-black/10 text-charcoal hover:bg-white/80 hover:border-black/20',
      description: 'Review tomorrow',
    },
    {
      level: 'little-familiar',
      label: 'Little Familiar',
      color: 'bg-gray-600 text-white hover:bg-gray-700 border-gray-500',
      description: 'Review in 2 days',
    },
    {
      level: 'very-familiar',
      label: 'Very Familiar',
      color: 'bg-brand-500 text-white hover:bg-brand-600 border-brand-400',
      description: 'Review in 3+ days',
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-charcoal">How familiar are you?</h3>
      </div>

      <div className="flex flex-col gap-3">
        {levels.map(({ level, label, color, description }) => (
          <button
            key={level}
            onClick={() => onSelect(level)}
            className={`${color} rounded-2xl border p-5 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg active:scale-95 flex items-center justify-between`}
          >
            <div className="text-left">
              <div className="font-bold text-lg">{label}</div>
              <div className="text-xs opacity-75 mt-1">{description}</div>
            </div>

            {/* Signal bars visualization */}
            <div className="flex gap-1.5">
              {[1, 2, 3].map((bar) => (
                <div
                  key={bar}
                  className={`w-2 h-10 rounded-full transition-all duration-200 ${
                    bar <=
                    (level === 'not-familiar' ? 1 : level === 'little-familiar' ? 2 : 3)
                      ? level === 'not-familiar' ? 'bg-charcoal' : 'bg-white'
                      : level === 'not-familiar' ? 'bg-charcoal/20' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
