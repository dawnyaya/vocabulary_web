export type Language = 'chinese' | 'english' | 'japanese';

export type FamiliarityLevel = 'not-familiar' | 'little-familiar' | 'very-familiar';

export interface Collection {
  id: string;
  name: string;
  emoji: string;
  gradient: string; // Tailwind gradient class
  createdAt: Date;
  updatedAt: Date;
}

export interface VocabularyWord {
  id: string;
  word: string;
  translation: string;
  inputLanguage: Language;
  outputLanguage: Language;
  memorizationTip?: string;
  exampleSentence?: string;
  collectionId?: string; // Which collection this word belongs to
  createdAt: Date;
  updatedAt: Date;
}

export interface WordProgress {
  wordId: string;
  familiarityLevel: FamiliarityLevel;
  lastReviewed: Date;
  nextReview: Date;
  reviewCount: number;
  // SM-2 Algorithm fields
  easinessFactor: number;  // Difficulty factor (1.3 - 2.5+), default 2.5
  interval: number;        // Days until next review
  repetitions: number;     // Consecutive correct answers
}

export interface WordWithProgress extends VocabularyWord {
  progress?: WordProgress;
}
