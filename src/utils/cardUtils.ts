import type { Flashcard, ConfidenceTracking } from '../types/flashcard';
import { flashcards } from '../data/flashcards';

export const getFilteredCards = (
  selectedDomains: string[],
  currentMode: 'study' | 'review',
  selectedConfidenceCategories: string[],
  confidenceTracking: ConfidenceTracking
): Flashcard[] => {
  const baseFiltered = selectedDomains.includes('all') 
    ? flashcards 
    : flashcards.filter(card => selectedDomains.includes(card.domain));

  if (currentMode === 'review' && selectedConfidenceCategories.length > 0) {
    // Filter cards that are in the selected confidence categories
    return baseFiltered.filter((card, index) => {
      const cardId = `${card.domain}-${index}`;
      return selectedConfidenceCategories.some(category => 
        confidenceTracking[category as keyof ConfidenceTracking].includes(cardId)
      );
    });
  }

  return baseFiltered;
}; 