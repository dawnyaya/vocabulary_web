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
import { VocabularyWord, WordProgress } from '../types';

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
};
