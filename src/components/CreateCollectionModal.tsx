import { FC, useState } from 'react';
import { X } from 'lucide-react';

interface CreateCollectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, emoji: string, gradient: string) => void;
}

// Predefined emojis for collections
const EMOJIS = [
  '📚', '✨', '🎯', '🚀', '💡', '🎨', '🌟', '🔥',
  '💼', '🎓', '🌈', '⚡', '🎭', '🎪', '🎬', '🎵',
  '🏆', '🎮', '🧩', '🎲', '🧠', '💎', '🌸', '🍀',
];

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

export const CreateCollectionModal: FC<CreateCollectionModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📚');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENTS[0].class);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onCreate(name.trim(), selectedEmoji, selectedGradient);
      // Reset form
      setName('');
      setSelectedEmoji('📚');
      setSelectedGradient(GRADIENTS[0].class);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <h2 className="text-xl font-bold text-gray-900">Create Collection</h2>
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

          {/* Emoji Selector */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Choose Icon
            </label>
            <div className="grid grid-cols-8 gap-2">
              {EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setSelectedEmoji(emoji)}
                  className={`text-2xl p-2 rounded-xl hover:bg-gray-100 transition-all ${
                    selectedEmoji === emoji
                      ? 'bg-brand-100 ring-2 ring-brand-500 scale-110'
                      : ''
                  }`}
                >
                  {emoji}
                </button>
              ))}
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
            <div className={`${selectedGradient} rounded-2xl p-6 text-center`}>
              <div className="text-4xl mb-2">{selectedEmoji}</div>
              <div className="text-lg font-bold text-gray-800">
                {name || 'Collection Name'}
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
              Create
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
