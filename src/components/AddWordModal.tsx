import { FC } from 'react';
import { X } from 'lucide-react';
import { VocabularyWord, Collection } from '../types';
import { AddWord } from './AddWord';

interface AddWordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (word: VocabularyWord) => void;
  collections?: Collection[];
}

export const AddWordModal: FC<AddWordModalProps> = ({
  isOpen,
  onClose,
  onSave,
  collections = [],
}) => {
  if (!isOpen) return null;

  const handleSave = (word: VocabularyWord) => {
    onSave(word);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl z-10">
          <h2 className="text-xl font-bold text-gray-900">Add New Word</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* AddWord Component */}
        <div className="p-6">
          <AddWord onSave={handleSave} collections={collections} />
        </div>
      </div>
    </div>
  );
};
