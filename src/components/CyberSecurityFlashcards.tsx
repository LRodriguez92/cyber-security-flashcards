import React, { useState } from 'react';
import { Settings, ChevronDown } from 'lucide-react';
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
  const [showFilters, setShowFilters] = useState(false);
  
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-4 sm:p-6">

      
      <div className="max-w-4xl mx-auto">
        <Header />



        <ModeSelector 
          currentMode={currentMode}
          onModeChange={switchMode}
        />

        {/* Progressive Filter Disclosure */}
        <div className="mb-6">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors w-full justify-center sm:justify-start focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg p-2"
            aria-label={showFilters ? "Hide study options" : "Show study options"}
            aria-expanded={showFilters}
          >
            <Settings className="w-4 h-4" />
            <span>Study Options</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
          
          <div className={`mt-3 overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
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
          </div>
        </div>


        <ScoreDisplay confidenceTracking={confidenceTracking} />

        <ProgressBar 
          currentCard={currentCard}
          totalCards={filteredCards.length}
        />
        
        {/* Flashcard or Empty State */}
        {filteredCards.length > 0 ? (
          <>
            <Flashcard
              card={currentCardData!}
              isFlipped={isFlipped}
              isShuffled={isShuffled}
              onFlip={flipCard}
              onShuffle={handleShuffle}
              onSwipeLeft={nextCard}
              onSwipeRight={prevCard}
              onPrev={prevCard}
              onNext={nextCard}
              currentCard={currentCard}
              totalCards={filteredCards.length}
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

        <Navigation onReset={resetState} />

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