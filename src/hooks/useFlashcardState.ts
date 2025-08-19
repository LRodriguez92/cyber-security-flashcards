import { useState, useCallback } from 'react';
import type { Flashcard, ConfidenceTracking, Score, StudyMode } from '../types/flashcard';

export const useFlashcardState = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [score, setScore] = useState<Score>({ correct: 0, incorrect: 0 });
  const [answered, setAnswered] = useState(false);
  const [selectedDomains, setSelectedDomains] = useState(['all']);
  const [confidenceTracking, setConfidenceTracking] = useState<ConfidenceTracking>({
    'knew-it': [],
    'quick-think': [],
    'long-think': [],
    'peeked': []
  });
  const [currentMode, setCurrentMode] = useState<StudyMode>('study');
  const [selectedConfidenceCategories, setSelectedConfidenceCategories] = useState<string[]>([]);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

  const resetState = useCallback(() => {
    setCurrentCard(0);
    setIsFlipped(false);
    setScore({ correct: 0, incorrect: 0 });
    setAnswered(false);
    setConfidenceTracking({
      'knew-it': [],
      'quick-think': [],
      'long-think': [],
      'peeked': []
    });
    setCurrentMode('study');
    setSelectedConfidenceCategories([]);
    setIsShuffled(false);
    setShuffledIndices([]);
  }, []);

  const resetConfidenceCategories = useCallback((categoriesToReset: string[]) => {
    setCurrentCard(0);
    setIsFlipped(false);
    setScore({ correct: 0, incorrect: 0 });
    setAnswered(false);
    
    setConfidenceTracking(prev => {
      const newTracking = { ...prev };
      categoriesToReset.forEach(category => {
        newTracking[category as keyof ConfidenceTracking] = [];
      });
      return newTracking;
    });
    
    setIsShuffled(false);
    setShuffledIndices([]);
  }, []);

  const nextCard = useCallback(() => {
    setCurrentCard(prev => prev + 1);
    setIsFlipped(false);
    setAnswered(false);
  }, []);

  const prevCard = useCallback(() => {
    setCurrentCard(prev => prev - 1);
    setIsFlipped(false);
    setAnswered(false);
  }, []);

  const flipCard = useCallback(() => {
    setIsFlipped(prev => !prev);
  }, []);

  const markConfidence = useCallback((confidenceLevel: string, currentCardData: Flashcard | undefined) => {
    if (!answered && currentCardData) {
      const cardId = `${currentCardData.domain}-${currentCard}`;
      
      setConfidenceTracking(prev => {
        const cleaned = {
          'knew-it': prev['knew-it'].filter((id: string) => id !== cardId),
          'quick-think': prev['quick-think'].filter((id: string) => id !== cardId),
          'long-think': prev['long-think'].filter((id: string) => id !== cardId),
          'peeked': prev['peeked'].filter((id: string) => id !== cardId)
        };
        
        return {
          ...cleaned,
          [confidenceLevel]: [...cleaned[confidenceLevel as keyof typeof cleaned], cardId]
        };
      });

      const isCorrect = confidenceLevel !== 'peeked';
      setScore(prev => ({
        ...prev,
        [isCorrect ? 'correct' : 'incorrect']: prev[isCorrect ? 'correct' : 'incorrect'] + 1
      }));
      
      setAnswered(true);
      
      // Automatically advance to the next card after a short delay
      setTimeout(() => {
        setCurrentCard(prev => prev + 1);
        setIsFlipped(false);
        setAnswered(false);
      }, 500); // 500ms delay to show the confidence selection briefly
    }
  }, [answered, currentCard]);

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
      setSelectedDomains(['all']);
    } else {
      setSelectedDomains(prev => {
        const withoutAll = prev.filter(id => id !== 'all');
        
        if (withoutAll.includes(domainId)) {
          const newSelection = withoutAll.filter(id => id !== domainId);
          return newSelection.length === 0 ? ['all'] : newSelection;
        } else {
          return [...withoutAll, domainId];
        }
      });
    }
    setCurrentCard(0);
    setIsFlipped(false);
    setAnswered(false);
    setIsShuffled(false);
    setShuffledIndices([]);
  }, []);

  const handleConfidenceCategoryChange = useCallback((categoryId: string) => {
    setSelectedConfidenceCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
    setCurrentCard(0);
    setIsFlipped(false);
    setAnswered(false);
    setIsShuffled(false);
    setShuffledIndices([]);
  }, []);

  const switchMode = useCallback((mode: StudyMode) => {
    setCurrentMode(mode);
    setCurrentCard(0);
    setIsFlipped(false);
    setAnswered(false);
    setIsShuffled(false);
    setShuffledIndices([]);
    if (mode === 'study') {
      setSelectedConfidenceCategories([]);
    }
  }, []);

  const getCurrentCardData = useCallback((filteredCards: Flashcard[]) => {
    if (isShuffled && shuffledIndices.length > 0) {
      const originalIndex = shuffledIndices[currentCard];
      return filteredCards[originalIndex];
    }
    return filteredCards[currentCard];
  }, [currentCard, isShuffled, shuffledIndices]);

  return {
    // State
    currentCard,
    isFlipped,
    score,
    answered,
    selectedDomains,
    confidenceTracking,
    currentMode,
    selectedConfidenceCategories,
    isShuffled,
    shuffledIndices,
    
    // Actions
    resetState,
    resetConfidenceCategories,
    nextCard,
    prevCard,
    flipCard,
    markConfidence,
    shuffleCards,
    handleDomainChange,
    handleConfidenceCategoryChange,
    switchMode,
    getCurrentCardData,
    
    // Setters
    setCurrentCard,
    setIsFlipped,
    setScore,
    setAnswered,
    setSelectedDomains,
    setConfidenceTracking,
    setCurrentMode,
    setSelectedConfidenceCategories,
    setIsShuffled,
    setShuffledIndices
  };
}; 