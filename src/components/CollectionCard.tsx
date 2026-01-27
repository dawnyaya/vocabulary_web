import { FC } from 'react';
import { Collection } from '../types';
import { ChevronRight } from 'lucide-react';
import { getIconComponent } from '../utils/collectionIcons';

interface CollectionCardProps {
  collection: Collection;
  wordCount: number;
  reviewCount: number;
  masteredCount: number;
  onClick?: () => void;
}

export const CollectionCard: FC<CollectionCardProps> = ({
  collection,
  wordCount,
  reviewCount,
  masteredCount,
  onClick,
}) => {
  const progress = wordCount > 0 ? (masteredCount / wordCount) * 100 : 0;
  const IconComponent = getIconComponent(collection.emoji);

  return (
    <div
      onClick={onClick}
      className={`${collection.gradient} rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group relative overflow-hidden`}
    >
      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/5"></div>

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Icon */}
        <div className="mb-4 group-hover:scale-110 transition-transform duration-300">
          <IconComponent className="w-12 h-12 text-gray-700/80" strokeWidth={1.5} />
        </div>

        {/* Collection Name */}
        <h3 className="text-lg font-bold text-gray-800 mb-3 truncate">
          {collection.name}
        </h3>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-gray-700 mb-2">
            <span className="font-semibold">{masteredCount} / {wordCount} mastered</span>
            <span className="font-bold">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 bg-black/15 backdrop-blur-sm rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full transition-all duration-500 ease-out shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            {reviewCount > 0 && (
              <span className="font-semibold text-brand-600">
                {reviewCount} to review
              </span>
            )}
            {reviewCount === 0 && wordCount > 0 && (
              <span className="text-gray-600">All caught up! 🎉</span>
            )}
            {wordCount === 0 && (
              <span className="text-gray-500">No words yet</span>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
