import { FC } from 'react';
import { VocabularyWord } from '../types';
import { storageService } from '../services/storage';
import { AddWord } from '../components/AddWord';

export const AddWordPage: FC = () => {
  const handleSave = (word: VocabularyWord) => {
    storageService.addWord(word);
    // Show success message
    alert('Word saved successfully!');
  };

  return (
    <div className="min-h-screen bg-off-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <AddWord onSave={handleSave} />
      </div>
    </div>
  );
};
