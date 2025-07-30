import React from 'react';
import { useFlashcardState } from '../hooks/useFlashcardState';
import { getFilteredCards } from '../utils/cardUtils';
import { domains, confidenceCategories } from '../data/flashcards';

// Import components
import Header from './Header';
import ModeSelector from './ModeSelector';
import DomainFilter from './DomainFilter';
import ConfidenceFilter from './ConfidenceFilter';
import ProgressBar from './ProgressBar';
import ScoreDisplay from './ScoreDisplay';
import Flashcard from './Flashcard';
import ConfidenceButtons from './ConfidenceButtons';
import Navigation from './Navigation';
import CompletionMessage from './CompletionMessage';
import EmptyState from './EmptyState';

const CyberSecurityFlashcards: React.FC = () => {
  const {
    // State
    currentCard,
    isFlipped,
    answered,
    selectedDomains,
    confidenceTracking,
    currentMode,
    selectedConfidenceCategories,
    isShuffled,
    
    // Actions
    resetState,
    nextCard,
    prevCard,
    flipCard,
    markConfidence,
    shuffleCards,
    handleDomainChange,
    handleConfidenceCategoryChange,
    switchMode,
    getCurrentCardData,
  } = useFlashcardState();

  // Get filtered cards based on current state
  const filteredCards = getFilteredCards(
    selectedDomains,
    currentMode,
    selectedConfidenceCategories,
    confidenceTracking
  );

  // Get current card data
  const currentCardData = getCurrentCardData(filteredCards);

  // Handle confidence marking with current card data
  const handleMarkConfidence = (confidenceLevel: string) => {
    markConfidence(confidenceLevel, currentCardData);
  };

  // Handle shuffle with filtered cards
  const handleShuffle = () => {
    shuffleCards(filteredCards);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <Header />

        <ModeSelector 
          currentMode={currentMode}
          onModeChange={switchMode}
        />

        {/* Domain Filter - Only show in study mode */}
        {currentMode === 'study' && (
          <DomainFilter
            domains={domains}
            selectedDomains={selectedDomains}
            onDomainChange={handleDomainChange}
          />
        )}

        {/* Confidence Category Filter - Only show in review mode */}
        {currentMode === 'review' && (
          <ConfidenceFilter
            confidenceCategories={confidenceCategories}
            selectedConfidenceCategories={selectedConfidenceCategories}
            confidenceTracking={confidenceTracking}
            onConfidenceCategoryChange={handleConfidenceCategoryChange}
          />
        )}

        <ProgressBar 
          currentCard={currentCard}
          totalCards={filteredCards.length}
        />

        <ScoreDisplay confidenceTracking={confidenceTracking} />

        {/* Flashcard or Empty State */}
        {filteredCards.length > 0 ? (
          <>
            <Flashcard
              card={currentCardData!}
              isFlipped={isFlipped}
              isShuffled={isShuffled}
              onFlip={flipCard}
              onShuffle={handleShuffle}
            />

            {/* Confidence Buttons - Only show in study mode */}
            {currentMode === 'study' && isFlipped && (
              <ConfidenceButtons
                answered={answered}
                onMarkConfidence={handleMarkConfidence}
              />
            )}
          </>
        ) : (
          <EmptyState currentMode={currentMode} />
        )}

        <Navigation
          currentCard={currentCard}
          totalCards={filteredCards.length}
          onPrev={prevCard}
          onNext={nextCard}
          onReset={resetState}
        />

        {/* Completion Message */}
        {currentCard === filteredCards.length - 1 && answered && filteredCards.length > 0 && (
          <CompletionMessage
            confidenceTracking={confidenceTracking}
            totalCards={filteredCards.length}
          />
        )}
      </div>
    </div>
  );
};

export default CyberSecurityFlashcards; 