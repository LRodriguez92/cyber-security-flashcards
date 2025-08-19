import { useState, useCallback, useEffect } from 'react';
import type { Flashcard, ConfidenceTracking, StudyMode } from '../types/flashcard';
import { usePersistence } from './usePersistence';
import { cloudSyncService } from '../services/cloudSync';

export const useFlashcardState = () => {
  const {
    userProgress,
    saveProgress,
    updateLastActive,
    startStudySession,
    endStudySession,
    sessionData,
    setSessionData,
  } = usePersistence();

  // Local state (not persisted)
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

  // Initialize cloud sync
  useEffect(() => {
    cloudSyncService.initialize().catch(console.error);
  }, []);

  // Update last active on user interaction
  useEffect(() => {
    updateLastActive();
  }, [updateLastActive]);

  // Enhanced markConfidence with persistence
  const markConfidence = useCallback((confidenceLevel: string, currentCardData: Flashcard | undefined) => {
    if (!answered && currentCardData) {
      const cardId = `${currentCardData.domain}-${currentCard}`;
      
      // Update confidence tracking
      const newConfidenceTracking = {
        'knew-it': userProgress.confidenceTracking['knew-it'].filter((id: string) => id !== cardId),
        'quick-think': userProgress.confidenceTracking['quick-think'].filter((id: string) => id !== cardId),
        'long-think': userProgress.confidenceTracking['long-think'].filter((id: string) => id !== cardId),
        'peeked': userProgress.confidenceTracking['peeked'].filter((id: string) => id !== cardId)
      };

      newConfidenceTracking[confidenceLevel as keyof ConfidenceTracking] = [
        ...newConfidenceTracking[confidenceLevel as keyof ConfidenceTracking],
        cardId
      ];

      // Update score
      const isCorrect = confidenceLevel !== 'peeked';
      const newScore = {
        ...userProgress.score,
        [isCorrect ? 'correct' : 'incorrect']: userProgress.score[isCorrect ? 'correct' : 'incorrect'] + 1
      };

      // Update completed cards
      const newCompletedCards = [...userProgress.completedCards];
      if (!newCompletedCards.includes(cardId)) {
        newCompletedCards.push(cardId);
      }

      // Save progress
      saveProgress({
        confidenceTracking: newConfidenceTracking,
        score: newScore,
        completedCards: newCompletedCards,
      });

      // Update session data
      setSessionData((prev: { sessionStartTime: Date; currentSessionId: string; cardsInSession: number }) => ({
        ...prev,
        cardsInSession: prev.cardsInSession + 1,
      }));

      setAnswered(true);
    }
  }, [answered, currentCard, userProgress, saveProgress]);

  // Enhanced reset functions
  const resetState = useCallback(() => {
    setCurrentCard(0);
    setIsFlipped(false);
    setAnswered(false);
    setIsShuffled(false);
    setShuffledIndices([]);

    // End current session if exists
    if (sessionData.currentSessionId) {
      endStudySession(sessionData.currentSessionId, {
        cardsStudied: sessionData.cardsInSession,
        correctAnswers: userProgress.score.correct,
        incorrectAnswers: userProgress.score.incorrect,
      });
    }

    // Reset progress
    saveProgress({
      confidenceTracking: {
        'knew-it': [],
        'quick-think': [],
        'long-think': [],
        'peeked': []
      },
      score: { correct: 0, incorrect: 0 },
      completedCards: [],
    });
  }, [saveProgress, endStudySession, sessionData, userProgress.score]);

  // Enhanced mode switching with session management
  const switchMode = useCallback((mode: StudyMode) => {
    // End current session
    if (sessionData.currentSessionId) {
      endStudySession(sessionData.currentSessionId, {
        cardsStudied: sessionData.cardsInSession,
        correctAnswers: userProgress.score.correct,
        incorrectAnswers: userProgress.score.incorrect,
      });
    }

    // Start new session
    startStudySession(mode, userProgress.selectedDomains);

    // Reset local state
    setCurrentCard(0);
    setIsFlipped(false);
    setAnswered(false);
    setIsShuffled(false);
    setShuffledIndices([]);

    // Update mode
    saveProgress({ currentMode: mode });
  }, [saveProgress, endStudySession, startStudySession, sessionData, userProgress]);

  const nextCard = useCallback(() => {
    setCurrentCard(prev => prev + 1);
    setIsFlipped(false);
    setAnswered(false);
  }, []);

  const prevCard = useCallback(() => {
    setCurrentCard(prev => {
      if (prev <= 0) {
        return 0; // Stay at the first card
      }
      return prev - 1;
    });
    setIsFlipped(false);
    setAnswered(false);
  }, []);

  const flipCard = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const shuffleCards = useCallback((filteredCards: Flashcard[]) => {
    if (isShuffled) {
      setIsShuffled(false);
      setShuffledIndices([]);
    } else {
      const indices = Array.from({ length: filteredCards.length }, (_, i) => i);
      const shuffled = [...indices].sort(() => Math.random() - 0.5);
      setShuffledIndices(shuffled);
      setIsShuffled(true);
    }
    setCurrentCard(0);
    setIsFlipped(false);
    setAnswered(false);
  }, [isShuffled]);

  const handleDomainChange = useCallback((domainId: string) => {
    if (domainId === 'all') {
      saveProgress({ selectedDomains: ['all'] });
    } else {
      const currentDomains = userProgress.selectedDomains;
      const withoutAll = currentDomains.filter((id: string) => id !== 'all');
      
      if (withoutAll.includes(domainId)) {
        const newSelection = withoutAll.filter((id: string) => id !== domainId);
        const finalSelection = newSelection.length === 0 ? ['all'] : newSelection;
        saveProgress({ selectedDomains: finalSelection });
      } else {
        const finalSelection = [...withoutAll, domainId];
        saveProgress({ selectedDomains: finalSelection });
      }
    }
    setCurrentCard(0);
    setIsFlipped(false);
    setAnswered(false);
    setIsShuffled(false);
    setShuffledIndices([]);
  }, [userProgress.selectedDomains, saveProgress]);

  const handleConfidenceCategoryChange = useCallback((categoryId: string) => {
    const currentCategories = userProgress.selectedConfidenceCategories;
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id: string) => id !== categoryId)
      : [...currentCategories, categoryId];
    
    saveProgress({ selectedConfidenceCategories: newCategories });
    setCurrentCard(0);
    setIsFlipped(false);
    setAnswered(false);
    setIsShuffled(false);
    setShuffledIndices([]);
  }, [userProgress.selectedConfidenceCategories, saveProgress]);

  const getCurrentCardData = useCallback((filteredCards: Flashcard[]) => {
    if (isShuffled && shuffledIndices.length > 0) {
      const originalIndex = shuffledIndices[currentCard];
      return filteredCards[originalIndex];
    }
    return filteredCards[currentCard];
  }, [currentCard, isShuffled, shuffledIndices]);

  return {
    // State from persistence
    score: userProgress.score,
    selectedDomains: userProgress.selectedDomains,
    confidenceTracking: userProgress.confidenceTracking,
    currentMode: userProgress.currentMode,
    selectedConfidenceCategories: userProgress.selectedConfidenceCategories,
    studyFilter: userProgress.studyFilter,

    // Local state
    currentCard,
    isFlipped,
    answered,
    isShuffled,
    shuffledIndices,

    // Actions
    resetState,
    markConfidence,
    switchMode,
    nextCard,
    prevCard,
    flipCard,
    shuffleCards,
    handleDomainChange,
    handleConfidenceCategoryChange,
    getCurrentCardData,
    
    // Setters
    setCurrentCard,
    setIsFlipped,
    setAnswered,
    setIsShuffled,
    setShuffledIndices,
    
    // Additional setters for components
    setSelectedDomains: (domains: string[]) => saveProgress({ selectedDomains: domains }),
    setSelectedConfidenceCategories: (categories: string[]) => saveProgress({ selectedConfidenceCategories: categories }),
    setStudyFilter: (filter: 'all' | 'unanswered') => saveProgress({ studyFilter: filter }),
    resetConfidenceCategories: (categoriesToReset: string[]) => {
      const newTracking = { ...userProgress.confidenceTracking };
      categoriesToReset.forEach(category => {
        newTracking[category as keyof ConfidenceTracking] = [];
      });
      saveProgress({ confidenceTracking: newTracking });
    }
  };
}; 