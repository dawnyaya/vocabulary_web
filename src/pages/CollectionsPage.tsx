import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cloudStorageService } from '../services/cloudStorage';
import { getDueWords } from '../services/spacedRepetition';
import { useAuth } from '../contexts/AuthContext';
import { Collection } from '../types';
import { CollectionCard } from '../components/CollectionCard';
import { CreateCollectionModal } from '../components/CreateCollectionModal';
import { Plus } from 'lucide-react';

export const CollectionsPage: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionStats, setCollectionStats] = useState<{ [key: string]: { wordCount: number; reviewCount: number } }>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const [words, allProgress, allCollections] = await Promise.all([
        cloudStorageService.getWords(user.uid),
        cloudStorageService.getProgress(user.uid),
        cloudStorageService.getCollections(user.uid),
      ]);

      setCollections(allCollections);

      // Calculate stats for each collection
      const stats: { [key: string]: { wordCount: number; reviewCount: number } } = {};
      allCollections.forEach((collection) => {
        const collectionWords = words.filter((w) => w.collectionId === collection.id);
        const collectionProgress = allProgress.filter((p) =>
          collectionWords.some((w) => w.id === p.wordId)
        );
        const collectionDue = getDueWords(collectionProgress);
        const collectionNew = collectionWords.filter(
          (word) => !allProgress.find((p) => p.wordId === word.id)
        );

        stats[collection.id] = {
          wordCount: collectionWords.length,
          reviewCount: collectionDue.length + collectionNew.length,
        };
      });

      setCollectionStats(stats);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleCreateCollection = async (name: string, emoji: string, gradient: string) => {
    if (!user) return;

    const newCollection: Collection = {
      id: Date.now().toString(),
      name,
      emoji,
      gradient,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await cloudStorageService.addCollection(user.uid, newCollection);
      await loadData();
    } catch (error) {
      console.error('Error creating collection:', error);
      alert('Failed to create collection');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-off-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block p-4 bg-brand-50 rounded-2xl mb-4">
            <svg className="animate-spin h-12 w-12 text-brand-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-off-white py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-charcoal mb-2 tracking-tight">Collections</h1>
            <p className="text-gray-500">
              Organize your vocabulary into collections
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl transition-all duration-200 font-semibold shadow-lg shadow-brand-500/20"
          >
            <Plus className="w-5 h-5" />
            New Collection
          </button>
        </div>

        {/* Collections Grid */}
        {collections.length === 0 ? (
          <div className="bg-white/40 backdrop-blur-sm rounded-3xl border border-black/5 p-20 text-center">
            <div className="text-6xl mb-6">📚</div>
            <h2 className="text-2xl font-bold text-charcoal mb-3">No Collections Yet</h2>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
              Create your first collection to organize your vocabulary by topics, difficulty, or any way you like
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-8 py-4 bg-brand-500 hover:bg-brand-600 text-white rounded-2xl transition-all duration-200 font-semibold text-lg shadow-lg shadow-brand-500/20"
            >
              Create Your First Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {collections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                wordCount={collectionStats[collection.id]?.wordCount || 0}
                reviewCount={collectionStats[collection.id]?.reviewCount || 0}
                onClick={() => navigate(`/collection/${collection.id}`)}
              />
            ))}
          </div>
        )}

        {/* Create Collection Modal */}
        <CreateCollectionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateCollection}
        />
      </div>
    </div>
  );
};
