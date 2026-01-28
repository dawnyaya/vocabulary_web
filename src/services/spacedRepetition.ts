import { FamiliarityLevel, WordProgress } from '../types';

/**
 * SM-2 Algorithm Simplified Implementation
 *
 * Core Concepts:
 * - Easiness Factor (EF): Measures how "easy" a word is (1.3 to 2.5+)
 * - Interval: Days until next review
 * - Repetitions: Consecutive correct answers
 * - Quality: User rating (0-5), mapped from Again/Good/Easy buttons
 *
 * Algorithm Logic:
 * 1. Quality >= 3 (Good/Easy): Increase interval, increment repetitions
 * 2. Quality < 3 (Again): Reset to beginning, interval = 1 day
 * 3. EF adjusts based on quality to personalize difficulty
 */

// Constants for SM-2 algorithm
const DEFAULT_EASINESS_FACTOR = 2.5;
const MIN_EASINESS_FACTOR = 1.3;
const INITIAL_INTERVAL_DAYS = 1;
const SECOND_INTERVAL_DAYS = 6;

/**
 * Map user button to SM-2 quality (0-5 scale)
 * Again = 0-2 (fail), Good = 3-4 (pass), Easy = 5 (perfect)
 */
type Quality = 0 | 1 | 2 | 3 | 4 | 5;

const familiarityToQuality: Record<FamiliarityLevel, Quality> = {
  'not-familiar': 1,    // Again - forgot completely
  'little-familiar': 3, // Good - remembered with effort
  'very-familiar': 5,   // Easy - instant recall
};

/**
 * Calculate new Easiness Factor based on quality
 * Formula: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
 *
 * Interpretation:
 * - Quality 5: EF increases (word becomes "easier")
 * - Quality 3-4: EF stays roughly the same
 * - Quality 0-2: EF decreases (word becomes "harder")
 */
const calculateEasinessFactor = (currentEF: number, quality: Quality): number => {
  const newEF = currentEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

  // EF must be at least 1.3
  return Math.max(MIN_EASINESS_FACTOR, newEF);
};

/**
 * Calculate next interval using SM-2 algorithm
 *
 * Rules:
 * - First review (rep 1): 1 day
 * - Second review (rep 2): 6 days
 * - Subsequent reviews: previous_interval * EF
 */
const calculateInterval = (
  repetitions: number,
  previousInterval: number,
  easinessFactor: number
): number => {
  if (repetitions === 1) {
    return INITIAL_INTERVAL_DAYS;
  } else if (repetitions === 2) {
    return SECOND_INTERVAL_DAYS;
  } else {
    // Multiply previous interval by easiness factor
    return Math.round(previousInterval * easinessFactor);
  }
};

/**
 * Calculate next review date by adding interval days to current date
 */
const calculateNextReviewDate = (intervalDays: number): Date => {
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + intervalDays);
  return nextReview;
};

/**
 * Core SM-2 update function
 * Updates word progress based on user's quality rating
 *
 * Decision Logic:
 * - Quality >= 3: Continue progression, increase interval
 * - Quality < 3: Reset to start, interval = 1 day, keep adjusted EF
 */
export const updateWordProgress = (
  wordId: string,
  familiarityLevel: FamiliarityLevel,
  existingProgress?: WordProgress
): WordProgress => {
  const now = new Date();
  const quality = familiarityToQuality[familiarityLevel];

  // Initialize defaults for new word
  const currentEF = existingProgress?.easinessFactor ?? DEFAULT_EASINESS_FACTOR;
  const currentInterval = existingProgress?.interval ?? INITIAL_INTERVAL_DAYS;
  const currentRepetitions = existingProgress?.repetitions ?? 0;
  const reviewCount = existingProgress ? existingProgress.reviewCount + 1 : 1;

  // Calculate new easiness factor (always adjust, even on failure)
  const newEF = calculateEasinessFactor(currentEF, quality);

  // Determine if answer was correct (quality >= 3)
  const isCorrect = quality >= 3;

  let newRepetitions: number;
  let newInterval: number;

  if (isCorrect) {
    // Correct answer: increment repetitions and increase interval
    newRepetitions = currentRepetitions + 1;
    newInterval = calculateInterval(newRepetitions, currentInterval, newEF);
  } else {
    // Incorrect answer: reset repetitions but keep the adjusted EF
    newRepetitions = 0;
    newInterval = INITIAL_INTERVAL_DAYS;
  }

  const nextReview = calculateNextReviewDate(newInterval);

  return {
    wordId,
    familiarityLevel,
    lastReviewed: now,
    nextReview,
    reviewCount,
    easinessFactor: newEF,
    interval: newInterval,
    repetitions: newRepetitions,
  };
};

/**
 * Check if a word is due for review
 * A word is due if current time >= scheduled next review time
 */
export const isDueForReview = (progress: WordProgress): boolean => {
  const now = new Date();
  return now >= progress.nextReview;
};

/**
 * Get all words that are due for review
 */
export const getDueWords = (allProgress: WordProgress[]): WordProgress[] => {
  return allProgress.filter(isDueForReview);
};

/**
 * Get human-readable interval description for UI
 */
export const getIntervalDescription = (intervalDays: number): string => {
  if (intervalDays === 1) return '1 day';
  if (intervalDays < 7) return `${intervalDays} days`;
  if (intervalDays < 30) return `${Math.round(intervalDays / 7)} weeks`;
  if (intervalDays < 365) return `${Math.round(intervalDays / 30)} months`;
  return `${Math.round(intervalDays / 365)} years`;
};
