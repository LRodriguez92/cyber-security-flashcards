export interface Flashcard {
  question: string;
  answer: string;
  domain: string;
  domainNumber: string;
  objective: string;
  color: string;
}

export interface Domain {
  id: string;
  name: string;
  color: string;
  domainNumber: string;
}

export interface ConfidenceCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export interface ConfidenceTracking {
  'knew-it': string[];
  'quick-think': string[];
  'long-think': string[];
  'peeked': string[];
}

export interface Score {
  correct: number;
  incorrect: number;
}

export type StudyMode = 'study' | 'review';

export interface CardColors {
  front: string;
  back: string;
  accent: string;
}

export interface UserProgress {
  userId: string;
  confidenceTracking: ConfidenceTracking;
  score: Score;
  selectedDomains: string[];
  selectedConfidenceCategories: string[];
  studyFilter: 'all' | 'unanswered';
  currentMode: StudyMode;
  lastStudied: Date;
  totalStudyTime: number;
  streakDays: number;
  completedCards: string[]; // Card IDs that have been answered
  studySessions: StudySession[];
  lastSyncTimestamp: Date;
  version: string; // For data migration
}

export interface StudySession {
  id: string;
  startTime: Date;
  endTime?: Date;
  cardsStudied: number;
  correctAnswers: number;
  incorrectAnswers: number;
  domains: string[];
  mode: StudyMode;
}

export interface SyncStatus {
  isOnline: boolean;
  lastSync: Date | null;
  pendingChanges: boolean;
  syncInProgress: boolean;
  error: string | null;
}

export interface UserProfile {
  id: string;
  email?: string;
  displayName?: string;
  createdAt: Date;
  lastActive: Date;
  preferences: {
    theme: 'light' | 'dark' | 'auto';
    notifications: boolean;
    autoSync: boolean;
  };
} 