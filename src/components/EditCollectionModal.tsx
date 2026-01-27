import { FC, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { COLLECTION_ICONS } from '../utils/collectionIcons';
import { Collection } from '../types';

interface EditCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, name: string, icon: string, gradient: string) => void;
  collection: Collection | null;
}

// Predefined gradient backgrounds (Tailwind classes)
const GRADIENTS = [
  { name: 'Sunset', class: 'bg-gradient-to-br from-orange-100 to-pink-100' },
  { name: 'Ocean', class: 'bg-gradient-to-br from-blue-100 to-cyan-100' },
  { name: 'Forest', class: 'bg-gradient-to-br from-green-100 to-emerald-100' },
  { name: 'Lavender', class: 'bg-gradient-to-br from-purple-100 to-pink-100' },
  { name: 'Peachy', class: 'bg-gradient-to-br from-yellow-100 to-orange-100' },
  { name: 'Mint', class: 'bg-gradient-to-br from-teal-100 to-green-100' },
  { name: 'Rose', class: 'bg-gradient-to-br from-pink-100 to-rose-100' },
  { name: 'Sky', class: 'bg-gradient-to-br from-sky-100 to-indigo-100' },
  { name: 'Lemon', class: 'bg-gradient-to-br from-lime-100 to-yellow-100' },
  { name: 'Berry', class: 'bg-gradient-to-br from-fuchsia-100 to-purple-100' },
];

export const EditCollectionModal: FC<EditCollectionModalProps> = ({
  isOpen,
  onClose,
  onUpdate,
  collection,
}) => {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(COLLECTION_ICONS[0].name);
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0].class);

  // Initialize form with collection data when modal opens
  useEffect(() => {
    if (collection) {
      setName(collection.name);
      setSelectedIcon(collection.emoji);
      setSelectedGradient(collection.gradient);
    }
  }, [collection]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && collection) {
      onUpdate(collection.id, name.trim(), selectedIcon, selectedGradient);
      onClose();
    }
  };

  if (!isOpen || !collection) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-bold text-gray-900">Edit Collection</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Collection Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Collection Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Daily Vocabulary"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Icon Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose Icon
            </label>
            <div className="grid grid-cols-6 gap-2 max-h-64 overflow-y-auto pr-1">
              {COLLECTION_ICONS.map((icon) => {
                const IconComponent = icon.component;
                return (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() => setSelectedIcon(icon.name)}
                    className={`p-3 rounded-xl hover:bg-gray-100 transition-all ${
                      selectedIcon === icon.name
                        ? 'bg-brand-100 ring-2 ring-brand-500 scale-105'
                        : 'bg-gray-50'
                    }`}
                    title={icon.label}
                  >
                    <IconComponent className="w-6 h-6 text-gray-700 mx-auto" strokeWidth={1.5} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gradient Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose Color
            </label>
            <div className="grid grid-cols-5 gap-3">
              {GRADIENTS.map((gradient) => (
                <button
                  key={gradient.name}
                  type="button"
                  onClick={() => setSelectedGradient(gradient.class)}
                  className={`h-12 rounded-xl ${gradient.class} transition-all hover:scale-105 ${
                    selectedGradient === gradient.class
                      ? 'ring-2 ring-gray-800 ring-offset-2 scale-105'
                      : ''
                  }`}
                  title={gradient.name}
                />
              ))}
            </div>
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Preview
            </label>
            <div className={`${selectedGradient} rounded-2xl p-6 text-center relative overflow-hidden`}>
              {/* Soft gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/5"></div>

              <div className="relative z-10">
                <div className="flex justify-center mb-3">
                  {(() => {
                    const IconComponent = COLLECTION_ICONS.find(i => i.name === selectedIcon)?.component;
                    return IconComponent ? <IconComponent className="w-12 h-12 text-gray-700/80" strokeWidth={1.5} /> : null;
                  })()}
                </div>
                <div className="text-lg font-bold text-gray-800">
                  {name || 'Collection Name'}
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-brand-500 to-brand-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-brand-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
