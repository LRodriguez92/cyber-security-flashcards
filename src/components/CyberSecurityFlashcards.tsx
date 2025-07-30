import React, { useState, useEffect } from 'react';
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
  const [isExpanded, setIsExpanded] = useState(false);
  
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

  useEffect(() => {
    if (currentMode === 'review') {
      setShowFilters(true);
    } else if (currentMode === 'study') {
      setShowFilters(false);
    }
  }, [currentMode]);

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

        {/* Side-by-side Study Options and Progress Summary */}
        <div className="mb-4 sm:mb-6">
          <div className="flex gap-3">
            {/* Study Options */}
            <div className="flex-1">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 sm:gap-2 text-white/80 hover:text-white transition-colors w-full justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg p-1.5 sm:p-2 text-xs sm:text-sm"
                aria-label={showFilters ? "Hide study options" : "Show study options"}
                aria-expanded={showFilters}
              >
                <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline">
                  {currentMode === 'review' ? 'Select Categories' : 'Select Domains'}
                </span>
                <span className="xs:hidden">
                  {currentMode === 'review' ? 'Categories' : 'Domains'}
                </span>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Progress Summary Toggle */}
            <div className="flex-1">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 sm:gap-2 text-blue-200 hover:text-blue-100 transition-colors w-full justify-center focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900 rounded-lg p-1.5 sm:p-2 text-xs sm:text-sm"
                aria-label={isExpanded ? "Hide progress summary" : "Show progress summary"}
                aria-expanded={isExpanded}
              >
                <span>📊</span>
                <span className="hidden xs:inline">Progress</span>
                <span className="xs:hidden">Stats</span>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Expanded content areas */}
          <div className="mt-3 space-y-3">
            {/* Study Options Content */}
            <div className={`overflow-hidden transition-all duration-300 ${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              {currentMode === 'study' && (
                <DomainFilter
                  domains={domains}
                  selectedDomains={selectedDomains}
                  onDomainChange={handleDomainChange}
                />
              )}
              {currentMode === 'review' && (
                <ConfidenceFilter
                  confidenceCategories={confidenceCategories}
                  selectedConfidenceCategories={selectedConfidenceCategories}
                  confidenceTracking={confidenceTracking}
                  onConfidenceCategoryChange={handleConfidenceCategoryChange}
                />
              )}
            </div>

            {/* Progress Summary Content */}
            <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                <div className="flex items-center gap-1.5 sm:gap-2 bg-green-900/30 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-green-500/30">
                  <span className="text-sm sm:text-lg">⚡</span>
                  <span className="text-green-400 font-semibold text-xs sm:text-sm">Knew: {confidenceTracking['knew-it'].length}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 bg-blue-900/30 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-blue-500/30">
                  <span className="text-sm sm:text-lg">🤔</span>
                  <span className="text-blue-400 font-semibold text-xs sm:text-sm">Brief: {confidenceTracking['quick-think'].length}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 bg-yellow-900/30 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-yellow-500/30">
                  <span className="text-sm sm:text-lg">🧠</span>
                  <span className="text-yellow-400 font-semibold text-xs sm:text-sm">Long: {confidenceTracking['long-think'].length}</span>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 bg-red-900/30 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-red-500/30">
                  <span className="text-sm sm:text-lg">👀</span>
                  <span className="text-red-400 font-semibold text-xs sm:text-sm">Peek: {confidenceTracking['peeked'].length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>


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
          <CompletionMessage />
        )}
      </div>
    </div>
  );
};

export default CyberSecurityFlashcards; 