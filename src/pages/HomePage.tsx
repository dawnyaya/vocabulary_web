import { FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cloudStorageService } from '../services/cloudStorage';
import { getDueWords } from '../services/spacedRepetition';
import { useAuth } from '../contexts/AuthContext';
import { Collection } from '../types';
import { CollectionCard } from '../components/CollectionCard';
import { CreateCollectionModal } from '../components/CreateCollectionModal';
import { EditCollectionModal } from '../components/EditCollectionModal';
import { DeleteCollectionDialog } from '../components/DeleteCollectionDialog';
import { Plus } from 'lucide-react';

export const HomePage: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [totalWords, setTotalWords] = useState(0);
  const [dueCount, setDueCount] = useState(0);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [collectionStats, setCollectionStats] = useState<{ [key: string]: { wordCount: number; reviewCount: number; masteredCount: number } }>({});
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [_loading, setLoading] = useState(true);

  const loadData = async () => {
    if (!user) return;

    try {
      // Ensure default collection exists
      await cloudStorageService.ensureDefaultCollection(user.uid);

      const [words, allProgress, allCollections] = await Promise.all([
        cloudStorageService.getWords(user.uid),
        cloudStorageService.getProgress(user.uid),
        cloudStorageService.getCollections(user.uid),
      ]);

      const due = getDueWords(allProgress);

      // Count new words (no progress yet)
      const newWords = words.filter(
        (word) => !allProgress.find((p) => p.wordId === word.id)
      );

      setTotalWords(words.length);
      setDueCount(due.length + newWords.length);
      setCollections(allCollections);

      // Calculate stats for each collection
      const stats: { [key: string]: { wordCount: number; reviewCount: number; masteredCount: number } } = {};
      allCollections.forEach((collection) => {
        const collectionWords = words.filter((w) => w.collectionId === collection.id);
        const collectionProgress = allProgress.filter((p) =>
          collectionWords.some((w) => w.id === p.wordId)
        );
        const collectionDue = getDueWords(collectionProgress);
        const collectionNew = collectionWords.filter(
          (word) => !allProgress.find((p) => p.wordId === word.id)
        );

        // Count mastered words (very-familiar)
        const collectionMastered = collectionProgress.filter(
          (p) => p.familiarityLevel === 'very-familiar'
        ).length;

        stats[collection.id] = {
          wordCount: collectionWords.length,
          reviewCount: collectionDue.length + collectionNew.length,
          masteredCount: collectionMastered,
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
      await loadData(); // Reload data
    } catch (error) {
      console.error('Error creating collection:', error);
      alert('Failed to create collection');
    }
  };

  const handleEditClick = (e: React.MouseEvent, collection: Collection) => {
    e.stopPropagation(); // Prevent card click
    setSelectedCollection(collection);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (e: React.MouseEvent, collection: Collection) => {
    e.stopPropagation(); // Prevent card click
    setSelectedCollection(collection);
    setIsDeleteDialogOpen(true);
  };

  const handleUpdateCollection = async (id: string, name: string, icon: string, gradient: string) => {
    if (!user) return;

    const updatedCollection: Collection = {
      id,
      name,
      emoji: icon,
      gradient,
      createdAt: selectedCollection?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    try {
      await cloudStorageService.updateCollection(user.uid, updatedCollection);
      await loadData(); // Reload data
      setIsEditModalOpen(false);
      setSelectedCollection(null);
    } catch (error) {
      console.error('Error updating collection:', error);
      alert('Failed to update collection');
    }
  };

  const handleDeleteCollection = async () => {
    if (!user || !selectedCollection) return;

    try {
      // Get all words in this collection
      const allWords = await cloudStorageService.getWords(user.uid);
      const wordsInCollection = allWords.filter((w) => w.collectionId === selectedCollection.id);

      // If there are words, move them to General collection
      if (wordsInCollection.length > 0) {
        // Get or create General collection
        const generalCollection = await cloudStorageService.ensureDefaultCollection(user.uid);

        // Move all words to General collection
        for (const word of wordsInCollection) {
          const updatedWord = {
            ...word,
            collectionId: generalCollection.id,
            updatedAt: new Date(),
          };
          await cloudStorageService.updateWord(user.uid, updatedWord);
        }
      }

      // Delete the collection
      await cloudStorageService.deleteCollection(user.uid, selectedCollection.id);

      // Reload data
      await loadData();

      // Close dialog
      setIsDeleteDialogOpen(false);
      setSelectedCollection(null);
    } catch (error) {
      console.error('Error deleting collection:', error);
      alert('Failed to delete collection. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-off-white p-6 md:p-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-charcoal tracking-tight">
            Memoloop
          </h1>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(140px,auto)]">

          {/* Stats - Small elegant cards at top */}
          <div className="md:col-span-1 bg-white/60 backdrop-blur-sm rounded-3xl border border-black/5 p-6 hover:bg-white/80 transition-all duration-300">
            <div className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Total</div>
            <div className="text-4xl font-bold text-charcoal">{totalWords}</div>
            <div className="text-xs text-gray-400 mt-1">words learned</div>
          </div>

          <div className="md:col-span-1 bg-white/60 backdrop-blur-sm rounded-3xl border border-black/5 p-6 hover:bg-white/80 transition-all duration-300">
            <div className="text-sm font-medium text-gray-500 mb-1 uppercase tracking-wider">Due</div>
            <div className="text-4xl font-bold text-brand-500">{dueCount}</div>
            <div className="text-xs text-gray-400 mt-1">ready to review</div>
          </div>

          {/* Review - Hero card (larger) */}
          <Link to="/review" className="md:col-span-2 md:row-span-2">
            <div className="h-full bg-gradient-to-br from-brand-500 to-brand-600 rounded-3xl border border-brand-400/20 p-8 hover:shadow-2xl hover:shadow-brand-500/20 transition-all duration-300 cursor-pointer group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10">
                <div className="inline-block p-3 bg-white/10 backdrop-blur-sm rounded-2xl mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">
                  {dueCount > 0 ? `Start Review (${dueCount} due)` : 'Take a break!'}
                </h2>
                <p className="text-brand-50 text-sm leading-relaxed">
                  {dueCount > 0
                    ? 'Practice with flashcards and reinforce your memory through spaced repetition'
                    : "You're all caught up! No words to review right now. Come back later!"
                  }
                </p>
              </div>
            </div>
          </Link>

          {/* Add New Word - Medium card */}
          <Link to="/add" className="md:col-span-2">
            <div className="h-full bg-white/60 backdrop-blur-sm rounded-3xl border border-black/5 p-8 hover:bg-white/80 hover:border-black/10 transition-all duration-300 cursor-pointer group">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-charcoal/5 rounded-xl group-hover:bg-brand-50 transition-colors duration-300">
                  <svg className="w-6 h-6 text-charcoal group-hover:text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-charcoal mb-1">Add New Word</h2>
                  <p className="text-gray-500 text-sm">Build your vocabulary with AI-powered tips and examples</p>
                </div>
              </div>
            </div>
          </Link>

          {/* Collections Section */}
          <div className="md:col-span-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-charcoal">Collections</h3>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-all duration-200 text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                New Collection
              </button>
            </div>

            {collections.length === 0 ? (
              <div className="bg-white/40 backdrop-blur-sm rounded-2xl border border-black/5 p-12 text-center">
                <div className="text-5xl mb-4">📚</div>
                <h4 className="text-lg font-semibold text-charcoal mb-2">No Collections Yet</h4>
                <p className="text-gray-500 text-sm mb-6">Create your first collection to organize your vocabulary</p>
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-6 py-3 bg-brand-500 hover:bg-brand-600 text-white rounded-xl transition-all duration-200 font-semibold"
                >
                  Create Collection
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {collections.slice(0, 6).map((collection) => (
                  <CollectionCard
                    key={collection.id}
                    collection={collection}
                    wordCount={collectionStats[collection.id]?.wordCount || 0}
                    reviewCount={collectionStats[collection.id]?.reviewCount || 0}
                    masteredCount={collectionStats[collection.id]?.masteredCount || 0}
                    onClick={() => navigate('/collection')}
                    onEdit={(e) => handleEditClick(e, collection)}
                    onDelete={(e) => handleDeleteClick(e, collection)}
                    canDelete={collection.id !== 'general-default'}
                  />
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Create Collection Modal */}
        <CreateCollectionModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateCollection}
        />

        {/* Edit Collection Modal */}
        <EditCollectionModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCollection(null);
          }}
          onUpdate={handleUpdateCollection}
          collection={selectedCollection}
        />

        {/* Delete Collection Dialog */}
        <DeleteCollectionDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false);
            setSelectedCollection(null);
          }}
          onConfirm={handleDeleteCollection}
          collection={selectedCollection}
          wordCount={selectedCollection ? (collectionStats[selectedCollection.id]?.wordCount || 0) : 0}
        />
      </div>
    </div>
  );
};
