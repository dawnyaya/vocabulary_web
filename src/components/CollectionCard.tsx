import { FC } from 'react';
import { Collection } from '../types';
import { ChevronRight } from 'lucide-react';

interface CollectionCardProps {
  collection: Collection;
  wordCount: number;
  reviewCount: number;
  onClick?: () => void;
}

export const CollectionCard: FC<CollectionCardProps> = ({
  collection,
  wordCount,
  reviewCount,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`${collection.gradient} rounded-3xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl group relative overflow-hidden`}
    >
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }}></div>
      </div>

      <div className="relative z-10">
        {/* Emoji Icon */}
        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
          {collection.emoji}
        </div>

        {/* Collection Name */}
        <h3 className="text-lg font-bold text-gray-800 mb-2 truncate">
          {collection.name}
        </h3>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <span className="text-gray-700">
              {wordCount} {wordCount === 1 ? 'word' : 'words'}
            </span>
            {reviewCount > 0 && (
              <>
                <span className="text-gray-400">•</span>
                <span className="font-semibold text-brand-600">
                  {reviewCount} to review
                </span>
              </>
            )}
          </div>
          <ChevronRight className="w-5 h-5 text-gray-600 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
