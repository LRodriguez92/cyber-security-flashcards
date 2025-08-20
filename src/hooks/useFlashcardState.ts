import { useState, useCallback, useEffect } from 'react';
import type { Flashcard, ConfidenceTracking, StudyMode } from '../types/flashcard';
import { usePersistence } from './usePersistence';

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
  const [currentMode, setCurrentMode] = useState<StudyMode>('study');

  // Update last active on user interaction
  useEffect(() => {
    updateLastActive();
  }, [updateLastActive]);

  // Enhanced markConfidence with persistence
  const markConfidence = useCallback(async (confidenceLevel: string, currentCardData: Flashcard | undefined) => {
    if (!userProgress || !currentCardData) {
      return;
    }
    
    // Use the card's unique id instead of constructing one
    const cardId = currentCardData.id;
    
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

    // Save progress and sync to cloud
    await saveProgress({
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
  }, [userProgress, answered, currentCard, saveProgress, setSessionData]);

  // Enhanced reset functions
  const resetState = useCallback(async () => {
    if (!userProgress) return;
    
    setCurrentCard(0);
    setIsFlipped(false);
    setAnswered(false);
    setIsShuffled(false);
    setShuffledIndices([]);

    // End current session if exists
    if (sessionData.currentSessionId) {
      await endStudySession(sessionData.currentSessionId, {
        cardsStudied: sessionData.cardsInSession,
        correctAnswers: userProgress.score.correct,
        incorrectAnswers: userProgress.score.incorrect,
      });
    }

    // Reset progress and sync to cloud
    await saveProgress({
      confidenceTracking: {
        'knew-it': [],
        'quick-think': [],
        'long-think': [],
        'peeked': []
      },
      score: { correct: 0, incorrect: 0 },
      completedCards: [],
    });
  }, [userProgress, saveProgress, endStudySession, sessionData]);

  // Enhanced mode switching with session management
  const switchMode = useCallback(async (mode: StudyMode) => {
    if (!userProgress) return;
    
    // End current session
    if (sessionData.currentSessionId) {
      await endStudySession(sessionData.currentSessionId, {
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

    // Update local mode state (not persisted)
    setCurrentMode(mode);
  }, [userProgress, endStudySession, startStudySession, sessionData]);

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

  const handleDomainChange = useCallback(async (domainId: string) => {
    if (!userProgress) return;
    
    if (domainId === 'all') {
      await saveProgress({ selectedDomains: ['all'] });
    } else {
      const currentDomains = userProgress.selectedDomains;
      const withoutAll = currentDomains.filter((id: string) => id !== 'all');
      
      if (withoutAll.includes(domainId)) {
        const newSelection = withoutAll.filter((id: string) => id !== domainId);
        const finalSelection = newSelection.length === 0 ? ['all'] : newSelection;
        await saveProgress({ selectedDomains: finalSelection });
      } else {
        const finalSelection = [...withoutAll, domainId];
        await saveProgress({ selectedDomains: finalSelection });
      }
    }
    setCurrentCard(0);
    setIsFlipped(false);
    setAnswered(false);
    setIsShuffled(false);
    setShuffledIndices([]);
  }, [userProgress, saveProgress]);

  const handleConfidenceCategoryChange = useCallback(async (categoryId: string) => {
    if (!userProgress) return;
    
    const currentCategories = userProgress.selectedConfidenceCategories;
    const newCategories = currentCategories.includes(categoryId)
      ? currentCategories.filter((id: string) => id !== categoryId)
      : [...currentCategories, categoryId];
    
    await saveProgress({ selectedConfidenceCategories: newCategories });
    setCurrentCard(0);
    setIsFlipped(false);
    setAnswered(false);
    setIsShuffled(false);
    setShuffledIndices([]);
  }, [userProgress, saveProgress]);

  const getCurrentCardData = useCallback((filteredCards: Flashcard[]) => {
    if (isShuffled && shuffledIndices.length > 0) {
      const originalIndex = shuffledIndices[currentCard];
      return filteredCards[originalIndex];
    }
    return filteredCards[currentCard];
  }, [currentCard, isShuffled, shuffledIndices]);

  // If userProgress is null, return default values
  if (!userProgress) {
    return {
      // Default state values
      score: { correct: 0, incorrect: 0 },
      selectedDomains: ['all'],
      confidenceTracking: {
        'knew-it': [],
        'quick-think': [],
        'long-think': [],
        'peeked': [],
      },
      currentMode,
      selectedConfidenceCategories: [],
      studyFilter: 'all' as const,
      currentCard,
      isFlipped,
      answered,
      isShuffled,
      shuffledIndices,

      // Default actions (no-ops when not authenticated)
      resetState: async () => {},
      markConfidence: async () => {},
      switchMode: async () => {},
      nextCard,
      prevCard,
      flipCard,
      shuffleCards,
      handleDomainChange: async () => {},
      handleConfidenceCategoryChange: async () => {},
      getCurrentCardData,

      // Default setters
      setCurrentCard,
      setIsFlipped,
      setAnswered,
      setIsShuffled,
      setShuffledIndices,
      setSelectedDomains: async () => {},
      setSelectedConfidenceCategories: async () => {},
      setStudyFilter: async () => {},
      resetConfidenceCategories: async () => {},
    };
  }



  return {
    // State from persistence
    score: userProgress.score,
    selectedDomains: userProgress.selectedDomains,
    confidenceTracking: userProgress.confidenceTracking,
    currentMode,
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
    setSelectedDomains: async (domains: string[]) => await saveProgress({ selectedDomains: domains }),
    setSelectedConfidenceCategories: async (categories: string[]) => await saveProgress({ selectedConfidenceCategories: categories }),
    setStudyFilter: async (filter: 'all' | 'unanswered') => await saveProgress({ studyFilter: filter }),
    resetConfidenceCategories: async (categoriesToReset: string[]) => {
      const newTracking = { ...userProgress.confidenceTracking };
      categoriesToReset.forEach(category => {
        newTracking[category as keyof ConfidenceTracking] = [];
      });
      await saveProgress({ confidenceTracking: newTracking });
    }
  };
}; 