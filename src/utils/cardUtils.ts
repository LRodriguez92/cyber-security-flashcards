import type { Flashcard, ConfidenceTracking } from '../types/flashcard';
import { flashcards } from '../data/flashcards';

export const getFilteredCards = (
  selectedDomains: string[],
  currentMode: 'study' | 'review',
  selectedConfidenceCategories: string[],
  confidenceTracking: ConfidenceTracking,
  studyFilter: 'all' | 'unanswered' = 'all'
): Flashcard[] => {
  const baseFiltered = selectedDomains.includes('all') 
    ? flashcards 
    : flashcards.filter(card => selectedDomains.includes(card.domain));

  if (currentMode === 'review') {
    if (selectedConfidenceCategories.length === 0) {
      // No confidence categories selected in review mode - show no cards
      return [];
    }
    // Filter cards that are in the selected confidence categories
    return baseFiltered.filter((card) => {
      return selectedConfidenceCategories.some(category => 
        confidenceTracking[category as keyof ConfidenceTracking].includes(card.id)
      );
    });
  }

  if (currentMode === 'study' && studyFilter === 'unanswered') {
    // Get all card IDs that have been answered
    const answeredCardIds = new Set<string>();
    Object.values(confidenceTracking).forEach(cardIds => {
      cardIds.forEach((id: string) => answeredCardIds.add(id));
    });

    // Filter out cards that have been answered
    return baseFiltered.filter((card) => {
      return !answeredCardIds.has(card.id);
    });
  }

  return baseFiltered;
}; 