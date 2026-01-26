import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { VocabularyWord, WordProgress, Collection } from '../types';

// Convert Firestore Timestamp to Date
const timestampToDate = (timestamp: any): Date => {
  if (timestamp && timestamp.toDate) {
    return timestamp.toDate();
  }
  return new Date(timestamp);
};

// Convert Date to Firestore Timestamp
const dateToTimestamp = (date: Date): Timestamp => {
  return Timestamp.fromDate(date);
};

export const cloudStorageService = {
  // Get all words for a user
  async getWords(userId: string): Promise<VocabularyWord[]> {
    try {
      const wordsRef = collection(db, 'users', userId, 'words');
      const snapshot = await getDocs(wordsRef);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: timestampToDate(data.createdAt),
          updatedAt: timestampToDate(data.updatedAt),
        } as VocabularyWord;
      });
    } catch (error) {
      console.error('Error getting words:', error);
      return [];
    }
  },

  // Add a new word
  async addWord(userId: string, word: VocabularyWord): Promise<void> {
    try {
      const wordRef = doc(db, 'users', userId, 'words', word.id);
      await setDoc(wordRef, {
        ...word,
        createdAt: dateToTimestamp(word.createdAt),
        updatedAt: dateToTimestamp(word.updatedAt),
      });
    } catch (error) {
      console.error('Error adding word:', error);
      throw error;
    }
  },

  // Delete a word
  async deleteWord(userId: string, wordId: string): Promise<void> {
    try {
      const wordRef = doc(db, 'users', userId, 'words', wordId);
      await deleteDoc(wordRef);
    } catch (error) {
      console.error('Error deleting word:', error);
      throw error;
    }
  },

  // Get all progress for a user
  async getProgress(userId: string): Promise<WordProgress[]> {
    try {
      const progressRef = collection(db, 'users', userId, 'progress');
      const snapshot = await getDocs(progressRef);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          lastReviewed: timestampToDate(data.lastReviewed),
          nextReview: timestampToDate(data.nextReview),
        } as WordProgress;
      });
    } catch (error) {
      console.error('Error getting progress:', error);
      return [];
    }
  },

  // Update progress for a word
  async updateProgress(userId: string, progress: WordProgress): Promise<void> {
    try {
      const progressRef = doc(db, 'users', userId, 'progress', progress.wordId);
      await setDoc(progressRef, {
        ...progress,
        lastReviewed: dateToTimestamp(progress.lastReviewed),
        nextReview: dateToTimestamp(progress.nextReview),
      });
    } catch (error) {
      console.error('Error updating progress:', error);
      throw error;
    }
  },

  // ============ COLLECTIONS ============

  // Get all collections for a user
  async getCollections(userId: string): Promise<Collection[]> {
    try {
      const collectionsRef = collection(db, 'users', userId, 'collections');
      const snapshot = await getDocs(collectionsRef);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: timestampToDate(data.createdAt),
          updatedAt: timestampToDate(data.updatedAt),
        } as Collection;
      });
    } catch (error) {
      console.error('Error getting collections:', error);
      return [];
    }
  },

  // Add a new collection
  async addCollection(userId: string, collection: Collection): Promise<void> {
    try {
      const collectionRef = doc(db, 'users', userId, 'collections', collection.id);
      await setDoc(collectionRef, {
        ...collection,
        createdAt: dateToTimestamp(collection.createdAt),
        updatedAt: dateToTimestamp(collection.updatedAt),
      });
    } catch (error) {
      console.error('Error adding collection:', error);
      throw error;
    }
  },

  // Update a collection
  async updateCollection(userId: string, collection: Collection): Promise<void> {
    try {
      const collectionRef = doc(db, 'users', userId, 'collections', collection.id);
      await setDoc(collectionRef, {
        ...collection,
        createdAt: dateToTimestamp(collection.createdAt),
        updatedAt: dateToTimestamp(collection.updatedAt),
      });
    } catch (error) {
      console.error('Error updating collection:', error);
      throw error;
    }
  },

  // Delete a collection
  async deleteCollection(userId: string, collectionId: string): Promise<void> {
    try {
      const collectionRef = doc(db, 'users', userId, 'collections', collectionId);
      await deleteDoc(collectionRef);
    } catch (error) {
      console.error('Error deleting collection:', error);
      throw error;
    }
  },

  // Get words for a specific collection
  async getWordsByCollection(userId: string, collectionId: string): Promise<VocabularyWord[]> {
    try {
      const wordsRef = collection(db, 'users', userId, 'words');
      const q = query(wordsRef, where('collectionId', '==', collectionId));
      const snapshot = await getDocs(q);

      return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          ...data,
          id: doc.id,
          createdAt: timestampToDate(data.createdAt),
          updatedAt: timestampToDate(data.updatedAt),
        } as VocabularyWord;
      });
    } catch (error) {
      console.error('Error getting words by collection:', error);
      return [];
    }
  },
};
