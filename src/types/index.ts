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
}

export interface WordWithProgress extends VocabularyWord {
  progress?: WordProgress;
}
