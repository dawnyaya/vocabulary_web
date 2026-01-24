import { VocabularyWord, WordProgress } from '../types';

const WORDS_KEY = 'vocabulary_words';
const PROGRESS_KEY = 'vocabulary_progress';

export const storageService = {
  // Words operations
  saveWords(words: VocabularyWord[]): void {
    localStorage.setItem(WORDS_KEY, JSON.stringify(words));
  },

  getWords(): VocabularyWord[] {
    const data = localStorage.getItem(WORDS_KEY);
    if (!data) return [];

    const words = JSON.parse(data);
    // Convert date strings back to Date objects
    return words.map((word: VocabularyWord) => ({
      ...word,
      createdAt: new Date(word.createdAt),
      updatedAt: new Date(word.updatedAt),
    }));
  },

  addWord(word: VocabularyWord): void {
    const words = this.getWords();
    words.push(word);
    this.saveWords(words);
  },

  updateWord(id: string, updates: Partial<VocabularyWord>): void {
    const words = this.getWords();
    const index = words.findIndex(w => w.id === id);
    if (index !== -1) {
      words[index] = { ...words[index], ...updates, updatedAt: new Date() };
      this.saveWords(words);
    }
  },

  deleteWord(id: string): void {
    const words = this.getWords();
    const filtered = words.filter(w => w.id !== id);
    this.saveWords(filtered);

    // Also delete associated progress
    const progress = this.getProgress();
    const filteredProgress = progress.filter(p => p.wordId !== id);
    this.saveProgress(filteredProgress);
  },

  // Progress operations
  saveProgress(progress: WordProgress[]): void {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  },

  getProgress(): WordProgress[] {
    const data = localStorage.getItem(PROGRESS_KEY);
    if (!data) return [];

    const progress = JSON.parse(data);
    // Convert date strings back to Date objects
    return progress.map((p: WordProgress) => ({
      ...p,
      lastReviewed: new Date(p.lastReviewed),
      nextReview: new Date(p.nextReview),
    }));
  },

  getWordProgress(wordId: string): WordProgress | undefined {
    const progress = this.getProgress();
    return progress.find(p => p.wordId === wordId);
  },

  updateProgress(wordProgress: WordProgress): void {
    const progress = this.getProgress();
    const index = progress.findIndex(p => p.wordId === wordProgress.wordId);

    if (index !== -1) {
      progress[index] = wordProgress;
    } else {
      progress.push(wordProgress);
    }

    this.saveProgress(progress);
  },

  // Utility methods
  clearAll(): void {
    localStorage.removeItem(WORDS_KEY);
    localStorage.removeItem(PROGRESS_KEY);
  },
};
