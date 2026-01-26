import { FC, useState, useEffect } from 'react';
import { VocabularyWord, Collection } from '../types';
import { cloudStorageService } from '../services/cloudStorage';
import { useAuth } from '../contexts/AuthContext';
import { AddWord } from '../components/AddWord';

export const AddWordPage: FC = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [collections, setCollections] = useState<Collection[]>([]);

  useEffect(() => {
    const loadCollections = async () => {
      if (!user) return;

      try {
        const allCollections = await cloudStorageService.getCollections(user.uid);
        setCollections(allCollections);
      } catch (error) {
        console.error('Error loading collections:', error);
      }
    };

    loadCollections();
  }, [user]);

  const handleSave = async (word: VocabularyWord) => {
    if (!user) {
      alert('Please sign in to save words');
      return;
    }

    setIsSaving(true);
    try {
      await cloudStorageService.addWord(user.uid, word);
      alert('Word saved successfully!');
    } catch (error) {
      console.error('Error saving word:', error);
      alert('Failed to save word. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-off-white py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <AddWord onSave={handleSave} collections={collections} />
      </div>
    </div>
  );
};
