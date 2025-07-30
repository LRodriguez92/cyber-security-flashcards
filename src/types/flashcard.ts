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