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
    <div className="min-h-screen bg-white py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <AddWord onSave={handleSave} />
      </div>
    </div>
  );
};
