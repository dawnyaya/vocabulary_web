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
    icon: string;
    description: string;
  }> = [
    {
      level: 'not-familiar',
      label: 'Not Familiar',
      color: 'bg-red-500 hover:bg-red-600',
      icon: '😕',
      description: 'Review tomorrow',
    },
    {
      level: 'little-familiar',
      label: 'Little Familiar',
      color: 'bg-yellow-500 hover:bg-yellow-600',
      icon: '🤔',
      description: 'Review in 2 days',
    },
    {
      level: 'very-familiar',
      label: 'Very Familiar',
      color: 'bg-green-500 hover:bg-green-600',
      icon: '😊',
      description: 'Review in 3+ days',
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto mt-8">
      <div className="text-center mb-4">
        <h3 className="text-lg font-semibold text-gray-700">How familiar are you?</h3>
      </div>

      <div className="flex flex-col gap-3">
        {levels.map(({ level, label, color, icon, description }) => (
          <button
            key={level}
            onClick={() => onSelect(level)}
            className={`${color} text-white rounded-xl p-4 transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 flex items-center justify-between`}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{icon}</span>
              <div className="text-left">
                <div className="font-semibold">{label}</div>
                <div className="text-xs opacity-90">{description}</div>
              </div>
            </div>

            {/* Signal bars visualization */}
            <div className="flex gap-1">
              {[1, 2, 3].map((bar) => (
                <div
                  key={bar}
                  className={`w-2 h-8 rounded-full ${
                    bar <=
                    (level === 'not-familiar' ? 1 : level === 'little-familiar' ? 2 : 3)
                      ? 'bg-white'
                      : 'bg-white bg-opacity-30'
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
