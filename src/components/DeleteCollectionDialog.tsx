import { FC } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { Collection } from '../types';

interface DeleteCollectionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  collection: Collection | null;
  wordCount: number;
}

export const DeleteCollectionDialog: FC<DeleteCollectionDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  collection,
  wordCount,
}) => {
  if (!isOpen || !collection) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Delete Collection?</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Warning Message */}
          <div className="space-y-2">
            <p className="text-gray-700">
              Are you sure you want to delete <span className="font-bold text-gray-900">"{collection.name}"</span>?
            </p>

            {wordCount > 0 ? (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold text-amber-900">
                  ⚠️ This collection contains {wordCount} word{wordCount > 1 ? 's' : ''}
                </p>
                <p className="text-sm text-amber-800">
                  All words will be moved to the <span className="font-semibold">"General"</span> collection.
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                This collection is empty and can be safely deleted.
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 font-semibold rounded-2xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold rounded-2xl hover:shadow-lg hover:shadow-red-500/30 transition-all"
            >
              Delete Collection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
