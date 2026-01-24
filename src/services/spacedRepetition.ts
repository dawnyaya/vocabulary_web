import { FamiliarityLevel, WordProgress } from '../types';

// Calculate next review date based on familiarity level
export const calculateNextReview = (
  familiarityLevel: FamiliarityLevel,
  currentReviewCount: number = 0
): Date => {
  const now = new Date();
  const nextReview = new Date(now);

  switch (familiarityLevel) {
    case 'not-familiar':
      // Review tomorrow
      nextReview.setDate(now.getDate() + 1);
      break;
    case 'little-familiar':
      // Review after 2 days
      nextReview.setDate(now.getDate() + 2);
      break;
    case 'very-familiar':
      // Progressive intervals: 3, 4, 7, 14, 30 days
      const intervals = [3, 4, 7, 14, 30];
      const intervalIndex = Math.min(currentReviewCount, intervals.length - 1);
      nextReview.setDate(now.getDate() + intervals[intervalIndex]);
      break;
  }

  return nextReview;
};

// Create or update word progress
export const updateWordProgress = (
  wordId: string,
  familiarityLevel: FamiliarityLevel,
  existingProgress?: WordProgress
): WordProgress => {
  const now = new Date();
  const reviewCount = existingProgress ? existingProgress.reviewCount + 1 : 1;

  return {
    wordId,
    familiarityLevel,
    lastReviewed: now,
    nextReview: calculateNextReview(familiarityLevel, reviewCount),
    reviewCount,
  };
};

// Check if a word is due for review
export const isDueForReview = (progress: WordProgress): boolean => {
  const now = new Date();
  return now >= progress.nextReview;
};

// Get all due words
export const getDueWords = (allProgress: WordProgress[]): WordProgress[] => {
  return allProgress.filter(isDueForReview);
};
