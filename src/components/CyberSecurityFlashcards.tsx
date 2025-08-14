import React, { useState, useEffect, useRef } from 'react';
import { Settings, ChevronDown, X } from 'lucide-react';
import { useFlashcardState } from '../hooks/useFlashcardState';

import { getFilteredCards } from '../utils/cardUtils';
import { domains, confidenceCategories } from '../data/flashcards';


// Import components
import Header from './Header';
import ModeSelector from './ModeSelector';
import DomainFilter from './DomainFilter';
import ConfidenceFilter from './ConfidenceFilter';

import Flashcard from './Flashcard';
import ConfidenceButtons from './ConfidenceButtons';
import Navigation from './Navigation';
import CompletionMessage from './CompletionMessage';
import EmptyState from './EmptyState';

const CyberSecurityFlashcards: React.FC = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const filtersRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  
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

  // Click outside handler for mobile overlays
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showFilters && filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
      if (isExpanded && statsRef.current && !statsRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilters, isExpanded]);

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
    <div className="min-h-screen min-h-dvh bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-3 sm:p-4 lg:p-6 mobile-safe-padding">

      
      <div className="max-w-4xl mx-auto">
        <Header />



        <ModeSelector 
          currentMode={currentMode}
          onModeChange={switchMode}
        />

                 {/* Side-by-side Study Options and Progress Summary */}
         <div className="mb-4 sm:mb-6 relative">
           {/* Mobile backdrop overlay */}
           {(showFilters || isExpanded) && (
             <div 
               className="fixed inset-0 bg-black/30 backdrop-blur-sm mobile-backdrop sm:hidden transition-opacity duration-300"
               onClick={() => {
                 setShowFilters(false);
                 setIsExpanded(false);
               }}
             />
           )}
          <div className="flex gap-3">
            {/* Study Options */}
            <div className="flex-1">
                             <button 
                 onClick={() => {
                   if (showFilters) {
                     setShowFilters(false);
                   } else {
                     setShowFilters(true);
                     setIsExpanded(false); // Close stats if open
                   }
                 }}
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
                 onClick={() => {
                   if (isExpanded) {
                     setIsExpanded(false);
                   } else {
                     setIsExpanded(true);
                     setShowFilters(false); // Close filters if open
                   }
                 }}
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
          
                     {/* Expanded content areas - Mobile overlay, Desktop inline */}
           <div className="mt-3 space-y-3 sm:block">
             {/* Study Options Content */}
             <div ref={filtersRef} className={`sm:overflow-hidden sm:transition-all sm:duration-300 sm:${showFilters ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} ${showFilters ? 'block' : 'hidden'} sm:block absolute sm:relative top-full left-0 right-0 mobile-overlay bg-slate-900/95 backdrop-blur-md sm:bg-transparent sm:backdrop-blur-none rounded-lg border border-slate-600/50 sm:border-none shadow-2xl sm:shadow-none transition-all duration-300 ease-out ${showFilters ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
               <div className="p-4 sm:p-0">
                 {/* Mobile close button */}
                 <div className="flex justify-end sm:hidden mb-2">
                   <button
                     onClick={() => setShowFilters(false)}
                     className="text-white/70 hover:text-white transition-colors p-1 -mt-1 -mr-1"
                     aria-label="Close filters"
                   >
                     <X className="w-4 h-4" />
                   </button>
                 </div>
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
            </div>

                         {/* Progress Summary Content */}
             <div ref={statsRef} className={`sm:overflow-hidden sm:transition-all sm:duration-300 sm:${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} ${isExpanded ? 'block' : 'hidden'} sm:block absolute sm:relative top-full left-0 right-0 mobile-overlay bg-slate-900/95 backdrop-blur-md sm:bg-transparent sm:backdrop-blur-none rounded-lg border border-slate-600/50 sm:border-none shadow-2xl sm:shadow-none transition-all duration-300 ease-out ${isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
               <div className="p-4 sm:p-0">
                 {/* Mobile close button */}
                 <div className="flex justify-end sm:hidden mb-2">
                   <button
                     onClick={() => setIsExpanded(false)}
                     className="text-white/70 hover:text-white transition-colors p-1 -mt-1 -mr-1"
                     aria-label="Close stats"
                   >
                     <X className="w-4 h-4" />
                   </button>
                 </div>
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